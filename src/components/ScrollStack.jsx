import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

let sharedLenis = null;
let lenisCount = 0;
let sharedRafId = null;

// Document-space offset of an element. Unlike getBoundingClientRect() this is
// not affected by `position: sticky` or by the card's own transform, so the
// natural (un-pinned) position stays stable while the card is pinned.
const getOffsetTop = el => {
  let top = 0;
  let node = el;
  while (node) {
    top += node.offsetTop || 0;
    node = node.offsetParent;
  }
  return top;
};

export const ScrollStackItem = ({ children, itemClassName = '', ...props }) => (
  <div role="button" tabIndex={0} className={`scroll-stack-card ${itemClassName}`.trim()} {...props}>{children}</div>
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
  const lastActiveIndexRef = useRef(-1);
  // Viewport height is cached so mobile browser chrome (address bar) collapsing
  // mid-scroll cannot move the pin line/target scale under the user's finger.
  const viewportHeightRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const isScrollingRef = useRef(false);
  const pendingRecomputeRef = useRef(false);
  const scrollIdleTimerRef = useRef(0);

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
        containerHeight: viewportHeightRef.current || window.innerHeight,
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
      // Keep the cached viewport height stable across small mobile browser
      // chrome changes (address bar), but still follow real resizes/orientation.
      const width = window.innerWidth;
      const height = window.innerHeight;
      const widthChanged = width !== viewportWidthRef.current;
      const bigHeightChange = Math.abs(height - viewportHeightRef.current) > 150;
      if (!viewportHeightRef.current || widthChanged || bigHeightChange) {
        viewportHeightRef.current = height;
        viewportWidthRef.current = width;
      }
      const containerHeight = viewportHeightRef.current;
      const stackPx = parsePercentage(stackPosition, containerHeight);
      cards.forEach((card, i) => {
        positionsRef.current[i] = getOffsetTop(card);
        // Pin with sticky instead of a per-scroll translateY. The browser's
        // compositor keeps a sticky card locked to the viewport at native
        // scroll speed, so it cannot lag behind the page and shake.
        card.style.position = 'sticky';
        card.style.top = `${stackPx + itemStackDistance * i}px`;
      });
      endTopRef.current = endEl ? getOffsetTop(endEl) : 0;
    } else {
      cards.forEach((card, i) => {
        positionsRef.current[i] = card.offsetTop;
      });
      endTopRef.current = endEl ? endEl.offsetTop : 0;
    }
  }, [useWindowScroll, parsePercentage, stackPosition, itemStackDistance]);

  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPx = parsePercentage(stackPosition, containerHeight);
    const endPx = parsePercentage(scaleEndPosition, containerHeight);
    const pinEnd = endTopRef.current - containerHeight / 2;

    let newActive = -1;
    cards.forEach((card, i) => {
      let cardTop = positionsRef.current[i];
      if (cardTop == null) {
        cardTop = useWindowScroll
          ? getOffsetTop(card)
          : card.offsetTop;
        positionsRef.current[i] = cardTop;
      }

      const triggerStart = cardTop - stackPx - itemStackDistance * i;
      const triggerEnd = cardTop - endPx;
      if (scrollTop >= triggerStart) newActive = i;

      let translateY = 0;
      let scale = 1;
      let rotX = 0;
      let rotY = 0;
      let rotZ = 0;
      let opacity = 1;

      if (scrollTop >= triggerStart) {
        const t = calculateProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale = baseScale + i * itemScale;
        scale = 1 - t * (1 - targetScale);

        // Window scrolling is pinned by `position: sticky` (see
        // measurePositions), so no per-scroll translation is needed there.
        if (!useWindowScroll) {
          if (scrollTop <= pinEnd) {
            translateY = scrollTop - cardTop + stackPx + itemStackDistance * i;
          } else {
            translateY = pinEnd - cardTop + stackPx + itemStackDistance * i;
          }
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
    if (newActive !== -1 && newActive !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = newActive;
      const playFn = window.__portfolioPlaySound;
      if (typeof playFn === 'function') playFn(480 + newActive * 90, 0.05);
    }
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

  const recompute = useCallback(() => {
    measurePositions();
    updateCardTransforms();
  }, [measurePositions, updateCardTransforms]);

  const markScrolled = useCallback(() => {
    isScrollingRef.current = true;
    if (scrollIdleTimerRef.current) window.clearTimeout(scrollIdleTimerRef.current);
    scrollIdleTimerRef.current = window.setTimeout(() => {
      scrollIdleTimerRef.current = 0;
      isScrollingRef.current = false;
      // Layout changes while a finger is down (fonts, images, and the mobile
      // address bar resizing) are measured once the scroll comes to rest.
      // Re-measuring mid-gesture is what made the stack visibly jump.
      if (pendingRecomputeRef.current) {
        pendingRecomputeRef.current = false;
        recompute();
      }
    }, 140);
  }, [recompute]);

  const handleScroll = useCallback(() => {
    markScrolled();
    updateCardTransforms();
  }, [markScrolled, updateCardTransforms]);

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

    // Coalesce layout-triggered re-measures into one per frame. If a layout
    // change lands while the reader is actively scrolling, postpone it until
    // the gesture settles so the cards never snap under their finger.
    let scheduleRaf = 0;
    const scheduleRecompute = () => {
      if (scheduleRaf) return;
      scheduleRaf = requestAnimationFrame(() => {
        scheduleRaf = 0;
        if (isScrollingRef.current) {
          pendingRecomputeRef.current = true;
          return;
        }
        pendingRecomputeRef.current = false;
        recompute();
      });
    };

    recompute();
    window.addEventListener('resize', scheduleRecompute);
    window.addEventListener('load', scheduleRecompute);
    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleRecompute).catch(() => {});
    }
    const resizeObserver = new ResizeObserver(scheduleRecompute);
    cards.forEach(card => resizeObserver.observe(card));
    // Async content (fonts/images/other sections) can change the card offsets
    // after the initial measurement. Keep them fresh, but only while at rest.
    const layoutObserver = new ResizeObserver(scheduleRecompute);
    layoutObserver.observe(document.body);
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', scheduleRecompute);

    if (useWindowScroll) {
      // Touch devices scroll natively, which is smoother than any JS smoothing.
      // Lenis is only needed for desktop wheel input.
      const nativeTouchScroll =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches;

      if (!nativeTouchScroll) {
        lenisCount++;
        if (!sharedLenis) {
          sharedLenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            infinite: false,
            wheelMultiplier: 1,
            // Keep touch scrolling native: Lenis syncTouch can fight momentum
            // when the scroll direction reverses on mobile.
            lerp: 0.1
          });

          const raf = time => {
            sharedLenis?.raf(time);
            sharedRafId = requestAnimationFrame(raf);
          };
          sharedRafId = requestAnimationFrame(raf);
        }
        lenisRef.current = sharedLenis;
        sharedLenis.on('scroll', handleScroll);
      }
      // Also react to native scroll events (scroll restoration, resize, etc.)
      // so transforms never get stuck at a stale position.
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        infinite: false,
        normalizeWheel: true,
        wheelMultiplier: 1,
        // Keep touch scrolling native: Lenis syncTouch can fight momentum
        // when the scroll direction reverses on mobile.
        lerp: 0.1
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      lenisRef.current = lenis;
    }

    // Catch late layout/scroll-restoration shifts that happen after mount.
    requestAnimationFrame(() => {
      recompute();
      requestAnimationFrame(() => recompute());
    });

    return () => {
      if (useWindowScroll) {
        window.removeEventListener('scroll', handleScroll);
        if (lenisRef.current) {
          sharedLenis?.off('scroll', handleScroll);
          lenisCount--;
          if (lenisCount <= 0 && sharedLenis) {
            cancelAnimationFrame(sharedRafId);
            sharedLenis.destroy();
            sharedLenis = null;
            sharedRafId = null;
          }
          lenisRef.current = null;
        }
      } else if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (scrollIdleTimerRef.current) {
        window.clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = 0;
      }
      isScrollingRef.current = false;
      pendingRecomputeRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      positionsRef.current = [];
      endTopRef.current = 0;
      viewportHeightRef.current = 0;
      viewportWidthRef.current = 0;
      resizeObserver.disconnect();
      layoutObserver.disconnect();
      viewport?.removeEventListener('resize', scheduleRecompute);
      if (scheduleRaf) cancelAnimationFrame(scheduleRaf);
      window.removeEventListener('resize', scheduleRecompute);
      window.removeEventListener('load', scheduleRecompute);
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
        className={`${useWindowScroll ? 'scroll-stack-root' : 'scroll-stack-scroller'} ${className}`.trim()}
      >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
