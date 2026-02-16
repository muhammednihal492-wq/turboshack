'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

export default function SmoothScroll() {
    useLayoutEffect(() => {
        // Initialize Lenis for "AntiGravity" heavy smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0); // Prevent GSAP from pausing/jumping on lag

        // Context for easy cleanup of GSAP animations
        const ctx = gsap.context(() => {
            // "AntiGravity" Parallax Effects
            const parallaxElements = document.querySelectorAll('[data-ag~="parallax"]');
            parallaxElements.forEach((el: Element) => {
                const speed = parseFloat((el as HTMLElement).dataset.agSpeed || "0.5");
                gsap.to(el, {
                    y: (_i, _target) => -(ScrollTrigger.maxScroll(window) || 0) * speed * 0.1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0,
                    }
                });
            });
        });

        return () => {
            ctx.revert(); // Kills all GSAP animations/triggers created in this context
            lenis.destroy();
            gsap.ticker.remove(update);
        };
    }, []);

    return null;
}
