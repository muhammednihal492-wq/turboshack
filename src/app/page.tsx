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
        const track = trackRef.current;

        if (!video || !logo || !nav || !track) return;

        // --- 1. INITIAL STATE ---
        // Lock Scroll
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        // Video: Paused, Hidden
        video.pause();
        video.currentTime = 0;
        gsap.set(video, { opacity: 0 });

        // Track: Hidden
        gsap.set(track, { opacity: 0 });

        // Navbar: Hidden, slightly moved up
        gsap.set(nav, { y: -20, opacity: 0 });

        // Logo: Centered, Scaled Up (2.5x), Invisible start
        gsap.set(logo, {
            top: '50%',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            scale: 0.8, // Start slightly smaller for the "fade in + scale up" effect
            opacity: 0,
            position: 'fixed'
        });

        // --- MASTER TIMELINE ---
        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                // 5. FINAL STATE: Unlock Scroll
                document.body.style.overflow = '';
            }
        });

        // Step 1: Logo Fade In & Scale (Intro State)
        tl.to(logo, {
            opacity: 1,
            scale: 2.5,
            duration: 1.5,
            ease: "power2.out"
        });

        // Step 2: Hold (Logo Presence)
        tl.to({}, { duration: 1.5 });

        // Step 3: Logo Move to Navbar & Visuals Reveal
        const moveTime = 1.5;

        // 3a. Move Logo to top-left (match final CSS position: top-4/8, left-4/8)
        // We animate to: top: 0, left: 0 (relative to its fixed container), but simpler to just animate to pixels.
        // The final CSS is "top-0 left-4 md:left-8". Let's approximate or use specific values.
        // Actually, we can just animate top/left.
        tl.to(logo, {
            top: '2rem', // Approx top-8
            left: '2rem', // Approx left-8
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: moveTime,
            ease: "power4.inOut"
        }, "reveal");

        // 3b. Reveal Visuals (Video, Track, Navbar) synchronized with Logo Move? 
        // Prompt says: "Only after the logo finishes its movement... or reveals main visuals"
        // Prompt Re-read: "3. Only after the logo finishes its movement, begin revealing the homepage visuals." -> Okay, sequential.

        // So we wait for the logo move to finish (or mostly finish) before revealing the rest.
        // Let's overlap slightly for smoothness, or follow strict "after".
        // "Only after the logo FINISHES its movement" -> Strict sequence.

        tl.addLabel("visualsStart");

        // Reveal Video (Cross-fade from black)
        tl.to(video, {
            opacity: 1,
            duration: 2.0,
            onStart: () => {
                video.play().catch(() => { });
            }
        }, "visualsStart");

        // Reveal Track (Fade in)
        tl.to(track, {
            opacity: 1,
            duration: 1.5
        }, "visualsStart+=0.5"); // Slightly delayed from video start

        // Reveal Navbar (Slide down)
        tl.to(nav, {
            y: 0,
            opacity: 1,
            duration: 1.0
        }, "visualsStart+=0.2");

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
            <Section id="arena" className="bg-transparent text-left">
                <div className="container mx-auto px-4 md:px-6 flex flex-col items-end text-right">
                    <h2 className="text-4xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 mb-8 opacity-20">
                        THE ARENA
                    </h2>
                    <div className="bg-black/80 border border-white/10 p-8 max-w-xl w-full backdrop-blur-md">
                        <h3 className="text-2xl font-bold text-white mb-4 border-b border-white/20 pb-4">Upcoming Battles</h3>
                        <ul className="space-y-4 font-mono text-sm text-white/60">
                            <li className="flex justify-between items-center group cursor-pointer">
                                <span className="group-hover:text-white transition-colors">MONSTER JAM REGIONAL</span>
                                <span className="text-red-500 font-bold">FEB 28</span>
                            </li>
                            <li className="flex justify-between items-center group cursor-pointer">
                                <span className="group-hover:text-white transition-colors">TOURING CAR CHAMPIONSHIP</span>
                                <span className="text-red-500 font-bold">MAR 15</span>
                            </li>
                            <li className="flex justify-between items-center group cursor-pointer">
                                <span className="group-hover:text-white transition-colors">BUGGY BASH 2026</span>
                                <span className="text-red-500 font-bold">APR 02</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* 5. UPCOMING */}
            <Section id="upcoming" className="bg-transparent relative">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#111_10px,#111_20px)] opacity-20"></div>
                <div className="relative z-10 text-center">
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                        NEXT <span className="text-yellow-400">GEN</span>
                    </h2>
                    <div className="flex justify-center gap-8 flex-wrap">
                        <div className="w-64 h-40 bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center relative overflow-hidden group hover:border-yellow-400 transition-colors cursor-pointer">
                            <span className="absolute inset-0 bg-black/80 flex items-center justify-center font-bold text-xl tracking-widest z-10 text-white group-hover:text-yellow-400 transition-colors">CLASSIFIED</span>
                            <div className="blur-xl opacity-50 group-hover:opacity-75 transition-opacity bg-yellow-400 w-full h-full"></div>
                        </div>
                        <div className="w-64 h-40 bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center relative overflow-hidden group hidden md:flex hover:border-red-400 transition-colors cursor-pointer">
                            <span className="absolute inset-0 bg-black/80 flex items-center justify-center font-bold text-xl tracking-widest z-10 text-white group-hover:text-red-400 transition-colors">TOP SECRET</span>
                            <div className="blur-xl opacity-50 group-hover:opacity-75 transition-opacity bg-red-400 w-full h-full"></div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 6. CONTACT (Finish Line) */}
            <Section id="contact" className="bg-gradient-to-t from-red-900/10 to-transparent pb-96">
                <div className="text-center max-w-2xl mx-auto space-y-12 px-4">
                    <h2 className="text-3xl md:text-6xl font-black text-white mb-4">
                        START YOUR ENGINE
                    </h2>
                    <form className="space-y-4 text-left">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="NAME" className="bg-white/5 border border-white/10 p-4 text-white placeholder-white/30 focus:border-red-600 outline-none transition-colors rounded-none" />
                            <input type="email" placeholder="EMAIL" className="bg-white/5 border border-white/10 p-4 text-white placeholder-white/30 focus:border-red-600 outline-none transition-colors rounded-none" />
                        </div>
                        <textarea placeholder="MESSAGE" rows={4} className="w-full bg-white/5 border border-white/10 p-4 text-white placeholder-white/30 focus:border-red-600 outline-none transition-colors rounded-none"></textarea>
                        <button className="w-full bg-red-600 text-white font-black tracking-widest py-4 hover:bg-red-700 transition-colors uppercase border border-red-600 hover:border-white">
                            Cross the Finish Line
                        </button>
                    </form>

                    <div className="pt-20 border-t border-white/10 flex flex-col items-center gap-8 text-xs text-white/40 uppercase tracking-widest">
                        <div className="flex space-x-8 text-sm font-bold text-white">
                            <span className="hover:text-red-500 cursor-pointer transition-colors">Instagram</span>
                            <span className="hover:text-red-500 cursor-pointer transition-colors">YouTube</span>
                            <span className="hover:text-red-500 cursor-pointer transition-colors">Discord</span>
                        </div>
                        <span>© 2026 RC Performance</span>
                    </div>
                </div>
            </Section>
        </main>
    );
}
