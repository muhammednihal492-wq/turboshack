'use client';

import { motion } from 'framer-motion';

// Configuration definitions for each car type to drive the morphing
const CAR_CONFIGS = {
    offroad: {
        color: '#b91c1c',
        detail: '#7f1d1d',
        wheelFront: { w: 22, h: 36, r: 4, x: 38, y: 24 },
        wheelRear: { w: 22, h: 36, r: 4, x: 38, y: 156 },
        tireType: 'url(#dirtTread)',
        shockColor: '#ef4444', // Red springs
        bodyPath: "M30 18 L70 18 L80 40 L80 160 L70 185 L30 185 L20 160 L20 40 Z",
        cabinPath: "M35 60 L65 60 L70 90 L30 90 Z",
        spoiler: { opacity: 0, y: 180, w: 60, shape: "M40 180 L60 180 L60 185 L40 185 Z" },
        cage: { opacity: 0 },
        chassis: { w: 46, h: 160 },
        diff: { opacity: 1 },
    },
    race: {
        color: '#0369a1',
        detail: '#0c4a6e',
        wheelFront: { w: 18, h: 32, r: 2, x: 34, y: 28 },
        wheelRear: { w: 20, h: 34, r: 2, x: 34, y: 154 },
        tireType: 'url(#slickTread)',
        shockColor: '#0ea5e9', // Blue springs
        bodyPath: "M35 12 L65 12 L78 40 L78 152 L68 186 L32 186 L22 152 L22 40 Z",
        cabinPath: "M38 58 L62 58 L65 92 L35 92 Z",
        spoiler: { opacity: 1, y: 176, w: 72, shape: "M25 178 L75 178 L70 184 L30 184 Z" },
        cage: { opacity: 0 },
        chassis: { w: 40, h: 150 },
        diff: { opacity: 0 }, // Hidden by aero body
    },
    buggy: {
        color: '#854d0e',
        detail: '#422006',
        wheelFront: { w: 14, h: 32, r: 3, x: 42, y: 22 }, // Skinny
        wheelRear: { w: 26, h: 40, r: 5, x: 42, y: 150 }, // Fat
        tireType: 'url(#hybridTread)',
        shockColor: '#eab308', // Yellow springs
        bodyPath: "M42 25 L58 25 L65 55 L60 135 L65 165 L35 165 L40 135 L35 55 Z", // Narrow body
        cabinPath: "M45 65 L55 65 L58 95 L42 95 Z",
        spoiler: { opacity: 1, y: 160, w: 60, shape: "M30 162 L70 162 L65 170 L35 170 Z" },
        cage: { opacity: 1 },
        chassis: { w: 28, h: 140 }, // Extremely narrow chassis
        diff: { opacity: 1 }, // Fully exposed mechanics
    },
    arena: {
        color: '#701a75',
        detail: '#4a044e',
        wheelFront: { w: 22, h: 34, r: 3, x: 40, y: 26 },
        wheelRear: { w: 24, h: 36, r: 3, x: 40, y: 154 },
        tireType: 'url(#slickTread)',
        shockColor: '#d946ef',
        bodyPath: "M30 14 L70 14 L85 45 L80 155 L70 188 L30 188 L20 155 L15 45 Z", // Wide-body kit
        cabinPath: "M36 58 L64 58 L68 88 L32 88 Z",
        spoiler: { opacity: 1, y: 182, w: 84, shape: "M15 184 L85 184 L80 192 L20 192 Z" },
        cage: { opacity: 0 },
        chassis: { w: 48, h: 160 },
        diff: { opacity: 0 },
    },
    construct: {
        color: '#c2410c',
        detail: '#7c2d12',
        wheelFront: { w: 24, h: 38, r: 5, x: 38, y: 24 },
        wheelRear: { w: 24, h: 38, r: 5, x: 38, y: 156 },
        tireType: 'url(#heavyTread)',
        shockColor: '#171717', // Black industrial pistons
        bodyPath: "M25 15 L75 15 L80 40 L80 160 L75 185 L25 185 L20 160 L20 40 Z",
        cabinPath: "M30 48 L70 48 L70 78 L30 78 Z",
        spoiler: { opacity: 0, y: 180, w: 60, shape: "M40 180 L60 180 L60 185 L40 185 Z" },
        cage: { opacity: 0 },
        chassis: { w: 54, h: 165 }, // Massive chassis
        diff: { opacity: 1 },
    },
    f1: {
        color: '#991b1b',
        detail: '#450a0a',
        wheelFront: { w: 16, h: 30, r: 2, x: 40, y: 30 },
        wheelRear: { w: 24, h: 34, r: 2, x: 38, y: 154 },
        tireType: 'url(#slickTread)',
        shockColor: '#171717', // Internal/Hidden
        bodyPath: "M45 5 L55 5 L64 35 L68 95 L58 155 L55 190 L45 190 L42 155 L32 95 L36 35 Z",
        cabinPath: "M44 65 L56 65 L52 85 L48 85 Z", // Triangle cockpit
        spoiler: { opacity: 1, y: 184, w: 90, shape: "M10 182 L90 182 L85 192 L15 192 Z" }, // Huge wing
        cage: { opacity: 0 },
        chassis: { w: 24, h: 170 }, // Super slim carbon tub
        diff: { opacity: 0 },
    },
};

export default function CarVisual({ type = 'offroad', className = "" }: { type?: string, className?: string }) {
    const config = CAR_CONFIGS[type as keyof typeof CAR_CONFIGS] || CAR_CONFIGS.offroad;

    const transition = {
        type: "spring",
        stiffness: 70, // Snappier logic
        damping: 15,
        mass: 1
    } as const;

    return (
        <motion.svg
            viewBox="0 0 100 200"
            className={`w-full h-full ${className}`}
            style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.8))' }}
            initial={false}
            animate={config}
            transition={{ staggerChildren: 0.02 }}
        >
            <defs>
                {/* 1. TREAD PATTERNS (Macro Realism) */}
                <pattern id="dirtTread" width="4" height="4" patternUnits="userSpaceOnUse">
                    <rect width="4" height="4" fill="#18181b" />
                    {/* Knobby Tread Offset */}
                    <rect x="0" y="0" width="1.5" height="1.5" fill="#27272a" />
                    <rect x="2" y="2" width="1.5" height="1.5" fill="#27272a" />
                </pattern>
                <pattern id="hybridTread" width="4" height="2" patternUnits="userSpaceOnUse">
                    <rect width="4" height="2" fill="#18181b" />
                    <line x1="0" y1="1" x2="4" y2="1" stroke="#27272a" strokeWidth="0.5" />
                </pattern>
                <pattern id="heavyTread" width="8" height="6" patternUnits="userSpaceOnUse">
                    <rect width="8" height="6" fill="#171717" />
                    <path d="M0 2 L3 4 L0 6" stroke="#262626" strokeWidth="1" fill="none" />
                    <path d="M8 2 L5 4 L8 6" stroke="#262626" strokeWidth="1" fill="none" />
                </pattern>
                <linearGradient id="slickTread" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#111" />
                    <stop offset="20%" stopColor="#222" />
                    <stop offset="50%" stopColor="#2a2a2a" />
                    <stop offset="80%" stopColor="#222" />
                    <stop offset="100%" stopColor="#111" />
                </linearGradient>

                {/* 2. CHASSIS / METALLIC MATERIALS */}
                <pattern id="carbonFiber" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="4" height="4" fill="#09090b" />
                    <rect width="2" height="2" fill="#18181b" />
                    <rect x="2" y="2" width="2" height="2" fill="#18181b" />
                </pattern>
                <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#52525b" />
                    <stop offset="50%" stopColor="#a1a1aa" />
                    <stop offset="100%" stopColor="#3f3f46" />
                </linearGradient>

                {/* 3. SHOCK ABSORBER SPRING PATTERN */}
                <pattern id="shockSpring" width="4" height="3" patternUnits="userSpaceOnUse">
                    <rect width="4" height="3" fill="transparent" />
                    <path d="M0 1.5 Q 2 0, 4 1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                </pattern>

                {/* 4. PAINT JOB GRADIENT (PBR Style Specular) */}
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={config.detail} stopOpacity="0.9" />
                    <stop offset="15%" stopColor={config.color} />
                    <stop offset="35%" stopColor={config.color} />
                    <stop offset="55%" stopColor="#ffffff" stopOpacity="0.7" /> {/* Specular Ridge */}
                    <stop offset="75%" stopColor={config.color} />
                    <stop offset="100%" stopColor={config.detail} />
                </linearGradient>

                {/* 5. RIM HIGHLIGHT */}
                <radialGradient id="rimShine">
                    <stop offset="50%" stopColor="transparent" />
                    <stop offset="90%" stopColor="white" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>

            {/* --- 0. DYNAMIC GROUND SHADOW --- */}
            <motion.ellipse
                cx="50" cy="100"
                fill="black"
                filter="blur(10px)"
                animate={{
                    rx: type === 'f1' ? 35 : 50,
                    ry: type === 'f1' ? 95 : 90,
                    opacity: 0.7
                }}
                transition={transition}
            />

            {/* --- 1. SUSPENSION ARMS & DRIVE SHAFTS (Underneath) --- */}
            {[
                { wheel: config.wheelFront },
                { wheel: config.wheelRear }
            ].map((axle, idx) => (
                <motion.g key={`axle-${idx}`} stroke="#27272a" strokeWidth="2">
                    {/* Left Wishbone */}
                    <motion.line
                        x1="50" y1={axle.wheel.y + (axle.wheel.h / 2)}
                        animate={{ x2: 50 - axle.wheel.x, y2: axle.wheel.y + (axle.wheel.h / 2) }} transition={transition}
                    />
                    {/* Right Wishbone */}
                    <motion.line
                        x1="50" y1={axle.wheel.y + (axle.wheel.h / 2)}
                        animate={{ x2: 50 + axle.wheel.x, y2: axle.wheel.y + (axle.wheel.h / 2) }} transition={transition}
                    />
                    {/* Shock Absorbers (Diagonal) */}
                    <motion.g style={{ color: config.shockColor }}>
                        {/* L Shock */}
                        <motion.line x1="45" y1={axle.wheel.y + (axle.wheel.h / 2) - 8} animate={{ x2: 50 - axle.wheel.x + 4, y2: axle.wheel.y + (axle.wheel.h / 2) }} strokeWidth="3" stroke="currentColor" transition={transition} />
                        {/* R Shock */}
                        <motion.line x1="55" y1={axle.wheel.y + (axle.wheel.h / 2) - 8} animate={{ x2: 50 + axle.wheel.x - 4, y2: axle.wheel.y + (axle.wheel.h / 2) }} strokeWidth="3" stroke="currentColor" transition={transition} />
                        {/* Coil Overlay */}
                        <motion.line x1="45" y1={axle.wheel.y + (axle.wheel.h / 2) - 8} animate={{ x2: 50 - axle.wheel.x + 4, y2: axle.wheel.y + (axle.wheel.h / 2) }} strokeWidth="3" stroke="url(#shockSpring)" transition={transition} />
                        <motion.line x1="55" y1={axle.wheel.y + (axle.wheel.h / 2) - 8} animate={{ x2: 50 + axle.wheel.x - 4, y2: axle.wheel.y + (axle.wheel.h / 2) }} strokeWidth="3" stroke="url(#shockSpring)" transition={transition} />
                    </motion.g>
                </motion.g>
            ))}

            {/* --- 2. MAIN CHASSIS PLATE --- */}
            <motion.rect
                rx="4"
                fill="url(#carbonFiber)"
                stroke="#27272a"
                strokeWidth="1"
                animate={{
                    x: 50 - (config.chassis.w / 2),
                    y: 100 - (config.chassis.h / 2),
                    width: config.chassis.w,
                    height: config.chassis.h
                }}
                transition={transition}
            />

            {/* --- 3. EXPOSED MECHANICALS (Diffs, Motor, Heatsinks) --- */}
            <motion.g animate={{ opacity: config.diff.opacity }} transition={transition}>
                {/* Rear Diff Housing */}
                <motion.rect fill="url(#metalGradient)" rx="2" animate={{ x: 42, y: config.wheelRear.y + (config.wheelRear.h / 2) - 8, width: 16, height: 16 }} transition={transition} />
                <motion.circle fill="#18181b" cx="50" cy={config.wheelRear.y + (config.wheelRear.h / 2)} r="4" transition={transition} />

                {/* Front Diff Housing */}
                <motion.rect fill="url(#metalGradient)" rx="2" animate={{ x: 44, y: config.wheelFront.y + (config.wheelFront.h / 2) - 6, width: 12, height: 12 }} transition={transition} />

                {/* Center Drive Shaft */}
                <motion.rect fill="url(#metalGradient)" animate={{ x: 48.5, y: config.wheelFront.y + (config.wheelFront.h / 2) + 6, width: 3, height: (config.wheelRear.y - config.wheelFront.y) - 20 }} transition={transition} />

                {/* ESC / Battery Blocks */}
                <rect x="35" y="80" width="10" height="30" fill="#111" rx="1" />
                <rect x="55" y="80" width="12" height="40" fill="#111" rx="1" />
                <rect x="55" y="85" width="12" height="2" fill="#d4d4d8" />
                <rect x="55" y="90" width="12" height="2" fill="#d4d4d8" />
            </motion.g>

            {/* --- 4. WHEELS (Macroscopic Detail) --- */}
            {[
                { ...config.wheelFront, id: 'fl', x: 50 - config.wheelFront.x },
                { ...config.wheelFront, id: 'fr', x: 50 + config.wheelFront.x },
                { ...config.wheelRear, id: 'rl', x: 50 - config.wheelRear.x },
                { ...config.wheelRear, id: 'rr', x: 50 + config.wheelRear.x },
            ].map((wheel) => (
                <motion.g
                    key={wheel.id}
                    animate={{ x: wheel.x - wheel.w / 2, y: wheel.y }}
                    transition={transition}
                >
                    {/* Shadow Cast from body onto inner wheel */}
                    <motion.rect width={wheel.w} height={wheel.h} fill="rgba(0,0,0,0.5)" rx={wheel.r} animate={{ width: wheel.w, height: wheel.h, rx: wheel.r }} transition={transition} className="blur-[2px]" />

                    {/* TIRE (Rubber + Tread) */}
                    <motion.rect
                        width={wheel.w} height={wheel.h} rx={wheel.r}
                        fill={config.tireType}
                        stroke="#09090b" strokeWidth="1.5"
                        animate={{ width: wheel.w, height: wheel.h, rx: wheel.r, fill: config.tireType }}
                        transition={transition}
                    />

                    {/* RIM STRUCUTRE */}
                    <motion.rect
                        animate={{ x: (wheel.w - wheel.w * 0.6) / 2, y: (wheel.h - wheel.w * 0.6) / 2, width: wheel.w * 0.6, height: wheel.w * 0.6 }}
                        rx={2}
                        fill="url(#metalGradient)" stroke="#111" strokeWidth="0.5" transition={transition}
                    />

                    {/* HUB LUG NUT */}
                    <motion.circle animate={{ cx: wheel.w / 2, cy: wheel.h / 2 }} r="1.5" fill="#18181b" transition={transition} />

                    {/* SPECULAR RIM GLOW */}
                    <motion.rect animate={{ width: wheel.w, height: wheel.h, rx: wheel.r }} fill="url(#rimShine)" style={{ mixBlendMode: 'screen' }} transition={transition} />
                </motion.g>
            ))}

            {/* --- 5. BODY SHELL (Automotive Paint Job) --- */}
            <motion.path
                fill="url(#bodyGradient)"
                stroke="#171717"
                strokeWidth="1.5"
                animate={{ d: config.bodyPath }}
                transition={transition}
                style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.7))' }} // Body casting shadow on chassis
            />

            {/* Panel Gaps (Micro Realism) */}
            <motion.path
                d={config.bodyPath}
                fill="none"
                stroke="#000"
                strokeWidth="1"
                animate={{ d: config.bodyPath }}
                transition={transition}
                style={{ opacity: 0.5, transform: 'scale(0.98)', transformOrigin: 'center' }}
            />

            {/* --- 6. CABIN / POLYCARBONATE WINDOWS --- */}
            <motion.path
                fill="#09090b"
                stroke="#27272a"
                strokeWidth="1.5"
                animate={{ d: config.cabinPath }}
                transition={transition}
            />
            {/* Window Reflection Specular */}
            <motion.path
                fill="white"
                fillOpacity="0.1"
                animate={{ d: config.cabinPath }}
                transition={transition}
                transform="scale(0.85) translate(8, 4)"
            />

            {/* --- 7. EXTERNAL AERO / SPOILER --- */}
            <motion.g animate={{ opacity: config.spoiler.opacity, y: config.spoiler.y }} transition={transition}>
                {/* Metal Struts connecting wing to chassis */}
                <rect x="42" y="-12" width="2" height="15" fill="url(#metalGradient)" />
                <rect x="56" y="-12" width="2" height="15" fill="url(#metalGradient)" />

                {/* The Wing */}
                <motion.path
                    fill="url(#carbonFiber)"
                    stroke="#111" strokeWidth="1"
                    animate={{ d: config.spoiler.shape }}
                    transition={transition}
                    style={{ filter: 'drop-shadow(0px 6px 4px rgba(0,0,0,0.5))' }}
                />

                {/* Endplates */}
                <motion.rect animate={{ x: 50 - (config.spoiler.w / 2) - 2 }} y="-2" width="2" height="18" fill="url(#bodyGradient)" transition={transition} />
                <motion.rect animate={{ x: 50 + (config.spoiler.w / 2) }} y="-2" width="2" height="18" fill="url(#bodyGradient)" transition={transition} />
            </motion.g>

            {/* --- 8. ROLL CAGE (Exposed Metal Tubing) --- */}
            <motion.path
                d="M32 60 L68 60 L65 130 M35 130 L32 60"
                fill="none"
                stroke="url(#metalGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ opacity: config.cage.opacity }}
                transition={transition}
                style={{ filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.6))' }}
            />

            {/* Cross brace */}
            <motion.path
                d="M32 60 L65 130 M68 60 L35 130"
                fill="none"
                stroke="url(#metalGradient)"
                strokeWidth="2"
                animate={{ opacity: config.cage.opacity }}
                transition={transition}
            />

            {/* --- 9. MICRO DETAILS (Lights, Vents, Decals) --- */}
            {/* Headlights */}
            <motion.circle cx="35" cy="20" r="2.5" fill="#fef08a" animate={{ cx: type === 'f1' ? 47 : (type === 'construct' ? 30 : 35) }} transition={transition} />
            <motion.circle cx="65" cy="20" r="2.5" fill="#fef08a" animate={{ cx: type === 'f1' ? 53 : (type === 'construct' ? 70 : 65) }} transition={transition} />

            {/* Exhaust / Vents */}
            <motion.line x1="45" y1="180" x2="55" y2="180" stroke="#000" strokeWidth="1.5" animate={{ opacity: type === 'offroad' ? 1 : 0 }} transition={transition} />

            {/* Cooling Intakes */}
            <motion.rect x="35" y="45" width="8" height="3" fill="#000" rx="1" animate={{ opacity: type === 'race' || type === 'arena' ? 1 : 0 }} />
            <motion.rect x="57" y="45" width="8" height="3" fill="#000" rx="1" animate={{ opacity: type === 'race' || type === 'arena' ? 1 : 0 }} />
        </motion.svg>
    );
}
