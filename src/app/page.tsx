'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Section from '@/components/Section';
import CarVisual from '@/components/CarVisual';
import Footer from '@/components/Footer';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Car options for the showcase
const SHOWCASE_CARS = [
    { id: '1', name: 'OFF-ROAD BEAST', type: 'Titan 4x4', img: '/csr1.png', speed: 'MAX', diff: 'HARD' },
    { id: '2', name: 'DRIFT KING', type: 'Apex R-Spec', img: '/csr2.png', speed: 'HIGH', diff: 'EASY' },
    { id: '3', name: 'DUNE BUGGY', type: 'Sandstorm V2', img: '/csr3.png', speed: 'HIGH', diff: 'MED' },
    { id: '4', name: 'ARENA WARRIOR', type: 'Mecha-Drift', img: '/csr4.png', speed: 'MED', diff: 'MED' },
];

function RotatingShowcaseCar({ carId }: { carId: string }) {
    const car = SHOWCASE_CARS.find(c => c.id === carId) || SHOWCASE_CARS[0];
    const rotation = useMotionValue(0);
    const speed = useMotionValue(0);
    const isDragging = useRef(false);
    const lastX = useRef(0);
    const [assembled, setAssembled] = useState(false);

    useEffect(() => {
        setAssembled(false); // reset on car change
        rotation.set(0); // reset rotation
        speed.set(0);

        // Wait for 1.4s assembly + 1.5s front-facing hero hold before rotating
        const t1 = setTimeout(() => {
            setAssembled(true);
        }, 1400);

        const t2 = setTimeout(() => {
            speed.set(0.55); // ~11s per full rotation at 60fps
        }, 2900); // 1.4 + 1.5

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [carId]);

    useAnimationFrame((t, delta) => {
        if (!isDragging.current) {
            rotation.set(rotation.get() + speed.get() * (delta / 16.66));
        }
    });

    return (
        <motion.div
            className="w-full h-full relative cursor-grab active:cursor-grabbing pb-8"
            style={{
                rotate: rotation
            }}
            onPointerDown={(e) => {
                if (!assembled) return;
                isDragging.current = true;
                lastX.current = e.clientX;
            }}
            onPointerMove={(e) => {
                if (isDragging.current) {
                    const deltaX = e.clientX - lastX.current;
                    rotation.set(rotation.get() + deltaX * 0.5); // scrub sensitivity
                    lastX.current = e.clientX;
                }
            }}
            onPointerUp={() => {
                isDragging.current = false;
            }}
            onPointerLeave={() => {
                isDragging.current = false;
            }}
        >
            {/* The assembled full car */}
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: assembled ? 1 : 0 }}
                transition={{ duration: 0.1 }}
                style={{
                    filter: "drop-shadow(0px 40px 40px rgba(0,0,0,1)) drop-shadow(0px -10px 20px rgba(122,0,0,0.5)) drop-shadow(0px 15px 15px rgba(255,255,255,0.05))"
                }}
            >
                <div className="relative w-full h-[80%] hover:scale-110 transition-transform duration-500 ease-out">
                    <Image
                        src={car.img}
                        alt="Showcase Car"
                        fill
                        className="object-contain pointer-events-none drop-shadow-2xl"
                        draggable={false}
                        priority
                    />
                </div>
            </motion.div>

            {/* Realistic Mechanical Parts Assembly */}
            <AnimatePresence>
                {!assembled && (
                    <motion.div
                        key="mechanical-parts"
                        className="absolute inset-0 z-10 pointer-events-none p-8"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            filter: "drop-shadow(0px 40px 40px rgba(0,0,0,0.95)) drop-shadow(0px -10px 20px rgba(122,0,0,0.7)) drop-shadow(0px 15px 15px rgba(255,255,255,0.12))"
                        }}
                    >
                        {/* Overall Settle & Weight Wrapper (triggers at the end of the 1.4s sequence) */}
                        <motion.div
                            className="absolute inset-0"
                            initial={{ y: 0, scaleY: 1 }}
                            animate={{ y: [0, 0, 4, 0], scaleY: [1, 1, 0.98, 1] }}
                            transition={{ duration: 1.4, times: [0, 0.81, 0.85, 1], ease: "easeInOut" }}
                        >
                            {/* 1. Base / Chassis Reveal (Center Ground) */}
                            <motion.div
                                className="absolute inset-0"
                                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: [5, 0, 0] }}
                                transition={{ duration: 0.3, ease: "easeOut", times: [0, 1, 1] }}
                                style={{ clipPath: 'polygon(30% 20%, 70% 20%, 70% 80%, 30% 80%)' }}
                            >
                                <div className="relative w-full h-[80%] my-auto mx-auto top-[10%]">
                                    <Image src={car.img} alt="Chassis" fill className="object-contain" priority />
                                </div>
                            </motion.div>

                            {/* 2. Left Wheels (Front & Rear sequential roll-in) */}
                            <motion.div
                                className="absolute inset-0"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: [-100, 2, 0], opacity: [0, 1, 1] }}
                                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2, times: [0, 0.9, 1] }}
                                style={{ clipPath: 'polygon(0% 20%, 30% 20%, 30% 100%, 0% 100%)' }}
                            >
                                <div className="relative w-full h-[80%] my-auto mx-auto top-[10%]">
                                    <Image src={car.img} alt="Left Wheels" fill className="object-contain" priority />
                                </div>
                            </motion.div>

                            {/* 2. Right Wheels */}
                            <motion.div
                                className="absolute inset-0"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: [100, -2, 0], opacity: [0, 1, 1] }}
                                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.3, times: [0, 0.9, 1] }}
                                style={{ clipPath: 'polygon(70% 20%, 100% 20%, 100% 100%, 70% 100%)' }}
                            >
                                <div className="relative w-full h-[80%] my-auto mx-auto top-[10%]">
                                    <Image src={car.img} alt="Right Wheels" fill className="object-contain" priority />
                                </div>
                            </motion.div>

                            {/* 3. Suspension Lowering */}
                            <motion.div
                                className="absolute inset-0"
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: [-50, 2, 0], opacity: [0, 1, 1] }}
                                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.6, times: [0, 0.9, 1] }}
                                style={{ clipPath: 'polygon(30% 80%, 70% 80%, 70% 100%, 30% 100%)' }}
                            >
                                <div className="relative w-full h-[80%] my-auto mx-auto top-[10%]">
                                    <Image src={car.img} alt="Suspension" fill className="object-contain" priority />
                                </div>
                            </motion.div>

                            {/* 3. Body Shell Descends */}
                            <motion.div
                                className="absolute inset-0"
                                initial={{ y: -150, opacity: 0 }}
                                animate={{ y: [-150, 3, 0], opacity: [0, 1, 1] }}
                                transition={{ duration: 0.4, ease: "easeInOut", delay: 0.8, times: [0, 0.9, 1] }}
                                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 20%, 0% 20%)' }}
                            >
                                <div className="relative w-full h-[80%] my-auto mx-auto top-[10%]">
                                    <Image src={car.img} alt="Body Shell" fill className="object-contain" priority />
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);

    // Showcase State
    const [selectedCar, setSelectedCar] = useState<string>(SHOWCASE_CARS[0].id);

    useGSAP(() => {
        const video = videoRef.current;
        const logo = logoRef.current;
        const nav = navRef.current;
        const hero = heroRef.current;

        if (!video || !logo || !nav || !hero) return;

        // --- 1. INITIAL STATE ---
        const introCar = document.getElementById('intro-car');

        // Lock Scroll
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        // Hide Elements Initially
        gsap.set(video, { opacity: 0 }); // Video hidden
        gsap.set(nav, { y: -20, opacity: 0 }); // Nav hidden
        gsap.set(introCar, { opacity: 0 }); // Car hidden

        // Logo: Centered, Scaled 0.8, Invisible
        gsap.set(logo, {
            top: '50vh',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            scale: 0.8,
            opacity: 0,
            position: 'fixed'
        });

        // --- MASTER TIMELINE ---
        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                // Unlock Scroll after intro
                document.body.style.overflow = '';
            }
        });

        // Step 1: Logo Fade In & Scale Up (Cinematic Entry)
        tl.to(logo, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out"
        });

        // Step 2: Hold for 2 Seconds
        tl.to({}, { duration: 2.0 });

        // Step 3: Logo Move & Track Draw (Simultaneous)
        const moveTime = 3.0;

        tl.addLabel("moveStart");

        // 3a. Move Logo to Top-Left
        tl.to(logo, {
            top: '1.5rem',
            left: '2rem',
            xPercent: 0,
            yPercent: 0,
            scale: 0.35, // Scale down small for header
            duration: moveTime,
            ease: "expo.inOut", // Smooth cinematic easing
            transformOrigin: "top left"
        }, "moveStart");

        // 3d. Reveal Video & Nav (Subtle, background)
        tl.to(video, {
            opacity: 1,
            duration: 2.0,
            onStart: () => {
                if (videoRef.current) {
                    videoRef.current.play().catch((e) => console.log("Video auto-play prevented:", e));
                }
            }
        }, "moveStart+=0.5");

        tl.to(nav, {
            y: 0,
            opacity: 1,
            duration: 1.0
        }, "moveStart+=1.5");

        // Quotes fade in sequentially
        tl.to('.quote-item', {
            x: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out"
        }, "moveStart+=1.2");

        // --- VIDEO AND TEXT SCROLL SCROLL ANIMATION (PARALLAX CACHED) ---

        const setupVideoScroll = () => {
            // Reduce motion intensity on mobile
            const isMobile = window.innerWidth <= 768;
            const startScale = isMobile ? 1.05 : 1.15;
            const parallaxX = isMobile ? 2 : 5;

            // Parallax the video
            gsap.fromTo(video,
                { scale: startScale, yPercent: 0 },
                {
                    scale: 1.0,
                    yPercent: isMobile ? 5 : 10, // Moves slightly down while scrolling
                    ease: "none",
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "bottom top", // Smooth visual depth
                        scrub: 1.5, // Smooth easing
                        markers: false
                    }
                }
            );

            // Parallax the text (moves faster than the video to create depth)
            gsap.to('.hero-text-container', {
                yPercent: -20, // Moves up while scrolling
                ease: "none",
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });
        };

        setupVideoScroll();

        // --- ABOUT SECTION IMAGE ANIMATION ---
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#about",
                start: "top 75%",
                toggleActions: "play reverse play reverse"
            }
        });

        // Staggered text fade in
        aboutTl.to('.about-text-element', {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.3,
            ease: "power3.out"
        });

        // Image zoom and reveal
        aboutTl.to('.about-image', {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.8");

        // --- ARENA SECTION ANIMATION ---
        gsap.to('.arena-card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#arena",
                start: "top 70%", // Trigger when top of section hits 70% of viewport height
                toggleActions: "play reverse play reverse"
            }
        });

        // --- EVENTS SECTION ANIMATION ---
        gsap.to('.event-card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#events",
                start: "top 75%",
                toggleActions: "play reverse play reverse"
            }
        });

        // --- STORE SECTION ANIMATION ---
        gsap.to('.store-card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#store",
                start: "top 70%",
                toggleActions: "play reverse play reverse"
            }
        });

        // --- CONTACT SECTION ANIMATION ---
        gsap.to('.contact-card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#contact",
                start: "top 70%",
                toggleActions: "play reverse play reverse"
            }
        });

        // --- ABOUT FINAL SECTION ANIMATION ---
        gsap.from('#about-finale .grid div', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#about-finale",
                start: "top 70%",
                toggleActions: "play reverse play reverse"
            }
        });

    }, { dependencies: [] });

    return (
        <main className="relative bg-black text-white min-h-[600vh] overflow-x-hidden font-sans selection:bg-red-600 selection:text-black">

            {/* Fixed Navbar Background (Only appears after intro) */}
            <div className="fixed top-0 left-0 w-full h-20 md:h-24 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />

            {/* Navigation */}
            <nav
                ref={navRef}
                className="fixed top-0 right-0 p-4 md:p-8 z-50 opacity-0"
            >
                <ul className="flex space-x-4 md:space-x-8 text-xs md:text-sm uppercase tracking-widest font-bold text-white/80">
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' })}>Arena</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>Upcoming</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</li>
                </ul>
            </nav>

            {/* Logo Container (Animated) */}
            <div
                ref={logoRef}
                className="fixed z-50 w-64 md:w-80 opacity-0"
                style={{ willChange: 'transform, top, left' }}
            >
                <Image
                    src="/main-logo.png"
                    alt="Turbo Shack"
                    width={800}
                    height={240}
                    className="w-full h-auto drop-shadow-[0_0_35px_rgba(220,38,38,0.8)]"
                    priority
                />
            </div>

            <section ref={heroRef} className="relative w-full h-[100vh] overflow-hidden bg-black flex items-center pointer-events-auto z-0">
                {/* Background Red Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/80 z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-transparent to-transparent z-10 pointer-events-none mix-blend-screen"></div>

                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[95vw] md:w-[65vw] h-[60vh] md:h-[85vh] z-0 overflow-hidden rounded-r-[2rem]">
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover motion-reduce:transform-none rounded-r-[2rem]"
                        muted
                        loop
                        playsInline
                        preload="auto"
                        style={{
                            opacity: 0,
                            transform: 'translateZ(0px)', // Helps with motion blur if combined with CSS filter in transitions occasionally
                            filter: 'blur(0px)',
                        }}
                    >
                        <source src="/assets/videos/rc-car-animation.mp4.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay to fade the right edge into the black background */}
                    <div className="absolute inset-0 z-10 pointer-events-none rounded-r-[2rem]" style={{
                        background: 'linear-gradient(to right, transparent 0%, transparent 50%, black 100%)',
                        boxShadow: 'inset 0 0 80px 20px #000'
                    }}></div>
                </div>

                {/* Hero Quotes */}
                <div className="hero-text-container absolute top-[65%] md:top-1/2 right-[5%] md:right-[5%] -translate-y-1/2 w-[90%] md:w-[35%] flex flex-col gap-8 md:gap-12 z-20 pointer-events-none px-4 md:px-0 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] items-end text-right">
                    <div className="quote-item opacity-0 translate-x-12">
                        <p className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase relative leading-none">
                            <span className="text-red-600 text-6xl absolute -right-8 -top-4 font-sans drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">"</span>
                            Not just a toy.<br />A precision machine.
                        </p>
                    </div>
                    <div className="quote-item opacity-0 translate-x-12 w-full">
                        <p className="text-base md:text-xl font-light text-white font-mono border-r-4 border-red-600 pr-6 py-2 leading-relaxed bg-black/40 backdrop-blur-sm rounded-l-lg justify-end text-right">
                            "Built for the track. Engineered for pure speed and absolute adrenaline."
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. INTERACTIVE SHOWCASE */}
            <Section id="showcase" className="relative w-full min-h-screen bg-black overflow-hidden flex items-center z-10 pt-20">
                {/* Showcase Background Glow */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7A0000]/20 via-black to-black pointer-events-none mix-blend-screen overflow-hidden">
                    {/* Add faint particle dust or noise here if needed via CSS later, keeping minimal for performance */}
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[70vh]">

                    {/* LEFT SIDE: Selection Grid */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                                SELECT YOUR <br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">CHAMPION</span>
                            </h2>
                            <p className="text-white/60 font-mono text-lg mb-8">Choose your vehicle. Command the track.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {SHOWCASE_CARS.map((car) => {
                                const isSelected = selectedCar === car.id;
                                return (
                                    <div
                                        key={car.id}
                                        onClick={() => setSelectedCar(car.id)}
                                        className={`cursor-pointer p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 relative overflow-hidden group
                                            ${isSelected
                                                ? 'border-red-600 bg-red-950/20 shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                                                : 'border-white/10 bg-white/5 hover:border-red-600/50 hover:bg-white/10'}`}
                                    >
                                        {/* Minimal thumb preview */}
                                        <div className="h-24 w-full relative mb-4 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                            <Image src={car.img} alt={car.name} fill className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" />
                                        </div>
                                        <h3 className={`text-sm md:text-lg font-bold uppercase transition-colors ${isSelected ? 'text-red-500' : 'text-white'}`}>{car.name}</h3>
                                        <p className="text-xs text-white/40 font-mono mb-2">{car.type}</p>

                                        {/* Stats */}
                                        <div className="flex gap-2 text-[10px] font-mono tracking-widest text-white/30">
                                            <span>SPD: {car.speed}</span>
                                            <span>|</span>
                                            <span>CTRL: {car.diff}</span>
                                        </div>

                                        {/* Selection Glow Indicator */}
                                        {isSelected && (
                                            <motion.div layoutId="selectionGlow" className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none box-border" />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Drift Showcase Area */}
                    <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden perspective-[1000px]">



                        {/* Soft Vignette Overlay to focus attention */}
                        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none mix-blend-multiply"></div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCar}
                                className="absolute inset-0 flex items-center justify-center pt-12 md:pt-20"
                                // Cinematic Assembly Camera Push
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{
                                    opacity: 1,
                                    scale: [0.85, 1],
                                    filter: ["blur(5px)", "blur(0px)"]
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 1.05,
                                    filter: "blur(5px)"
                                }}
                                transition={{
                                    duration: 1.4,
                                    ease: "easeOut"
                                }}
                            >
                                {/* Subtle Red Light Streak Passing Behind */}
                                <motion.div
                                    className="absolute top-1/2 left-0 w-[200%] h-1 bg-red-500/80 shadow-[0_0_30px_15px_rgba(220,38,38,0.7)] mix-blend-screen pointer-events-none"
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                                    transition={{ duration: 1.4, ease: "circOut", delay: 0.1 }}
                                />

                                {/* Floor Reflection (Deep ambient red underglow) */}
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-16 bg-[#7A0000]/40 blur-[30px] rounded-[100%] pointer-events-none mix-blend-lighten"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: [0, 0.4, 0.7], scale: [0.8, 1.2, 1.1] }}
                                    transition={{ duration: 1.4, times: [0, 0.45, 1] }}
                                />

                                {/* Dynamic Shadow Under Car (Enhanced studio falloff) */}
                                <motion.div
                                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-black blur-[20px] rounded-[100%] pointer-events-none"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: [0, 0.9, 1], scale: [0.8, 1.2, 1] }}
                                    transition={{ duration: 1.4, times: [0, 0.45, 1] }}
                                />



                                {/* The Car Image with Continuous 360 Rotation Showcase */}
                                <motion.div
                                    className="relative w-full max-w-[500px] aspect-square z-10"
                                >
                                    {/* 360° Continuous Interactive Rotation Wrapper */}
                                    <RotatingShowcaseCar carId={selectedCar} />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </Section>

            {/* 3. ABOUT COMPANY */}
            <Section id="about" className="relative text-center bg-black overflow-hidden z-20 pt-24 pb-32">
                {/* Background Red Glow & Streaks */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black z-0 pointer-events-none"></div>
                <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-30">
                    <div className="absolute top-1/4 left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent -rotate-12 blur-sm translate-x-full animate-[pulse_4s_ease-in-out_infinite]"></div>
                    <div className="absolute top-2/3 left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent -rotate-6 blur-[2px] -translate-x-full animate-[pulse_6s_ease-in-out_infinite_reverse]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 p-4 md:p-8 z-10">
                    {/* Left: Text */}
                    <div className="md:w-1/2 space-y-10 text-left pl-4 md:pl-12 border-l-2 border-red-600/50">
                        <h2 className="about-text-element text-4xl md:text-7xl font-black uppercase text-white tracking-tighter opacity-0 translate-y-10">
                            Engineering <br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">Supremacy</span>
                        </h2>
                        <p className="about-text-element text-lg md:text-2xl text-white/70 leading-relaxed font-light font-mono opacity-0 translate-y-10">
                            We don't just build RC cars. We forge raw adrenaline. Every chassis, every motor, and every aerodynamic curve is meticulously engineered to bring professional motorsport intensity straight to the palm of your hand.
                        </p>
                        <div className="about-text-element inline-block border border-red-600/30 px-8 py-4 text-red-500 font-mono text-sm tracking-widest uppercase bg-red-900/10 backdrop-blur-sm opacity-0 translate-y-10 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                            EST. 2026 // UNRIVALED PERFORMANCE
                        </div>
                    </div>

                    {/* Right: Realistic Car Details image */}
                    <div className="md:w-1/2 w-full flex justify-center items-center">
                        <div className="about-image relative w-[80%] aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden group opacity-0 translate-y-16 scale-95">
                            {/* Ambient Glow behind image */}
                            <div className="absolute inset-0 bg-red-600/20 blur-[50px] group-hover:bg-red-500/40 transition-colors duration-1000 z-0"></div>

                            {/* Realistic Car Image with Hover Floating */}
                            <div className="relative w-full h-full z-10 group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-[2000ms] ease-out">
                                <Image
                                    src="/csr2.png" // Using one of the provided sleek car images
                                    alt="Professional RC Car Detail"
                                    fill
                                    className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 4. ARENA / EVENTS */}
            <div className="relative w-full overflow-hidden">
                <Section id="arena" className="bg-transparent text-left relative z-10">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Left Side: Title */}
                            <div className="md:w-1/3 text-left">
                                <h2 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter">
                                    THE <br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">ARENA</span>
                                </h2>
                                <p className="text-white/60 font-mono text-sm md:text-base">
                                    Compete globally. Dominate locally.
                                </p>
                            </div>

                            {/* Right Side: Cards */}
                            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                {/* Card 1: Book Your Slot */}
                                <div className="arena-card opacity-0 translate-y-10 bg-zinc-900/80 border border-purple-500/50 p-6 rounded-xl backdrop-blur-md hover:scale-105 transition-transform cursor-pointer group">
                                    <div className="h-32 mb-4 bg-purple-500/20 rounded-lg flex items-center justify-center overflow-hidden relative">
                                        <div className="absolute inset-0 bg-purple-500/20 animate-pulse"></div>
                                        <span className="text-4xl relative z-10">🏁</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">BOOK YOUR SLOT</h3>
                                    <p className="text-xs text-white/50 mb-4">Secure your place in the next global tournament.</p>
                                    <button className="w-full py-2 bg-purple-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-colors rounded">
                                        Reserve Now
                                    </button>
                                </div>

                                {/* Card 2: Coming Soon */}
                                <div className="arena-card opacity-0 translate-y-10 bg-zinc-900/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm grayscale opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="h-32 mb-4 bg-white/5 rounded-lg flex items-center justify-center">
                                        <span className="text-4xl">🔒</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                                    <p className="text-xs text-white/50 mb-4">Global rankings and stats.</p>
                                    <button className="w-full py-2 bg-white/10 text-white/30 font-bold text-xs uppercase tracking-widest cursor-not-allowed rounded" disabled>
                                        Locked
                                    </button>
                                </div>

                                {/* Card 3: Coming Soon */}
                                <div className="arena-card opacity-0 translate-y-10 bg-zinc-900/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm grayscale opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="h-32 mb-4 bg-white/5 rounded-lg flex items-center justify-center">
                                        <span className="text-4xl">🔒</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                                    <p className="text-xs text-white/50 mb-4">Live streaming integration.</p>
                                    <button className="w-full py-2 bg-white/10 text-white/30 font-bold text-xs uppercase tracking-widest cursor-not-allowed rounded" disabled>
                                        Locked
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>

            {/* 5. BOOK YOUR EVENT */}
            <Section id="events" className="bg-transparent relative z-20">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-12 text-center tracking-tighter">
                        BOOK YOUR <span className="text-green-500">EVENT</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Event Card 1 */}
                        <div className="event-card opacity-0 translate-y-10 bg-zinc-900 border border-white/10 p-6 hover:border-green-500 transition-colors group cursor-pointer">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400">PRIVATE PARTY</h3>
                            <p className="text-sm text-white/50 mb-4">Exclusive track access for you and your friends.</p>
                            <div className="h-1 w-12 bg-green-500/30 group-hover:bg-green-500 transition-colors"></div>
                        </div>

                        {/* Event Card 2 */}
                        <div className="event-card opacity-0 translate-y-10 bg-zinc-900 border border-white/10 p-6 hover:border-green-500 transition-colors group cursor-pointer">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400">CORPORATE RACE</h3>
                            <p className="text-sm text-white/50 mb-4">Team building at 50mph. Trophies included.</p>
                            <div className="h-1 w-12 bg-green-500/30 group-hover:bg-green-500 transition-colors"></div>
                        </div>

                        {/* Event Card 3 */}
                        <div className="event-card opacity-0 translate-y-10 bg-zinc-900 border border-white/10 p-6 hover:border-green-500 transition-colors group cursor-pointer">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400">CHAMPIONSHIP</h3>
                            <p className="text-sm text-white/50 mb-4">Join the official seasonal league.</p>
                            <div className="h-1 w-12 bg-green-500/30 group-hover:bg-green-500 transition-colors"></div>
                        </div>

                        {/* Event Card 4 */}
                        <div className="event-card opacity-0 translate-y-10 bg-zinc-900 border border-white/10 p-6 hover:border-green-500 transition-colors group cursor-pointer">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400">CUSTOM TRACK</h3>
                            <p className="text-sm text-white/50 mb-4">Design your own layout for a special event.</p>
                            <div className="h-1 w-12 bg-green-500/30 group-hover:bg-green-500 transition-colors"></div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 6. STORE */}
            <Section id="store" className="bg-transparent relative z-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Left Side: Title */}
                        <div className="md:w-1/3 text-left">
                            <h2 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
                                THE <span className="text-blue-500">STORE</span>
                            </h2>
                            <p className="text-white/60 font-mono text-sm md:text-base mb-8">
                                Upgrade your ride. Build your dream.
                            </p>
                            <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors">
                                Shop All Actions
                            </button>
                        </div>

                        {/* Right Side: Category Blocks */}
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {/* Category 1: 3D Printed Parts */}
                            <div className="store-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl">⚙️</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">3D PRINTED PARTS</h3>
                                <p className="text-sm text-white/50 mb-6 relative z-10">Custom chassis, suspension arms, and body kits.</p>
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest group-hover:underline">View Parts &rarr;</span>
                            </div>

                            {/* Category 2: Toys */}
                            <div className="store-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl">🎮</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">TOYS</h3>
                                <p className="text-sm text-white/50 mb-6 relative z-10">Ready-to-Run electric and nitro RC cars.</p>
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest group-hover:underline">Browse Toys &rarr;</span>
                            </div>

                            {/* Category 3: Toy Store */}
                            <div className="store-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl">🏬</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">TOY STORE</h3>
                                <p className="text-sm text-white/50 mb-6 relative z-10">Complete sets, tracks, and starter kits.</p>
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest group-hover:underline">Visit Store &rarr;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 7. CONTACT */}
            <Section id="contact" className="bg-gradient-to-t from-red-900/10 to-transparent relative z-20">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-12 text-center tracking-tighter">
                        CONTACT <span className="text-red-600">US</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Card 1: For Franchise */}
                        <div className="contact-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-10 rounded-2xl hover:border-red-600 transition-all cursor-pointer group text-center hover:scale-[1.02] duration-300">
                            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600/20 transition-colors">
                                <span className="text-4xl">🏢</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">FOR FRANCHISE</h3>
                            <p className="text-white/60 mb-8 max-w-sm mx-auto">
                                Want to bring Turbo Shack to your city? Partner with us to build the ultimate RC racing destination.
                            </p>
                            <button className="px-8 py-3 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all rounded">
                                Apply Now
                            </button>
                        </div>

                        {/* Card 2: For Query */}
                        <div className="contact-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-10 rounded-2xl hover:border-red-600 transition-all cursor-pointer group text-center hover:scale-[1.02] duration-300">
                            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600/20 transition-colors">
                                <span className="text-4xl">💬</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">FOR QUERY</h3>
                            <p className="text-white/60 mb-8 max-w-sm mx-auto">
                                Have questions about events, parts, or general support? Our team is ready to assist you.
                            </p>
                            <button className="px-8 py-3 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all rounded">
                                Get In Touch
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 8. ABOUT US (Finale) */}
            <Section id="about-finale" className="bg-transparent relative z-20 pb-32 pt-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center gap-12">
                        {/* Content */}
                        <div className="w-full max-w-4xl text-center space-y-8 mx-auto">
                            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
                                OUR <span className="text-yellow-500">STORY</span>
                            </h2>
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                                Founded in 2026, Turbo Shack began with a simple mission: to blur the line between toy and machine.
                                We engineer precision RC vehicles that deliver raw adrenaline, speed, and competitive spirit.
                                Whether you're a weekend basher or a pro racer, this is your home.
                            </p>
                            <div className="flex justify-center space-x-8 text-sm font-bold text-white uppercase tracking-widest mt-12">
                                <span className="hover:text-yellow-500 cursor-pointer transition-colors">Instagram</span>
                                <span className="hover:text-yellow-500 cursor-pointer transition-colors">YouTube</span>
                                <span className="hover:text-yellow-500 cursor-pointer transition-colors">Discord</span>
                            </div>
                            <p className="text-xs text-white/30 uppercase tracking-widest">© 2026 TURBO SHACK. ALL RIGHTS RESERVED.</p>
                        </div>
                    </div>
                </div>
            </Section>

            <Footer />
        </main>
    );
}
