"use client";

import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let isCancelled = false;
    let lenisInstance: any = null;
    let rafId: number;
    let resizeObserverInstance: any = null;
    let handleResizeFn: any = null;

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return; // Do not load Lenis on mobile/tablet to save CPU and battery
    }

    import("lenis").then(({ default: Lenis }) => {
      if (isCancelled) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        autoResize: true,
      });
      lenisInstance = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      handleResizeFn = () => {
        lenis.resize();
      };

      window.addEventListener("resize", handleResizeFn);
      window.addEventListener("load", handleResizeFn);

      resizeObserverInstance = new ResizeObserver(() => {
        lenis.resize();
      });

      if (document.body) {
        resizeObserverInstance.observe(document.body);
      }

      if (typeof window !== "undefined") {
        (window as any).__lenis = lenis;
      }
    });

    return () => {
      isCancelled = true;
      if (typeof window !== "undefined") {
        (window as any).__lenis = null;
      }
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserverInstance) resizeObserverInstance.disconnect();
      if (handleResizeFn) {
        window.removeEventListener("resize", handleResizeFn);
        window.removeEventListener("load", handleResizeFn);
      }
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return <>{children}</>;
}
