"use client";

import { useEffect, useRef } from "react";

/**
 * 和敬清寂 — Japanese garden parallax.
 * Layered moon · mountains · pagoda · bamboo · zen rocks; each layer translates
 * with scroll progress at a different rate.
 *
 * Per design spec: raw window scroll listener + getBoundingClientRect, NOT
 * IntersectionObserver. requestAnimationFrame throttled.
 */
export default function GardenParallaxSection(): JSX.Element {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<{ el: HTMLDivElement | null; speed: number }[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight;
      // progress: 0 when section is entering bottom, 1 when leaving top
      const total = rect.height + winH;
      const scrolled = winH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      layersRef.current.forEach((layer) => {
        if (!layer.el) return;
        const y = (progress - 0.5) * 200 * layer.speed;
        layer.el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const setLayer = (i: number, speed: number) => (el: HTMLDivElement | null) => {
    layersRef.current[i] = { el, speed };
  };

  return (
    <section ref={sectionRef} className="enso-garden">
      <div className="enso-garden__sky">
        <div className="enso-garden__moon" ref={setLayer(0, 0.2)} />
      </div>
      <div className="enso-garden__mountain enso-garden__mountain--far" ref={setLayer(1, 0.4)} />
      <div className="enso-garden__mountain enso-garden__mountain--mid" ref={setLayer(2, 0.6)} />
      <div className="enso-garden__pagoda" ref={setLayer(3, 0.8)} aria-hidden>
        <svg viewBox="0 0 80 200" width="80" height="200">
          <g fill="none" stroke="#1a1d1b" strokeWidth="1.5">
            <path d="M40 10 L48 24 L32 24 Z" fill="#1a1d1b" />
            <rect x="28" y="24" width="24" height="20" fill="#1a1d1b" />
            <path d="M20 44 L60 44 L52 56 L28 56 Z" fill="#1a1d1b" />
            <rect x="30" y="56" width="20" height="24" fill="#2a2e2b" />
            <path d="M14 80 L66 80 L58 92 L22 92 Z" fill="#1a1d1b" />
            <rect x="30" y="92" width="20" height="28" fill="#2a2e2b" />
            <path d="M8 120 L72 120 L62 132 L18 132 Z" fill="#1a1d1b" />
            <rect x="32" y="132" width="16" height="40" fill="#2a2e2b" />
          </g>
        </svg>
      </div>
      <div className="enso-garden__bamboo" ref={setLayer(4, 1.1)} aria-hidden>
        <svg viewBox="0 0 240 320" width="100%" height="100%" preserveAspectRatio="none">
          <g stroke="#1a1d1b" strokeWidth="2" fill="none">
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={i} x1={20 + i * 32} y1={0} x2={20 + i * 32} y2={320} />
            ))}
          </g>
        </svg>
      </div>
      <div className="enso-garden__rocks" ref={setLayer(5, 1.4)} aria-hidden>
        <svg viewBox="0 0 600 80" width="100%" height="80" preserveAspectRatio="none">
          <g fill="#1a1d1b">
            <ellipse cx="80" cy="60" rx="60" ry="20" />
            <ellipse cx="220" cy="64" rx="80" ry="16" />
            <ellipse cx="420" cy="62" rx="100" ry="22" />
            <ellipse cx="540" cy="64" rx="50" ry="14" />
          </g>
        </svg>
      </div>

      <div className="enso-garden__inner">
        <div className="t-eyebrow">和敬清寂 · Wa Kei Sei Jaku</div>
        <h2 className="enso-garden__title">
          一座枯山水<br />一支線香
        </h2>
        <p className="enso-garden__copy">
          和——以心相待。<br />
          敬——以禮相向。<br />
          清——身心潔淨。<br />
          寂——靜謐當下。
        </p>
      </div>
    </section>
  );
}
