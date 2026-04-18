"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  once?: boolean;
};

export default function RevealOnScroll({ children, className = "", once = true }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.12,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [once]);

  return (
    <div ref={ref} className={`fade-in-section ${isVisible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
