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
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete = undefined,
  perspective = 0,
  rotateXAmount = 0,
  rotateYAmount = 0,
  opacityEnd = 1
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
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
        positionsRef.current[i] = card.getBoundingClientRect().top + window.scrollY;
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
    const endTop = endTopRef.current;

    cards.forEach((card, i) => {
      let cardTop = positionsRef.current[i];
      if (cardTop == null) {
        cardTop = useWindowScroll
          ? card.getBoundingClientRect().top + window.scrollY
          : card.offsetTop;
        positionsRef.current[i] = cardTop;
      }

      const triggerStart = cardTop - stackPx - itemStackDistance * i;
      const triggerEnd = cardTop - endPx;
      const pinStart = cardTop - stackPx - itemStackDistance * i;
      const pinEnd = endTop - containerHeight / 2;

      const t = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - t * (1 - targetScale);

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPx + itemStackDistance * i;
      }

      const rotX = rotateXAmount ? -rotateXAmount * t : 0;
      const rotY = rotateYAmount ? rotateYAmount * t : 0;
      const rotZ = rotationAmount ? rotationAmount * t * i : 0;

      const opacity = 1 - (1 - opacityEnd) * Math.max(0, Math.min(1, (t - 0.2) / 0.8));

      const key = i;
      const roundedY = Math.round(translateY * 100) / 100;
      const roundedScale = Math.round(scale * 1000) / 1000;
      const roundedRotX = Math.round(rotX * 100) / 100;
      const roundedRotY = Math.round(rotY * 100) / 100;
      const roundedRotZ = Math.round(rotZ * 100) / 100;
      const roundedOpacity = Math.round(opacity * 100) / 100;
      const last = lastTransformsRef.current.get(key);

      const rotStr = `rotateX(${roundedRotX}deg) rotateY(${roundedRotY}deg) rotateZ(${roundedRotZ}deg)`;
      if (!last || Math.abs(last.y - roundedY) > 0.1 || Math.abs(last.s - roundedScale) > 0.001 || Math.abs(last.rx - roundedRotX) > 0.1 || Math.abs(last.ry - roundedRotY) > 0.1 || Math.abs(last.rz - roundedRotZ) > 0.1 || Math.abs(last.o - roundedOpacity) > 0.01) {
        card.style.transform = `translate3d(0, ${roundedY}px, 0) scale(${roundedScale}) ${rotStr}`;
        card.style.opacity = roundedOpacity;
        lastTransformsRef.current.set(key, { y: roundedY, s: roundedScale, rx: roundedRotX, ry: roundedRotY, rz: roundedRotZ, o: roundedOpacity });
      }

      if (i === cards.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
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

    measurePositions();
    window.addEventListener('resize', measurePositions);
    window.addEventListener('load', measurePositions);

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
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      positionsRef.current = [];
      endTopRef.current = 0;
      window.removeEventListener('resize', measurePositions);
      window.removeEventListener('load', measurePositions);
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    handleScroll,
    measurePositions
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
