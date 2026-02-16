'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionProps {
    id?: string;
    className?: string;
    children: ReactNode;
    bg?: string; // Optional background override
}

export default function Section({ id, className = "", children, bg }: SectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section
            id={id}
            ref={ref}
            className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 z-10 ${className}`}
            style={{ background: bg || 'transparent' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="container mx-auto px-6 relative z-10 pointer-events-none" // Content shouldn't block scroll
            >
                <div className="pointer-events-auto">
                    {children}
                </div>
            </motion.div>
        </section>
    );
}
