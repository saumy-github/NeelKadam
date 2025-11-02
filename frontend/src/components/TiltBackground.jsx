import { useEffect, useRef, useState } from 'react';

export default function TiltBackground() {
  const bgRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = window.innerHeight;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const x = (e.clientY - centerY) / 10; // Vertical tilt
      const y = (centerX - e.clientX) / 10; // Horizontal tilt
      
      setTilt({ x, y });
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div
      ref={bgRef}
      className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden"
      style={{
        perspective: '1000px',
      }}
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src="/image.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay glow that follows mouse */}
      <div
        style={{
          position: 'absolute',
          left: mousePos.x,
          top: mousePos.y,
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      />
    </div>
  );
}
