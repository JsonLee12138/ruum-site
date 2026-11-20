import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

interface LottiePulseProps {
  animationData: object;
  size?: number;
  loop?: boolean;
  playing?: boolean;
  className?: string;
  label?: string;
}

export default function LottiePulse({
  animationData,
  size = 24,
  loop = true,
  playing = true,
  className = "",
  label,
}: LottiePulseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("lottie-web/build/player/esm/lottie_light.min.js")
      .then((mod) => {
        if (cancelled || !containerRef.current) return;
        const lottie = mod.default;
        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay: !prefersReduced && playing,
          animationData,
        });
        animRef.current = anim;

        if (prefersReduced || !playing) {
          anim.goToAndStop(18, true);
          return;
        }

        if ("IntersectionObserver" in window) {
          observer = new IntersectionObserver(
            (entries) => {
              const visible = entries.some((entry) => entry.isIntersecting);
              if (!animRef.current) return;
              if (visible && playing) {
                animRef.current.play();
              } else {
                animRef.current.pause();
              }
            },
            { threshold: 0.05 },
          );
          observer.observe(el);
        }
      })
      .catch(() => {
        // Non-critical decorative micro-animation
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [animationData, loop, playing]);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className={`shrink-0 inline-flex items-center justify-center ${className}`}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
