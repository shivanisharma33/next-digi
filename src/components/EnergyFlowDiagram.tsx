import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import lottie, { type AnimationItem } from 'lottie-web';

const EnergyFlowDiagram = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let anim: AnimationItem | null = null;
    let cancelled = false;

    fetch('/_debug_no_circles.json')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !containerRef.current) return;
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        });
      })
      .catch(() => {
        /* leave container empty; placeholder remains */
      });

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
      className="w-full"
    >
      <div ref={containerRef} className="w-full" />
    </motion.div>
  );
};

export default EnergyFlowDiagram;
