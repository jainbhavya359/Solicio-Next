"use client";

import { motion, useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedCounter({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(count, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    const controls = animate(count, end, {
      duration: 1.6,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, end]);

  return (
    <motion.span>
      {display.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

