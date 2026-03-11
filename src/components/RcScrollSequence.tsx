'use client';

import { useScroll, useSpring, useTransform, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const FRAME_COUNT = 240; // Using all available frames for maximum smoothness
const IMAGES_DIR = '/sequence/';
const IMAGE_NAME_PREFIX = 'ezgif-frame-';
const IMAGE_EXT = '.jpg';

export default function RcScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Scroll progress for the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Smooth the scroll progress for animation
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        const loadImages = async () => {
            // Create promises for all images
            const promises = Array.from({ length: FRAME_COUNT }).map((_, i) => {
                const index = i + 1; // 1-based index based on file list (001 to 240)
                const paddedIndex = index.toString().padStart(3, '0');
                const src = `${IMAGES_DIR}${IMAGE_NAME_PREFIX}${paddedIndex}${IMAGE_EXT}`;

                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load image: ${src}`);
                        resolve();
                    };
                    imgArray[i] = img; // Store in order (0-based array index)
                });
            });

            await Promise.all(promises);
            setImages(imgArray);
            setLoaded(true);
        };

        loadImages();
    }, []);

    // Draw to canvas
    useEffect(() => {
        if (!loaded || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawImage = (index: number) => {
            const img = images[index];
            if (!img) return;

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // Clear
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            const imgRatio = img.width / img.height;
            const canvasRatio = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                // Image is wider than canvas
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            } else {
                // Image is taller than canvas
                drawHeight = canvasHeight;
                drawWidth = canvasHeight * imgRatio;
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;

            // Redraw immediately
            const currentProgress = smoothProgress.get();
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(currentProgress * (FRAME_COUNT - 1)))
            );
            drawImage(frameIndex);
        };

        // Initial sizing
        handleResize();
        window.addEventListener('resize', handleResize);

        // Animation loop using change in smoothProgress
        const unsubscribe = smoothProgress.on('change', (latest) => {
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(latest * (FRAME_COUNT - 1)))
            );
            requestAnimationFrame(() => drawImage(frameIndex));
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribe();
        };
    }, [loaded, images, smoothProgress]);

    // --- Text & Effect Animations ---

    // LED Light Bar Effects
    const ledOpacity = useTransform(scrollYProgress, [0.9, 0.92, 1], [0, 1, 0.8]);
    const ledScale = useTransform(scrollYProgress, [0.9, 1], [0.8, 1.2]);
    const flashOpacity = useTransform(scrollYProgress, [0.92, 0.93], [0, 1]);

    // Scroll Hint
    const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    // Beat A: 0-20%
    const opacityA = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
    const yA = useTransform(scrollYProgress, [0, 0.2], [20, -20]);

    // Beat B: 25-45%
    const opacityB = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
    const yB = useTransform(scrollYProgress, [0.25, 0.45], [20, -20]);

    // Beat C: 50-70%
    const opacityC = useTransform(scrollYProgress, [0.5, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
    const yC = useTransform(scrollYProgress, [0.5, 0.7], [20, -20]);

    // Beat D: 75-95%
    const opacityD = useTransform(scrollYProgress, [0.75, 0.8, 0.95, 1], [0, 1, 1, 1]); // Keeping it visible at end
    const yD = useTransform(scrollYProgress, [0.75, 0.95], [20, 0]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
            {/* Loading Screen */}
            {!loaded && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white">
                    <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-red-600 transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="font-mono text-sm text-white/60 tracking-widest">INITIALIZING SYSTEMS {loadingProgress}%</p>
                </div>
            )}

            {/* Sticky Canvas Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full block"
                    style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
                />

                {/* Vignette Overlay for seamless blending */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_60%,#050505_100%)] z-0" />

                {/* LED Light Bar Effect (Simulated) */}
                <motion.div
                    className="absolute top-[55%] left-1/2 -translate-x-1/2 w-64 h-4 bg-cyan-100 blur-[30px] rounded-full pointer-events-none z-10 mix-blend-hard-light"
                    style={{
                        opacity: ledOpacity,
                        scale: ledScale
                    }}
                />

                {/* Helper overlay for critical flash */}
                <motion.div
                    className="absolute top-[55%] left-1/2 -translate-x-1/2 w-32 h-1 bg-white blur-[5px] z-10"
                    style={{ opacity: flashOpacity }}
                />

                {/* Scroll Hint */}
                {loaded && (
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.2em] uppercase font-bold text-center w-full"
                        style={{ opacity: scrollHintOpacity }}
                        initial={{ y: 0 }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        Scroll to Explore
                    </motion.div>
                )}

                {/* Beat A Overlays */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-4xl px-4 pointer-events-none z-10 mix-blend-difference"
                    style={{ opacity: opacityA, y: yA }}
                >
                    <h1 className="text-5xl md:text-8xl font-black text-white/90 tracking-tighter mb-4">
                        CONTROL THE TERRAIN
                    </h1>
                    <p className="text-lg md:text-2xl text-white/60 tracking-wide font-light uppercase">
                        Precision-engineered performance.
                    </p>
                </motion.div>

                {/* Beat B Overlays */}
                <motion.div
                    className="absolute top-1/2 left-[10%] -translate-y-1/2 text-left pointer-events-none z-10"
                    style={{ opacity: opacityB, y: yB }}
                >
                    <h2 className="text-4xl md:text-7xl font-bold text-white/90 tracking-tight mb-2">
                        BUILT FOR SPEED
                    </h2>
                    <div className="border-l-2 border-red-600 pl-6 py-2">
                        <p className="text-lg md:text-xl text-white/60 font-mono">
                            BRUSHLESS POWER
                        </p>
                        <p className="text-lg md:text-xl text-white/60 font-mono">
                            4WD TRACTION
                        </p>
                    </div>
                </motion.div>

                {/* Beat C Overlays */}
                <motion.div
                    className="absolute top-1/2 right-[10%] -translate-y-1/2 text-right pointer-events-none z-10"
                    style={{ opacity: opacityC, y: yC }}
                >
                    <h2 className="text-4xl md:text-7xl font-bold text-white/90 tracking-tight mb-2">
                        REAL RC. <br /><span className="text-red-600">REAL POWER.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 font-light tracking-wide">
                        True 1:14 scale dominance.
                    </p>
                </motion.div>

                {/* Beat D Overlays */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto z-20"
                    style={{ opacity: opacityD, y: yD }}
                >
                    <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter mb-8 drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]">
                        OWN THE DRIVE
                    </h2>
                    <p className="text-xl text-white/60 mb-8 max-w-lg mx-auto font-light">
                        Experience the next generation.
                    </p>
                    {/* CTA Button */}
                    <button className="relative group overflow-hidden bg-transparent border border-white/20 text-white px-8 py-3 transition-all hover:bg-red-600 hover:border-red-600">
                        <span className="relative z-10 font-bold tracking-[0.2em] text-sm uppercase">Pre-Order Now</span>
                    </button>
                </motion.div>
            </div>

        </div>
    );
}
