import { useEffect, useRef, useState } from 'react';

export default function SpotlightBackground() {
  const bgRef = useRef(null);
  const spotlightRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
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
    >
      {/* Main background image */}
      <img
        src="/image.png"
        alt="Background"
        className="w-full h-full object-cover"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Mouse-following spotlight */}
      {isMouseInside && (
        <div
          ref={spotlightRef}
          style={{
            position: 'absolute',
            left: mousePos.x,
            top: mousePos.y,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 80px rgba(14, 165, 233, 0.4)',
            transition: 'all 0.05s ease-out',
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
}
