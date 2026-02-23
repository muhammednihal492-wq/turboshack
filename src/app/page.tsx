'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import RaceTrack from '@/components/RaceTrack';
import Section from '@/components/Section';
// import TurboShackLogo from '@/components/TurboShackLogo'; // Removed as we are using image
import CarVisual from '@/components/CarVisual';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    // Refs for animation targets
    const logoRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const video = videoRef.current;
        const logo = logoRef.current;
        const nav = navRef.current;
        const trackContainer = trackRef.current;

        if (!video || !logo || !nav || !trackContainer) return;

        // --- 1. INITIAL STATE ---
        const trackPaths = gsap.utils.toArray('.track-path');
        const introCar = document.getElementById('intro-car');

        // Lock Scroll
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        // Hide Elements Initially
        gsap.set(video, { opacity: 0 }); // Video hidden
        gsap.set(nav, { y: -20, opacity: 0 }); // Nav hidden
        gsap.set(trackContainer, { opacity: 1 }); // Container visible
        gsap.set(introCar, { opacity: 0 }); // Car hidden

        // Prepare Track for Drawing (Stroke Dashoffset)
        trackPaths.forEach((path: any) => {
            const length = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
                opacity: 1
            });
        });

        // Logo: Centered, Scaled 0.8, Invisible
        gsap.set(logo, {
            top: '50%',
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
            scale: 1.2, // Slight scale up
            duration: 1.0,
            ease: "power2.out"
        });

        // Step 2: Hold for 1 Second
        tl.to({}, { duration: 1.0 });

        // Step 3: Logo Move & Track Draw (Simultaneous)
        const moveTime = 2.0;

        tl.addLabel("moveStart");

        // 3a. Move Logo to Top-Left
        tl.to(logo, {
            top: '2rem',
            left: '2rem',
            xPercent: 0,
            yPercent: 0,
            scale: 0.7, // Scale down small for header
            duration: moveTime,
            ease: "power4.inOut"
        }, "moveStart");

        // 3b. Draw Track (Curving Downward)
        tl.to(trackPaths, {
            strokeDashoffset: 0,
            duration: moveTime * 1.5, // Slightly longer effect
            ease: "power1.inOut",
            stagger: 0.1 // Draw layers slightly offset
        }, "moveStart");



        // 3d. Reveal Video & Nav (Subtle, background)
        tl.to(video, {
            opacity: 1,
            duration: 2.0,
            onStart: () => { video.play().catch(() => { }); }
        }, "moveStart+=1.0");

        tl.to(nav, {
            y: 0,
            opacity: 1,
            duration: 1.0
        }, "moveStart+=1.5");

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

            {/* Race Track Container (Controlled by Intro) */}
            <div ref={trackRef} className="absolute inset-0 z-10 pointer-events-none">
                <RaceTrack />
            </div>

            {/* Navigation */}
            <nav
                ref={navRef}
                className="fixed top-0 right-0 p-4 md:p-8 z-50 opacity-0"
            >
                <ul className="flex space-x-4 md:space-x-8 text-xs md:text-sm uppercase tracking-widest font-bold text-white/80">
                    <li className="hover:text-red-600 cursor-pointer transition-colors">About</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors">Arena</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors">Upcoming</li>
                    <li className="hover:text-red-600 cursor-pointer transition-colors">Contact</li>
                </ul>
            </nav>

            {/* Logo Container (Animated) */}
            <div
                ref={logoRef}
                className="fixed z-50 w-32 md:w-48 opacity-0"
                style={{ willChange: 'transform, top, left' }}
            >
                <Image
                    src="/main-logo.png"
                    alt="Turbo Shack"
                    width={800}
                    height={240}
                    className="w-full h-auto drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                    priority
                />
            </div>

            <section className="hero" data-ag="parallax fade" data-ag-speed="0.6">
                {/* LEFT SIDE: VIDEO */}
                <div className="hero-left">
                    <video
                        ref={videoRef}
                        className="hero-video"
                        muted
                        loop
                        playsInline
                        style={{ opacity: 0 }}
                    >
                        <source src="/assets/videos/rc-car-hero.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* RIGHT SIDE: TRACK (Empty container, track is background/absolute) */}
                <div className="hero-right">
                </div>
            </section>

            {/* 2. GALLERY */}
            <Section id="gallery" className="md:grid md:grid-cols-2 gap-12 border-t border-white/5 bg-transparent">
                <div className="space-y-6 p-4 md:p-8">
                    <h2 className="text-3xl md:text-7xl font-bold text-white mb-8 border-l-8 border-cyan-400 pl-6">
                        PRECISION <br /> <span className="text-cyan-400">ENGINEERING</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 font-mono">
                        From off-road beasts to track-tuned precision machines.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 md:p-8">
                    <div className="aspect-square bg-gray-900 border border-white/10 rounded-lg hover:border-cyan-400 transition-colors relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Image src="/csr1.png" alt="Off-Road RC Car" fill className="object-contain p-4 scale-90 group-hover:scale-100 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square bg-gray-900 border border-white/10 rounded-lg translate-y-8 hover:border-cyan-400 transition-colors relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Image src="/csr2.png" alt="Race RC Car" fill className="object-contain p-4 scale-90 group-hover:scale-100 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square bg-gray-900 border border-white/10 rounded-lg hover:border-cyan-400 transition-colors relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Image src="/csr3.png" alt="Buggy RC Car" fill className="object-contain p-4 scale-90 group-hover:scale-100 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square bg-gray-900 border border-white/10 rounded-lg translate-y-8 hover:border-cyan-400 transition-colors relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Image src="/csr4.png" alt="Arena RC Car" fill className="object-contain p-4 scale-90 group-hover:scale-100 transition-transform duration-500" />
                    </div>
                </div>
            </Section>

            {/* 3. ABOUT COMPANY */}
            <Section id="about" className="text-center bg-gradient-to-b from-transparent via-transparent to-zinc-900/50">
                <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 border-r-4 border-yellow-500 pr-8">
                    <h2 className="text-3xl md:text-6xl font-black uppercase text-yellow-500 tracking-tighter">
                        Born on the Track
                    </h2>
                    <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light">
                        We don't just build RC cars. We build miniature adrenaline machines.
                        Our mission is to bring the professional motorsport experience to the palm of your hand.
                    </p>
                    <div className="inline-block border border-yellow-500/30 px-8 py-4 text-yellow-500 font-mono text-sm">
                        EST. 2026 // GLOBAL LEADER
                    </div>
                </div>
            </Section>

            {/* 4. ARENA / EVENTS */}
            <Section id="arena" className="bg-transparent text-left relative z-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Left Side: Title */}
                        <div className="md:w-1/3 text-left">
                            <h2 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter">
                                THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">ARENA</span>
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
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Left Side: Content */}
                        <div className="md:w-1/2 text-left space-y-8">
                            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
                                OUR <span className="text-yellow-500">STORY</span>
                            </h2>
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                                Founded in 2026, Turbo Shack began with a simple mission: to blur the line between toy and machine.
                                We engineer precision RC vehicles that deliver raw adrenaline, speed, and competitive spirit.
                                Whether you're a weekend basher or a pro racer, this is your home.
                            </p>
                            <div className="flex space-x-8 text-sm font-bold text-white uppercase tracking-widest mt-12">
                                <span className="hover:text-yellow-500 cursor-pointer transition-colors">Instagram</span>
                                <span className="hover:text-yellow-500 cursor-pointer transition-colors">YouTube</span>
                                <span className="hover:text-yellow-500 cursor-pointer transition-colors">Discord</span>
                            </div>
                            <p className="text-xs text-white/30 uppercase tracking-widest">© 2026 TURBO SHACK. ALL RIGHTS RESERVED.</p>
                        </div>

                        {/* Right Side: Image Grid */}
                        <div className="md:w-1/2 grid grid-cols-2 gap-4">
                            <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-white/10 hover:border-yellow-500 transition-colors">
                                <Image src="/csr5.png" alt="Workshop" width={400} height={300} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-white/10 hover:border-yellow-500 transition-colors translate-y-8">
                                <Image src="/csr6.png" alt="Racing" width={400} height={300} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-white/10 hover:border-yellow-500 transition-colors">
                                <Image src="/csr1.png" alt="Team" width={400} height={300} className="w-full h-full object-contain p-4 opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
}
