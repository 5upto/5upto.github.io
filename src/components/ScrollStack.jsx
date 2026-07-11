import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

let sharedLenis = null;
let lenisCount = 0;
let sharedRafId = null;

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
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
  onStackComplete = undefined
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());

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

  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPx = parsePercentage(stackPosition, containerHeight);
    const endPx = parsePercentage(scaleEndPosition, containerHeight);
    const endEl = scrollerRef.current?.querySelector('.scroll-stack-end');
    const endTop = endEl
      ? (useWindowScroll ? endEl.getBoundingClientRect().top + window.scrollY : endEl.offsetTop)
      : 0;

    cards.forEach((card, i) => {
      let cardTop;
      if (useWindowScroll) {
        const rect = card.getBoundingClientRect();
        const visualTop = rect.top + window.scrollY;
        const prevY = lastTransformsRef.current.get(i)?.y || 0;
        cardTop = visualTop - prevY;
      } else {
        cardTop = card.offsetTop;
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

      const key = i;
      const roundedY = Math.round(translateY * 100) / 100;
      const roundedScale = Math.round(scale * 1000) / 1000;
      const last = lastTransformsRef.current.get(key);

      if (!last || Math.abs(last.y - roundedY) > 0.1 || Math.abs(last.s - roundedScale) > 0.001) {
        card.style.transform = `translate3d(0, ${roundedY}px, 0) scale(${roundedScale})`;
        lastTransformsRef.current.set(key, { y: roundedY, s: roundedScale });
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
    getScrollData
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

    // Initialize card styles only (no position caching — read live each frame)
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
          syncTouchLerp: 0.075
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
        syncTouchLerp: 0.075
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
    handleScroll
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
