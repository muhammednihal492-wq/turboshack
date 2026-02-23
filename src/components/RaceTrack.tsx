'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CarVisual from './CarVisual';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const CAR_MODELS = [
    { id: 'offroad', color: '#ff0000', label: 'OFF-ROAD' },
    { id: 'race', color: '#06b6d4', label: 'RACE CAR' },
    { id: 'buggy', color: '#eab308', label: 'BUGGY' },
    { id: 'arena', color: '#d946ef', label: 'ARENA' },
    { id: 'construct', color: '#f97316', label: 'CONSTRUCT' },
    { id: 'f1', color: '#dc2626', label: 'FORMULA 1' },
];

export default function RaceTrack() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<SVGPathElement>(null);
    const carRef = useRef<HTMLDivElement>(null);
    const [currentModel, setCurrentModel] = useState(CAR_MODELS[0]);
    const [showFinale, setShowFinale] = useState(false);

    useGSAP(() => {
        const trackPath = trackRef.current;
        const car = carRef.current;

        if (!trackPath || !car) return;

        // --- MASTER TIMELINE (SCROLL SCRUBBED) ---
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5, // Slight smoothing for "heavy" feel
                invalidateOnRefresh: true, // Recalculate on resize
            }
        });

        // 1. CAR MOTION ALONG PATH
        // Fade in the car immediately as scroll starts
        tl.to(car, { opacity: 1, duration: 0.5 }, 0);

        // Simply allow the motion path to animate from start to finish
        tl.to(car, {
            motionPath: {
                path: trackPath,
                align: trackPath,
                autoRotate: 90,
                alignOrigin: [0.5, 0.5],
                start: 0.08,
                end: 1,
            },
            ease: "none",
            duration: 10 // Relative duration for the whole scrub
        });

        // JUMP SEQUENCE (at 45% of path)
        const jumpStart = 4.5;
        const jumpDuration = 1.0;

        tl.to(car, {
            scale: 1.5,
            ease: "power2.out",
            duration: jumpDuration / 2
        }, jumpStart)
            .to(car, {
                scale: 1,
                ease: "power2.in",
                duration: jumpDuration / 2
            }, jumpStart + jumpDuration / 2);

        // Landing Impact (Squash)
        tl.to(car, {
            scaleY: 0.8,
            scaleX: 1.2,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        }, jumpStart + jumpDuration);

        // 2. MODEL TRANSFORMATIONS (Scrubbed with Motion)
        // We insert callbacks or state changes at specific progress points
        // But for smoother morphing, we can use a "virtual" progress tween to drive React state?
        // Actually, ScrollTrigger's OnUpdate is better for state-swapping logic if discrete.

        // HOWEVER, to make it perfectly reversible without glitches, let's use the timeline to 
        // trigger state changes at exact points.

        // Defining checkpoints based on section rough percentages (Total 6 sections)
        // 0-16%: Offroad
        // 16-33%: Race
        // 33-50%: Buggy
        // 50-66%: Arena
        // 66-83%: Construct
        // 83-100%: F1 + Finale

        // 2. MODEL TRANSFORMATIONS (Scrubbed with Motion)
        // Use onUpdate to ensure correct model is set even when scrolling backwards
        let lastModelIndex = -1;

        tl.eventCallback("onUpdate", () => {
            const progress = tl.progress();
            // Calculate which model should be active based on progress (0 to 1)
            const index = Math.min(
                Math.floor(progress * CAR_MODELS.length),
                CAR_MODELS.length - 1
            );

            if (index !== lastModelIndex && index >= 0) {
                setCurrentModel(CAR_MODELS[index]);
                lastModelIndex = index;
            }
        });

        // 3. FINALE SEQUENCE (Scrubbed)
        // At 90% progress (approx 9s in our 10s timeline), start showing finale
        tl.call(() => setShowFinale(true), [], 9.5); // Enter finale
        tl.call(() => setShowFinale(false), [], 9.4); // Reverse out of finale slightly before

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="absolute top-0 right-0 w-[60%] md:w-1/2 h-full pointer-events-none z-10 overflow-visible">
            {/*
            3D TRANSFORMED TRACK CONTAINER
            We do NOT use fixed here. The track is part of the document flow (absolute).
            As the user scrolls, the Viewport moves down the track.
            The car moves along the path, effectively staying in the viewport.
        */}
            <div className="w-full h-full absolute top-0 left-0">
                <svg
                    className="w-full h-full absolute top-0 left-0"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 3800"
                    style={{ height: '100%', width: '100%' }}
                >
                    <defs>
                        {/* 3D Texture Gradients */}
                        {/* 3D Texture Gradients */}
                        <linearGradient id="trackGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#5d4037" /> {/* Dirt - Rough */}
                            <stop offset="10%" stopColor="#333" />    {/* Asphalt Start */}
                            <stop offset="100%" stopColor="#333" />   {/* Asphalt End (Uniform) */}
                        </linearGradient>

                        {/* Curb Pattern */}
                        <pattern id="curbPattern" width="4" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="2" height="20" fill="#cc0000" />
                            <rect x="2" width="2" height="20" fill="#fff" />
                        </pattern>
                    </defs>

                    {/*
                 LAYER 1: TRACK BASE & SHADOW
               */}
                    <path
                        d="M 50 -50
                    C 80 100, 80 200, 50 300
                    S 10 500, 50 600
                    S 90 800, 50 900
                    S 20 1100, 50 1250
                    S 80 1450, 50 1600
                    S 20 1800, 50 2000
                    S 80 2200, 50 2400
                    S 20 2600, 50 2800
                    S 80 3000, 50 3200
                    S 30 3400, 50 3600
                    S 60 3700, 50 3800"
                        fill="none"
                        stroke="#222"
                        vectorEffect="non-scaling-stroke"
                        className="translate-y-2 stroke-[100px] md:stroke-[200px]"
                    />

                    {/*
                 LAYER 2: CURBS
               */}
                    <path
                        d="M 50 -50
                    C 80 100, 80 200, 50 300
                    S 10 500, 50 600
                    S 90 800, 50 900
                    S 20 1100, 50 1250
                    S 80 1450, 50 1600
                    S 20 1800, 50 2000
                    S 80 2200, 50 2400
                    S 20 2600, 50 2800
                    S 80 3000, 50 3200
                    S 30 3400, 50 3600
                    S 60 3700, 50 3800"
                        fill="none"
                        stroke="url(#curbPattern)"
                        vectorEffect="non-scaling-stroke"
                        className="track-path stroke-[90px] md:stroke-[180px]"
                    />

                    {/*
                 LAYER 3: ASPHALT SURFACE
               */}
                    <path
                        ref={trackRef}
                        d="M 50 -50
                    C 80 100, 80 200, 50 300
                    S 10 500, 50 600
                    S 90 800, 50 900
                    S 20 1100, 50 1250
                    S 80 1450, 50 1600
                    S 20 1800, 50 2000
                    S 80 2200, 50 2400
                    S 20 2600, 50 2800
                    S 80 3000, 50 3200
                    S 30 3400, 50 3600
                    S 60 3700, 50 3800"
                        fill="none"
                        stroke="url(#trackGradient)"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="track-path stroke-[80px] md:stroke-[160px]"
                    />

                    {/*
                 LAYER 4: DETAILS
               */}
                    <path
                        d="M 50 -50
                    C 80 100, 80 200, 50 300
                    S 10 500, 50 600
                    S 90 800, 50 900
                    S 20 1100, 50 1250
                    S 80 1450, 50 1600
                    S 20 1800, 50 2000
                    S 80 2200, 50 2400
                    S 20 2600, 50 2800
                    S 80 3000, 50 3200
                    S 30 3400, 50 3600
                    S 60 3700, 50 3800"
                        fill="none"
                        stroke="#000"
                        strokeDasharray="20 40"
                        vectorEffect="non-scaling-stroke"
                        className="track-path opacity-30 stroke-[70px] md:stroke-[140px]"
                    />

                    {/* Center Line */}
                    <path
                        d="M 50 -50
                    C 80 100, 80 200, 50 300
                    S 10 500, 50 600
                    S 90 800, 50 900
                    S 20 1100, 50 1250
                    S 80 1450, 50 1600
                    S 20 1800, 50 2000
                    S 80 2200, 50 2400
                    S 20 2600, 50 2800
                    S 80 3000, 50 3200
                    S 30 3400, 50 3600
                    S 60 3700, 50 3800"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeDasharray="20 30"
                        vectorEffect="non-scaling-stroke"
                        className="track-path opacity-40"
                    />

                    {/* JUMP RAMP VISUALS */}
                    <g className="jump-ramp opacity-80">
                        {/* Ramp Gradient/Highlight */}
                        <path d="M 20 520 Q 50 530 80 520 L 80 600 Q 50 610 20 600 Z" fill="url(#curbPattern)" opacity="0.2" />

                        {/* Takeoff Arrows */}
                        <path d="M 35 540 L 50 530 L 65 540" stroke="#facc15" strokeWidth="3" fill="none" />
                        <path d="M 35 550 L 50 540 L 65 550" stroke="#facc15" strokeWidth="3" fill="none" />
                        <path d="M 35 560 L 50 550 L 65 560" stroke="#facc15" strokeWidth="3" fill="none" />

                        {/* Launch Label */}
                        <text x="50" y="590" textAnchor="middle" fill="#facc15" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="2">AIR TIME</text>
                    </g>
                </svg>
            </div>

            {/*
            THE CARS (Finale Lineup)
            We use the existing animated car until the end.
            At the finale, we hide the main car and show the lineup?
            Or we just use this container for the 'other' cars sliding in.
         */}
            <div className="absolute bottom-10 left-0 w-full z-50 flex justify-center items-end" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
            </div>

            {/*
            THE MAIN ACTIVE CAR
            Fades out when 'showFinale' is true.
         */}
            <div
                id="intro-car"
                ref={carRef}
                className={`absolute top-0 left-0 w-20 h-36 -ml-10 -mt-18 md:w-48 md:h-80 md:-ml-24 md:-mt-40 z-[9999] flex items-center justify-center transform-style-3d transition-opacity duration-500 pointer-events-none opacity-0 will-change-transform`}
                style={{ willChange: 'transform' }}
            >
                {/*
                CAR CONTAINER
                Tilt back slightly to match track perspective.
                Add shadow below to float it off the "ground".
            */}
                <div className="relative w-full h-full rotate-x-12">
                    <CarVisual type={currentModel.id === 'offroad' ? 'offroad' : currentModel.id} className="drop-shadow-xl" />

                    {/* Dynamic Dust/Smoke Particle Effects */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-40 h-20 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)] blur-xl opacity-0 animate-pulse mix-blend-screen -z-10 translate-y-4"></div>
                </div>
            </div>

            {/* FINALE LINEUP CONTAINER */}
            <div className={`fixed bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 z-50 flex items-end gap-1 md:gap-4 transition-all duration-1000 ${showFinale ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
                {CAR_MODELS.map((model, idx) => (
                    <div key={model.id} className="relative w-12 h-20 md:w-24 md:h-40" style={{ transform: 'scale(0.9)' }}>
                        <CarVisual type={model.id === 'offroad' ? 'offroad' : model.id} className="drop-shadow-2xl" />
                        {/* Name Label */}
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-white/50 whitespace-nowrap uppercase">{model.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
