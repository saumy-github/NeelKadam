import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function PremiumBackground() {
  const bgRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const x = (e.clientY - centerY) / 15;
      const y = (centerX - e.clientX) / 15;
      
      setTilt({ x, y });
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (bgRef.current) {
        const rect = bgRef.current.getBoundingClientRect();
        setIsMouseInside(
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div
      ref={bgRef}
      className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Base Background with Tilt */}
      <motion.div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.08)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
          width: '100%',
          height: '100%',
          y: useTransform(scrollYProgress, [0, 1], [0, -100]),
        }}
      >
        <img
          src="/image.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Overlay Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/15 to-black/50"
        style={{
          opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.7]),
        }}
      />
      
      {/* Mouse Spotlight */}
      {isMouseInside && (
        <div
          style={{
            position: 'absolute',
            left: mousePos.x,
            top: mousePos.y,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0.1) 30%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 100px rgba(14, 165, 233, 0.5)',
            transition: 'all 0.08s ease-out',
            zIndex: 5,
          }}
        />
      )}
      
      {/* Floating Depth Glows */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-500 rounded-full"
        style={{
          left: '15%',
          top: '25%',
          opacity: 0.08,
          filter: 'blur(100px)',
          y: useTransform(scrollYProgress, [0, 1], [0, -250]),
        }}
      />
      
      <motion.div
        className="absolute w-80 h-80 bg-cyan-500 rounded-full"
        style={{
          right: '15%',
          bottom: '15%',
          opacity: 0.06,
          filter: 'blur(90px)',
          y: useTransform(scrollYProgress, [0, 1], [0, 150]),
        }}
      />
    </div>
  );
}
