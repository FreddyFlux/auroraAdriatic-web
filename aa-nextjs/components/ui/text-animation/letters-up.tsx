"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, type Variants } from "framer-motion";
import { memo, useRef } from "react";

export interface LettersPullUpProps {
  /** The text to animate */
  text: string;
  /** Additional CSS classes */
  className?: string;
  /** Delay between each letter animation in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to animate only once */
  once?: boolean;
}

export const LettersPullUp = memo<LettersPullUpProps>(
  ({ text, className = "", delay = 0.05, duration = 0.4, once = true }) => {
    const splittedText = text.split("");
    const ref = useRef(null);
    const isInView = useInView(ref, {
      once,
      margin: "-50px 0px -50px 0px", // Trigger animation when element is 50px from viewport
    });

    // Create variant with custom delay
    const pullupVariant: Variants = {
      initial: {
        y: 10,
        opacity: 0,
      },
      animate: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: {
          duration,
          delay: i * delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }),
    };

    return (
      <div ref={ref} className="flex justify-center">
        {splittedText.map((current, i) => (
          <motion.div
            key={`${i}-${current}`}
            variants={pullupVariant}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            custom={i}
            className={cn(
              "text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]",
              className
            )}
          >
            {current === " " ? <span>&nbsp;</span> : current}
          </motion.div>
        ))}
      </div>
    );
  }
);

LettersPullUp.displayName = "LettersPullUp";

export default LettersPullUp;
