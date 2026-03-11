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
    { id: '1', name: 'TURBOSHACK CIRCUIT ZONE', type: 'Grip. Apex. Speed.', img: '/csr1.png', speed: 'MAX', diff: 'HARD' },
    { id: '2', name: '"WHAT ROAD?" ZONE', type: 'Defy gravity.', img: '/csr2.png', speed: 'HIGH', diff: 'EASY' },
    { id: '3', name: 'BUILD SOCIETY', type: 'Dig. Lift. Build. Relax.', img: '/csr3.png', speed: 'HIGH', diff: 'MED' },
    { id: '4', name: 'BUGGY WARRIOR', type: 'Mecha-Drift', img: '/csr4.png', speed: 'MED', diff: 'MED' },
];

function InteractiveShowcaseCard({ carId }: { carId: string }) {
    const car = SHOWCASE_CARS.find(c => c.id === carId) || SHOWCASE_CARS[0];
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const calcX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const calcY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        x.set(calcX);
        y.set(calcY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Smooth scaling for 3D tilt
    const rotateX = useTransform(y, [-1, 1], [15, -15]);
    const rotateY = useTransform(x, [-1, 1], [-15, 15]);

    const idleRotation = useMotionValue(0);
    useAnimationFrame((t) => {
        idleRotation.set(Math.sin(t / 1000) * 8); // slowly rotate left and right
    });

    // Mock Specs since original object didn't have year/mileage/hp
    const Specs = {
        '1': { price: '$499', year: '2026', mileage: 'NEW', hp: '2.5 HP' },
        '2': { price: '$549', year: '2026', mileage: 'NEW', hp: '3.1 HP' },
        '3': { price: '$399', year: '2025', mileage: 'NEW', hp: '1.8 HP' },
        '4': { price: '$449', year: '2026', mileage: 'NEW', hp: '2.2 HP' },
    }[carId] || { price: '$499', year: '2026', mileage: 'NEW', hp: '2.0 HP' };

    return (
        <motion.div
            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] aspect-[4/5] relative rounded-3xl"
            style={{ perspective: 1200 }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 } }
            }}
            key={carId}
        >
            <motion.div
                className="w-full h-full rounded-3xl p-5 md:p-8 flex flex-col justify-between border border-white/20 bg-white/5 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden relative group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="absolute -inset-20 bg-red-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex justify-between items-start z-10" style={{ transform: "translateZ(30px)" }}>
                    <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                        <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md leading-tight">{car.name}</h3>
                        <p className="text-white/60 font-mono text-[10px] md:text-sm tracking-widest mt-1">{car.type}</p>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                        <span className="text-lg md:text-xl font-bold text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">{Specs.price}</span>
                    </motion.div>
                </div>

                <motion.div
                    className="flex-1 w-full relative flex items-center justify-center pointer-events-none my-6"
                    style={{ transform: "translateZ(80px)" }}
                >
                    <motion.div
                        className="w-[130%] h-[130%] relative group-hover:scale-110 group-hover:drop-shadow-[0_40px_40px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-out"
                        style={{ rotate: idleRotation }}
                        variants={{
                            hidden: { opacity: 0, x: -80, filter: "blur(10px)" }, // slide from left with blur
                            visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                    >
                        <Image
                            src={car.img}
                            alt={car.name}
                            fill
                            className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]"
                            priority
                        />
                    </motion.div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black blur-[15px] rounded-[100%] opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
                </motion.div>

                <motion.div
                    className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 md:pt-6 z-10"
                    style={{ transform: "translateZ(40px)" }}
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                >
                    <div className="flex flex-col text-center">
                        <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-mono">Year</span>
                        <span className="text-xs md:text-sm font-bold text-white mt-1">{Specs.year}</span>
                    </div>
                    <div className="flex flex-col text-center border-l border-r border-white/10">
                        <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-mono">Mileage</span>
                        <span className="text-xs md:text-sm font-bold text-white mt-1">{Specs.mileage}</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-mono">Power</span>
                        <span className="text-xs md:text-sm font-bold text-white mt-1">{Specs.hp}</span>
                    </div>
                </motion.div>
            </motion.div>
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

            {/* Navbar Background (Only appears after intro) */}
            <div className="absolute top-0 left-0 w-full h-20 md:h-24 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />

            {/* Navigation */}
            <nav
                ref={navRef}
                className="absolute top-0 right-0 p-4 md:p-8 z-50 opacity-0"
            >
                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-bold text-white/80">
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' })}>Arena</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>Upcoming</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</li>
                </ul>

                {/* Mobile Hamburger Icon */}
                <div className="md:hidden flex items-center justify-end">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white hover:text-red-600 focus:outline-none z-[60] relative p-2"
                        aria-label="Toggle mobile menu"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`h-0.5 w-full bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center md:hidden"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 text-white/50 hover:text-red-500 transition-colors focus:outline-none"
                            aria-label="Close menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ul className="flex flex-col space-y-8 text-xl uppercase tracking-widest font-bold text-white">
                            <li className="hover:text-red-600 cursor-pointer transition-colors text-center" onClick={() => { setIsMobileMenuOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors text-center" onClick={() => { setIsMobileMenuOpen(false); document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' }); }}>Arena</li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors text-center" onClick={() => { setIsMobileMenuOpen(false); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }); }}>Upcoming</li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors text-center" onClick={() => { setIsMobileMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

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

                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[95vw] md:w-[65vw] aspect-video md:aspect-auto h-auto md:h-[85vh] z-0 overflow-hidden rounded-r-[2rem]">
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
                    {/* Mobile-only precise Top/Bottom seamless fade to black */}
                    <div className="absolute inset-0 z-10 pointer-events-none rounded-r-[2rem] md:hidden" style={{
                        boxShadow: 'inset 0 0 30px 10px #000',
                        background: 'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)'
                    }}></div>
                </div>

                {/* Hero Quotes */}
                <div className="hero-text-container absolute top-[65%] md:top-1/2 right-[5%] md:right-[5%] -translate-y-1/2 w-[90%] md:w-[35%] flex flex-col gap-8 md:gap-12 z-20 pointer-events-none px-4 md:px-0 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] items-end text-right">
                    <div className="quote-item opacity-0 translate-x-12">
                        <p className="text-xl md:text-3xl font-black text-white italic tracking-tighter uppercase relative leading-none">
                            <span className="text-red-600 text-6xl absolute -right-8 -top-4 font-sans drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">"</span>
                            The next generation of<br />indoor driving is here.
                        </p>
                    </div>
                    <div className="quote-item opacity-0 translate-x-12 w-full">
                        <p className="text-sm md:text-xl font-light text-white font-mono border-r-4 border-red-600 pr-6 py-2 leading-relaxed bg-black/40 backdrop-blur-sm rounded-l-lg justify-end text-right">
                            "A premium, dynamically engineered RC arena. Built for speed, precision and total immersion."
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. INTERACTIVE SHOWCASE */}
            <Section id="showcase" className="relative w-full min-h-screen bg-black overflow-hidden flex items-center z-10 pt-20">
                {/* Showcase Background Image Removed */}

                {/* Showcase Background Glow */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7A0000]/20 via-transparent to-transparent pointer-events-none mix-blend-screen overflow-hidden z-0">
                    {/* Add faint particle dust or noise here if needed via CSS later, keeping minimal for performance */}
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 py-12">
                    {/* Mobile Only Title (Sits at the very top on mobile) */}
                    <div className="text-center md:hidden mb-8">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                            SELECT YOUR <br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">ZONES</span>
                        </h2>
                        <p className="text-white/60 font-mono text-sm">Choose your environment. Command the track.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center min-h-[70vh] gap-8 md:gap-12">
                        {/* LEFT SIDE: Selection Grid (Bottom on Mobile, Left on Desktop) */}
                        <div className="flex flex-col space-y-4 md:space-y-8 w-full md:w-1/2 order-2 md:order-1">
                            <div className="hidden md:block text-left">
                                <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">
                                    SELECT YOUR <br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">ZONES</span>
                                </h2>
                                <p className="text-white/60 font-mono text-lg mb-8">Choose your environment. Command the track.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
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

                        {/* RIGHT SIDE: Drift Showcase Area (Top on Mobile, Right on Desktop) */}
                        <div className="relative w-full md:w-1/2 h-[50vh] md:h-[80vh] flex items-center justify-center overflow-hidden perspective-[1000px] order-1 md:order-2">



                            {/* Soft Vignette Overlay to focus attention */}
                            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none mix-blend-multiply"></div>
                            <AnimatePresence mode="wait">
                                <InteractiveShowcaseCard key={selectedCar} carId={selectedCar} />
                            </AnimatePresence>
                        </div>

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
                    <div className="md:w-1/2 space-y-6 md:space-y-10 text-left pl-4 md:pl-12 border-l-2 border-red-600/50">
                        <h2 className="about-text-element text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter opacity-0 translate-y-10 leading-[1.1] md:leading-tight">
                            Compact.<br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">Engineered.</span><br />
                            Maximum Fun.
                        </h2>
                        <p className="about-text-element text-sm md:text-xl lg:text-2xl text-white/70 leading-relaxed font-light font-mono opacity-0 translate-y-10 pr-2 md:pr-0">
                            Every track element, obstacle, and layout decision is designed to maximize excitement while using space intelligently. The result is a high-energy arena packed with driving possibilities. Turbo Shack was built around one powerful idea: Small footprint, Massive experience.
                        </p>
                        <div className="about-text-element inline-block border border-red-600/30 px-3 md:px-8 py-3 md:py-4 text-red-500 font-mono text-[10px] md:text-sm tracking-[0.15em] md:tracking-widest uppercase bg-red-900/10 backdrop-blur-sm opacity-0 translate-y-10 shadow-[0_0_20px_rgba(220,38,38,0.1)] w-full md:w-auto text-center md:text-left max-w-sm md:max-w-none mx-auto md:mx-0">
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
                                    src="/off1.png"
                                    alt="Professional RC Car Detail"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 4. ARENA / EVENTS */}
            <div className="relative w-full overflow-hidden py-16">
                {/* Arena Background Image Removed */}

                <Section id="arena" className="bg-transparent text-left relative z-10">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Left Side: Title */}
                            <div className="md:w-1/3 text-left">
                                <h2 className="text-4xl md:text-8xl font-black text-white mb-4 tracking-tighter">
                                    THE <br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">ARENA</span>
                                </h2>
                                <p className="text-white/60 font-mono text-sm md:text-base">
                                    Compete globally. Dominate locally.
                                </p>
                            </div>

                            {/* Right Side: Cards */}
                            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                {/* Card 1: Book Your Slot */}
                                <div onClick={() => alert("Reservation system opening soon...")} className="arena-card opacity-0 translate-y-10 bg-zinc-900/80 border border-purple-500/50 p-4 md:p-6 rounded-xl backdrop-blur-md hover:scale-105 transition-transform cursor-pointer group">
                                    <div className="h-24 md:h-32 mb-3 md:mb-4 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                                        <Image src="/electroniccity.png" alt="Electronic City Arena" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-purple-400 transition-colors">PRE BOOK</h3>
                                    <p className="text-[10px] md:text-xs text-white/50 mb-3 md:mb-4">Secure your place in the next global tournament.</p>
                                    <button className="w-full py-2 bg-purple-600 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-purple-700 transition-colors rounded">
                                        Reserve Now
                                    </button>
                                </div>

                                {/* Card 2: Coming Soon */}
                                <div className="arena-card opacity-0 translate-y-10 bg-zinc-900/50 border border-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm grayscale opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="h-24 md:h-32 mb-3 md:mb-4 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                                        <Image src="/airport.png" alt="Airport Arena" fill className="object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                                        <span className="text-3xl md:text-4xl relative z-10 drop-shadow-lg">🔒</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Coming Soon</h3>
                                    <p className="text-[10px] md:text-xs text-white/50 mb-3 md:mb-4">Global rankings and stats.</p>
                                    <button className="w-full py-2 bg-white/10 text-white/30 font-bold text-[10px] md:text-xs uppercase tracking-widest cursor-not-allowed rounded" disabled>
                                        Locked
                                    </button>
                                </div>

                                {/* Card 3: Coming Soon */}
                                <div className="arena-card opacity-0 translate-y-10 bg-zinc-900/50 border border-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm grayscale opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="h-24 md:h-32 mb-3 md:mb-4 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                                        <Image src="/highway.png" alt="Highway Arena" fill className="object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                                        <span className="text-3xl md:text-4xl relative z-10 drop-shadow-lg">🔒</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Coming Soon</h3>
                                    <p className="text-[10px] md:text-xs text-white/50 mb-3 md:mb-4">Live streaming integration.</p>
                                    <button className="w-full py-2 bg-white/10 text-white/30 font-bold text-[10px] md:text-xs uppercase tracking-widest cursor-not-allowed rounded" disabled>
                                        Locked
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Signature Events (New Addition) */}
                        <div className="mt-16 border-t border-white/10 pt-10 flex flex-col items-center">
                            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center">
                                SIGNATURE <span className="text-red-600">EVENTS</span>
                            </h3>

                            {/* Staggered Event List */}
                            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                                {[
                                    "TIME ATTACK",
                                    "TREASURE HUNT",
                                    "HIT THE LOOP",
                                    "PERFECT LAP",
                                    "KIDS CIRCUIT",
                                    "AND MANY MORE..."
                                ].map((event, i) => (
                                    <div
                                        key={event}
                                        className="bg-black/40 border border-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full hover:border-red-600/50 hover:bg-red-900/10 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all cursor-default"
                                    >
                                        <span className="text-xs md:text-base font-bold text-white tracking-widest uppercase">
                                            {event}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </Section>
            </div>

            {/* 5. BOOK YOUR EVENT */}
            <Section id="events" className="bg-transparent relative z-20 py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        {/* Left Side: Mockup Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.15)] group bg-zinc-900"
                        >
                            <Image
                                src="/booking.png"
                                alt="Book Your Event Dashboard"
                                fill
                                className="object-cover z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                            />
                            {/* Overlay glow for deeper integration */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none"></div>
                        </motion.div>

                        {/* Right Side: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="flex flex-col space-y-5 md:space-y-8"
                        >
                            <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                                Own the Track for Events That Actually <span className="text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">Move</span>
                            </h2>
                            <p className="text-sm md:text-lg text-white/60 leading-relaxed max-w-lg">
                                Forget boring venues. Turbo Shack transforms events into interactive racing experiences where guests compete, laugh, and drive together.
                            </p>

                            <div className="pt-4">
                                <h4 className="text-sm font-bold text-green-500 uppercase tracking-widest mb-6 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">Perfect for</h4>
                                <ul className="space-y-4">
                                    {[
                                        "Corporate Events",
                                        "Birthday Parties",
                                        "Team Building",
                                        "Kids Celebrations",
                                        "Private Racing Nights"
                                    ].map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                                            className="flex items-center text-white/80 font-medium text-sm md:text-lg tracking-wide hover:text-white transition-colors"
                                        >
                                            <span className="h-1.5 w-1.5 md:h-2 md:w-2 bg-red-500 rounded-full mr-3 md:mr-4 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="pt-6"
                            >
                                <button className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                                    Check Availability
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* 6. STORE */}
            <Section id="store" className="bg-transparent relative z-20">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-0">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        {/* Left Side: Title */}
                        <div className="md:w-1/3 text-left">
                            <h2 className="text-3xl md:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter">
                                THE TURBO SHACK <br /><span className="text-blue-500">ECOSYSTEM</span>
                            </h2>
                            <p className="text-white/60 font-mono text-sm md:text-base mb-6 md:mb-8">
                                Gear Up. Build Out.
                            </p>
                            <button className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-base bg-white text-black font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors rounded">
                                Shop All Actions
                            </button>
                        </div>

                        {/* Right Side: Category Blocks */}
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {/* Category 1: 3D Studio */}
                            <div onClick={() => alert("Entering 3D Studio...")} className="store-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-6 md:p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl">⚙️</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 relative z-10">3D STUDIO</h3>
                                <p className="text-sm text-white/50 mb-4 md:mb-6 relative z-10">Collector-grade precision. Custom 3D-printed figures, scale models, and industrial-level prototypes.</p>
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest group-hover:underline">View Parts &rarr;</span>
                            </div>

                            {/* Category 2: The Pro Shop */}
                            <div onClick={() => alert("Entering The Pro Shop...")} className="store-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-6 md:p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl">🏎️</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 relative z-10">THE PRO SHOP</h3>
                                <p className="text-sm text-white/50 mb-6 relative z-10">Driven by performance. Premium RC machines, essential upgrades, spare parts, and pro accessories.</p>
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest group-hover:underline">Browse Pro Shop &rarr;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 7. CONTACT */}
            <Section id="contact" className="bg-gradient-to-t from-red-900/10 to-transparent relative z-20 pt-12 md:pt-24 pb-4 md:pb-12">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-8xl font-black text-white mb-8 md:mb-12 text-center tracking-tighter">
                        CONTACT <span className="text-red-600">US</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
                        {/* Card 1: For Franchise */}
                        <div className="contact-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-6 md:p-10 rounded-2xl hover:border-red-600 transition-all cursor-pointer group text-center hover:scale-[1.02] duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-red-600/20 transition-colors">
                                <span className="text-3xl md:text-4xl">🏢</span>
                            </div>
                            <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-red-500 transition-colors">FOR FRANCHISE</h3>
                            <p className="text-white/60 mb-6 md:mb-8 max-w-sm mx-auto text-sm md:text-base">
                                Want to bring Turbo Shack to your city? Partner with us to build the ultimate RC racing destination.
                            </p>
                            <button className="px-6 md:px-8 py-3 bg-transparent border border-white/30 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all rounded">
                                Apply Now
                            </button>
                        </div>

                        {/* Card 2: For Query */}
                        <div className="contact-card opacity-0 translate-y-10 bg-zinc-900/80 border border-white/10 p-6 md:p-10 rounded-2xl hover:border-red-600 transition-all cursor-pointer group text-center hover:scale-[1.02] duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-red-600/20 transition-colors">
                                <span className="text-3xl md:text-4xl">💬</span>
                            </div>
                            <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-red-500 transition-colors">FOR QUERY</h3>
                            <p className="text-white/60 mb-6 md:mb-8 max-w-sm mx-auto text-sm md:text-base">
                                Have questions about events, parts, or general support? Our team is ready to assist you.
                            </p>
                            <button className="px-6 md:px-8 py-3 bg-transparent border border-white/30 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all rounded">
                                Get In Touch
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 8. ABOUT US (Finale) */}
            <Section id="about-finale" className="bg-transparent relative z-20 pb-16 pt-4 md:pb-32 md:pt-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
                        {/* Content */}
                        <div className="w-full max-w-4xl text-center space-y-4 md:space-y-8 mx-auto">
                            <h2 className="text-3xl md:text-8xl font-black text-white tracking-tighter">
                                OUR <span className="text-yellow-500">STORY</span>
                            </h2>
                            <p className="text-sm md:text-xl text-white/60 leading-relaxed px-2 md:px-0">
                                Founded in 2026, Turbo Shack began with a simple mission: to blur the line between toy and machine.
                                We engineer precision RC vehicles that deliver raw adrenaline, speed, and competitive spirit.
                                Whether you're a weekend basher or a pro racer, this is your home.
                            </p>
                            <div className="flex justify-center space-x-4 md:space-x-8 text-[10px] md:text-sm font-bold text-white uppercase tracking-widest mt-8 md:mt-12">
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
