import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

let sharedLenis = null;
let lenisCount = 0;
let sharedRafId = null;

export const ScrollStackItem = ({ children, itemClassName = '', ...props }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} {...props}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  useWindowScroll = false,
  rotateXAmount = 0,
  rotateYAmount = 0,
  opacityEnd = 1
}) => {
  const scrollerRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const positionsRef = useRef([]);
  const endTopRef = useRef(0);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const measurePositions = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;
    const endEl = scrollerRef.current?.querySelector('.scroll-stack-end');
    if (useWindowScroll) {
      cards.forEach((card, i) => {
        const appliedY = lastTransformsRef.current.get(i)?.y || 0;
        positionsRef.current[i] = card.getBoundingClientRect().top + window.scrollY - appliedY;
      });
      endTopRef.current = endEl ? endEl.getBoundingClientRect().top + window.scrollY : 0;
    } else {
      cards.forEach((card, i) => {
        positionsRef.current[i] = card.offsetTop;
      });
      endTopRef.current = endEl ? endEl.offsetTop : 0;
    }
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPx = parsePercentage(stackPosition, containerHeight);
    const endPx = parsePercentage(scaleEndPosition, containerHeight);
    const pinEnd = endTopRef.current - containerHeight / 2;

    cards.forEach((card, i) => {
      let cardTop = positionsRef.current[i];
      if (cardTop == null) {
        const appliedY = lastTransformsRef.current.get(i)?.y || 0;
        cardTop = useWindowScroll
          ? card.getBoundingClientRect().top + window.scrollY - appliedY
          : card.offsetTop;
        positionsRef.current[i] = cardTop;
      }

      const triggerStart = cardTop - stackPx - itemStackDistance * i;
      const triggerEnd = cardTop - endPx;

      let translateY;
      let scale;
      let rotX = 0;
      let rotY = 0;
      let rotZ = 0;
      let opacity = 1;

      if (scrollTop < triggerStart) {
        // Scrolled above the stack: restore the natural state so cards
        // are never left stuck in a stacked position.
        translateY = 0;
        scale = 1;
      } else {
        const t = calculateProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale = baseScale + i * itemScale;
        scale = 1 - t * (1 - targetScale);

        if (scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackPx + itemStackDistance * i;
        } else {
          translateY = pinEnd - cardTop + stackPx + itemStackDistance * i;
        }

        rotX = rotateXAmount ? -rotateXAmount * t : 0;
        rotY = rotateYAmount ? rotateYAmount * t : 0;
        rotZ = rotationAmount ? rotationAmount * t * i : 0;
        opacity = 1 - (1 - opacityEnd) * Math.max(0, Math.min(1, (t - 0.2) / 0.8));
      }

      const roundedY = Math.round(translateY * 100) / 100;
      const roundedScale = Math.round(scale * 1000) / 1000;
      const roundedRotX = Math.round(rotX * 100) / 100;
      const roundedRotY = Math.round(rotY * 100) / 100;
      const roundedRotZ = Math.round(rotZ * 100) / 100;
      const roundedOpacity = Math.round(opacity * 100) / 100;
      const last = lastTransformsRef.current.get(i);

      const rotStr = `rotateX(${roundedRotX}deg) rotateY(${roundedRotY}deg) rotateZ(${roundedRotZ}deg)`;
      if (!last || last.y !== roundedY || last.s !== roundedScale || last.rx !== roundedRotX || last.ry !== roundedRotY || last.rz !== roundedRotZ || last.o !== roundedOpacity) {
        card.style.transform = `translate3d(0, ${roundedY}px, 0) scale(${roundedScale}) ${rotStr}`;
        card.style.opacity = roundedOpacity;
        lastTransformsRef.current.set(i, { y: roundedY, s: roundedScale, rx: roundedRotX, ry: roundedRotY, rz: roundedRotZ, o: roundedOpacity });
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    useWindowScroll,
    calculateProgress,
    parsePercentage,
    getScrollData,
    rotateXAmount,
    rotateYAmount,
    opacityEnd,
    measurePositions
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const recompute = useCallback(() => {
    measurePositions();
    updateCardTransforms();
  }, [measurePositions, updateCardTransforms]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    // Initialize card styles
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.zIndex = `${i + 1}`;
    });

    recompute();
    window.addEventListener('resize', recompute);
    window.addEventListener('load', recompute);
    if (document.fonts?.ready) {
      document.fonts.ready.then(recompute).catch(() => {});
    }
    const resizeObserver = new ResizeObserver(recompute);
    cards.forEach(card => resizeObserver.observe(card));

    if (useWindowScroll) {
      lenisCount++;
      if (!sharedLenis) {
        sharedLenis = new Lenis({
          duration: 1.2,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
          infinite: false,
          wheelMultiplier: 1,
          lerp: 0.1,
          syncTouch: true,
          syncTouchLerp: 0.3
        });

        const raf = time => {
          sharedLenis?.raf(time);
          sharedRafId = requestAnimationFrame(raf);
        };
        sharedRafId = requestAnimationFrame(raf);
      }
      lenisRef.current = sharedLenis;
      sharedLenis.on('scroll', handleScroll);
    } else {
      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        normalizeWheel: true,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.3
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      lenisRef.current = lenis;
    }

    updateCardTransforms();

    return () => {
      if (useWindowScroll) {
        sharedLenis?.off('scroll', handleScroll);
        lenisCount--;
        if (lenisCount <= 0 && sharedLenis) {
          cancelAnimationFrame(sharedRafId);
          sharedLenis.destroy();
          sharedLenis = null;
          sharedRafId = null;
        }
      } else if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      cardsRef.current = [];
      transformsCache.clear();
      positionsRef.current = [];
      endTopRef.current = 0;
      resizeObserver.disconnect();
      window.removeEventListener('resize', recompute);
      window.removeEventListener('load', recompute);
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    useWindowScroll,
    handleScroll,
    recompute
  ]);

  return (
      <div
        ref={scrollerRef}
        className={`${useWindowScroll ? '' : 'scroll-stack-scroller'} ${className}`.trim()}
      >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
