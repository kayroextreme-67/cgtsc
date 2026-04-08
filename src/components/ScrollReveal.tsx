import React from 'react';
import { motion } from 'motion/react';

export default function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  yOffset = 20
}: { 
  children: React.ReactNode, 
  className?: string, 
  delay?: number,
  yOffset?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
