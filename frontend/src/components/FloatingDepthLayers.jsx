import { useScroll, useTransform, motion } from 'framer-motion';

export default function FloatingDepthLayers() {
  const { scrollYProgress } = useScroll();
  
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -200]),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.2]),
        }}
      >
        <img
          src="/image.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-black/40"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.7]) }}
      />
      
      <motion.div
        className="absolute w-96 h-96 bg-blue-500 rounded-full"
        style={{
          left: '10%',
          top: '20%',
          opacity: 0.1,
          filter: 'blur(80px)',
          y: useTransform(scrollYProgress, [0, 1], [0, -300]),
        }}
      />
      
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500 rounded-full"
        style={{
          right: '10%',
          bottom: '10%',
          opacity: 0.1,
          filter: 'blur(80px)',
          y: useTransform(scrollYProgress, [0, 1], [0, 100]),
        }}
      />
    </div>
  );
}
