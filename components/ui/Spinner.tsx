"use client";
import { useEffect, useState } from "react";

export function Spinner({
  size = "md",
  label = null,
}: {
  size?: "sm" | "md" | "lg";
  label?: null | string;
}) {
  // Size variants
  const sizeClasses = {
    sm: {
      container: "w-10 h-10",
      outerRing: "w-10 h-10 border-2",
      middleRing: "w-7 h-7 border-2",
      innerRing: "w-4 h-4 border-2",
      centerDot: "w-1.5 h-1.5",
      label: "text-xs mt-2",
    },
    md: {
      container: "w-16 h-16",
      outerRing: "w-16 h-16 border-3",
      middleRing: "w-11 h-11 border-3",
      innerRing: "w-6 h-6 border-3",
      centerDot: "w-2 h-2",
      label: "text-sm mt-2",
    },
    lg: {
      container: "w-24 h-24",
      outerRing: "w-24 h-24 border-4",
      middleRing: "w-16 h-16 border-4",
      innerRing: "w-8 h-8 border-4",
      centerDot: "w-3 h-3",
      label: "text-base mt-3",
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  // Particle effect state
  interface Particle {
    id: number;
    angle: number;
    size: number;
    opacity: number;
  }

  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles at intervals
  useEffect(() => {
    const particleInterval = setInterval(() => {
      // Add a new particle
      setParticles((prevParticles) => {
        // Generate random angle
        const angle = Math.random() * Math.PI * 2;
        // Generate random size
        const particleSize = Math.random() * 0.5 + 0.5;

        const newParticle = {
          id: Date.now(),
          angle,
          size: particleSize,
          opacity: 0.8,
        };

        // Keep only newest particles (avoid too many particles)
        return [
          ...prevParticles
            .map((p) => ({
              ...p,
              opacity: p.opacity - 0.1,
            }))
            .filter((p) => p.opacity > 0),
          newParticle,
        ];
      });
    }, 100);

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <div className="flex flex-col pt-5 py-2 items-center justify-center">
      <div
        className={`relative ${classes.container} flex items-center justify-center`}
      >
        {/* Futuristic energy particles */}
        {particles.map((particle) => {
          const distance = 30 + Math.random() * 10;
          const x = Math.cos(particle.angle) * distance;
          const y = Math.sin(particle.angle) * distance;

          return (
            <div
              key={particle.id}
              className="absolute bg-red-600 rounded-full z-0"
              style={{
                width: `${particle.size * 4}px`,
                height: `${particle.size * 4}px`,
                opacity: particle.opacity,
                transform: `translate(${x}px, ${y}px) scale(${particle.opacity})`,
                boxShadow: "0 0 8px 1px rgba(220, 38, 38, 0.6)",
              }}
            />
          );
        })}

        {/* Glowing backdrop */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/10 to-black/5 blur-md animate-pulse"></div>

        {/* Outer Ring */}
        <div
          className={`absolute ${classes.outerRing} border-black border-t-transparent rounded-full animate-spin`}
        ></div>

        {/* Middle Ring */}
        <div
          className={`absolute ${classes.middleRing} border-red-600 border-t-transparent rounded-full animate-spin-slow`}
        ></div>

        {/* Inner Ring */}
        <div
          className={`absolute ${classes.innerRing} border-black border-t-transparent rounded-full animate-spin-reverse`}
        ></div>

        {/* Center dot */}
        <div
          className={`${classes.centerDot} bg-black rounded-full animate-pulse`}
        ></div>

        {/* Tech line accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent transform -translate-y-1/2"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-red-600/30 to-transparent transform -translate-x-1/2"></div>
        </div>
      </div>

      {/* Optional Label */}
      {label && (
        <div className={`${classes.label} text-black font-medium`}>{label}</div>
      )}
    </div>
  );
}
