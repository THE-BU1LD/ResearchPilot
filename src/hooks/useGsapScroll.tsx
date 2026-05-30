import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseGsapScrollOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
}

export const useGsapFadeIn = (options: UseGsapScrollOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || "top 85%",
            end: options.end || "bottom 20%",
            toggleActions: options.toggleActions || "play none none reverse",
            ...options,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
};

export const useGsapStagger = (options: UseGsapScrollOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const children = ref.current?.children;
      if (!children) return;

      gsap.fromTo(
        children,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || "top 80%",
            toggleActions: options.toggleActions || "play none none reverse",
            ...options,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
};

export const useGsapScale = (options: UseGsapScrollOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || "top 85%",
            toggleActions: options.toggleActions || "play none none reverse",
            ...options,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
};

export const useGsapSlideIn = (
  direction: "left" | "right" | "up" | "down" = "left",
  options: UseGsapScrollOptions = {}
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const fromVars = {
      left: { x: -100, opacity: 0 },
      right: { x: 100, opacity: 0 },
      up: { y: -100, opacity: 0 },
      down: { y: 100, opacity: 0 },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, fromVars[direction], {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: options.start || "top 85%",
          toggleActions: options.toggleActions || "play none none reverse",
          ...options,
        },
      });
    });

    return () => ctx.revert();
  }, [direction]);

  return ref;
};

export const useGsapParallax = (speed: number = 0.5, options: UseGsapScrollOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => 100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: options.scrub !== undefined ? options.scrub : true,
          ...options,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
};

// Hook to animate numbers counting up
export const useGsapCounter = (endValue: number, options: UseGsapScrollOptions = {}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const obj = { val: 0 };

      gsap.to(obj, {
        val: endValue,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: options.start || "top 85%",
          toggleActions: "play none none none",
          ...options,
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = Math.round(obj.val).toLocaleString();
          }
        },
      });
    });

    return () => ctx.revert();
  }, [endValue]);

  return ref;
};
