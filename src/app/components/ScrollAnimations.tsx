import { useRef, ReactNode, useEffect, useState } from "react";

// Note: All motion-based animations have been converted to CSS/Intersection Observer
// to avoid bundling issues with the motion library. CSS transitions provide smooth animations.

/**
 * ScrollFadeInUp
 * Element fades in and slides up as it comes into view
 */
export const ScrollFadeInUp: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsInView(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${
        isInView
          ? "animate-fade-in-up"
          : "opacity-0 translate-y-10"
      } transition-all duration-600`}
      style={{
        transitionDelay: delay ? `${delay}s` : "0s"
      }}
    >
      {children}
    </div>
  );
};

/**
 * ScrollFadeInLeft
 * Element fades in and slides from left
 */
export const ScrollFadeInLeft: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsInView(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${
        isInView
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10"
      } transition-all duration-600`}
      style={{
        transitionDelay: delay ? `${delay}s` : "0s"
      }}
    >
      {children}
    </div>
  );
};

/**
 * ScrollFadeInRight
 * Element fades in and slides from right
 */
export const ScrollFadeInRight: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsInView(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${
        isInView
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-10"
      } transition-all duration-600`}
      style={{
        transitionDelay: delay ? `${delay}s` : "0s"
      }}
    >
      {children}
    </div>
  );
};

/**
 * ScrollScale
 * Element scales up as it comes into view
 */
export const ScrollScale: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsInView(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${
        isInView
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90"
      } transition-all duration-600`}
      style={{
        transitionDelay: delay ? `${delay}s` : "0s"
      }}
    >
      {children}
    </div>
  );
};

/**
 * StaggerContainer
 * Container for staggered animations of children
 */
export const StaggerContainer: React.FC<{
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
    >
      {isInView ? children : null}
    </div>
  );
};

/**
 * StaggerItem
 * Individual item within a StaggerContainer
 */
export const StaggerItem: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`${className} animate-fade-in-up opacity-100 transition-all duration-600`}
    >
      {children}
    </div>
  );
};

/**
 * ParallaxScroll
 * Creates parallax effect on scroll (CSS-based alternative)
 */
export const ParallaxScroll: React.FC<{
  children: ReactNode;
  offset?: number;
  className?: string;
}> = ({ children, offset = 50, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollProgress = window.scrollY;
        setTranslateY(scrollProgress * 0.5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${translateY * 0.3}px)`,
        transition: "transform 0.1s ease-out"
      }}
    >
      {children}
    </div>
  );
};

/**
 * RotateOnScroll
 * Element rotates as you scroll
 */
export const RotateOnScroll: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      setRotation((scroll / 5) % 360);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.1s ease-out"
      }}
    >
      {children}
    </div>
  );
};

/**
 * ScrollOpacity
 * Element opacity changes as you scroll
 */
export const ScrollOpacity: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (300 - rect.top) / 300));
        setOpacity(scrollProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: Math.max(0.3, opacity),
        transition: "opacity 0.1s ease-out"
      }}
    >
      {children}
    </div>
  );
};

/**
 * HoverLift
 * Element lifts up on hover with shadow
 */
export const HoverLift: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-300`}
      style={{
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          : "0 0px 0px 0px rgba(0, 0, 0, 0)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

/**
 * PulseAnimation
 * Subtle pulsing animation
 */
export const PulseAnimation: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`${className} animate-pulse`}
    >
      {children}
    </div>
  );
};

/**
 * CountUp
 * Number counter animation
 */
export const CountUp: React.FC<{
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}> = ({ from, to, duration = 2, suffix = "", className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(from);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let start = from;
    const increment = (to - from) / (duration * 60);
    let frame = 0;
    const totalFrames = duration * 60;

    const interval = setInterval(() => {
      frame++;
      start += increment;
      setCount(Math.floor(start));

      if (frame >= totalFrames) {
        setCount(to);
        clearInterval(interval);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isInView, from, to, duration]);

  return (
    <div ref={ref} className={className}>
      <span>{count}{suffix}</span>
    </div>
  );
};
