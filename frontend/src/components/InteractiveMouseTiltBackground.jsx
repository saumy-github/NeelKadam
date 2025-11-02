import { useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function InteractiveBackground() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const rotate = useTransform(scrollY, [0, 500], [0, 5]);
  
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-screen -z-10"
      style={{
        y,
        scale,
        rotateZ: rotate,
      }}
    >
      <img
        src="/image.png"
        alt="Background"
        className="w-full h-full object-cover"
      />
      {/* Overlay gradient that animates */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"
        style={{ opacity: useTransform(scrollY, [0, 300], [0.3, 0.7]) }}
      />
    </motion.div>
  );
}
