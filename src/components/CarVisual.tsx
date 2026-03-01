'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Configuration definitions for each car type to drive the morphing
const CAR_CONFIGS = {
    offroad: {
        color: '#da291c', // Race Red - deeper, more premium
        detail: '#171717', // Neutral Dark
        wheelFront: { w: 38, h: 48, r: 10, x: 48, y: 20 }, // Wider, thicker, larger radius
        wheelRear: { w: 40, h: 48, r: 10, x: 48, y: 145 }, // Massive rear tires
        // Muscular, wide-body Trophy Truck
        bodyPath: "M25 10 L75 10 L90 35 L90 60 L80 70 L80 110 L90 120 L90 180 L75 195 L25 195 L10 180 L10 120 L20 110 L20 70 L10 60 L10 35 Z",
        cabinPath: "M32 50 L68 50 L65 85 L35 85 Z", // Streamlined cabin
        // bodyPath: "M25 10 L75 10 L90 35 L90 60 L80 70 L80 110 L90 120 L90 180 L75 195 L25 195 L10 180 L10 120 L20 110 L20 70 L10 60 L10 35 Z",
        // cabinPath: "M32 50 L68 50 L65 85 L35 85 Z", // Streamlined cabin
        spoiler: { opacity: 0, y: 180, w: 60 },
        grille: { opacity: 1, type: 'mesh' },
        cage: { opacity: 1 },
        suspension: { h: 14, y_front: 32, y_rear: 158, type: 'springs', color: '#a3a3a3' }, // Visible heavy springs
        spareTire: { opacity: 1, y: 135, scale: 1.2 }, // Prominent spare
        bumper: { opacity: 1, y: 5, w: 80, h: 12 }, // Wide Bullbar
        hideUnderbody: true,
        stripes: true, // Add racing stripes for detail
        image: '/csr1.png',
        imageScale: 1.0,
    },
    race: {
        color: '#06b6d4',
        detail: '#155e75',
        wheelFront: { w: 18, h: 30, r: 2, x: 32, y: 25 },
        wheelRear: { w: 20, h: 32, r: 2, x: 32, y: 148 },
        bodyPath: "M35 10 L65 10 L80 40 L80 150 L70 185 L30 185 L20 150 L20 40 Z",
        cabinPath: "M38 55 L62 55 L65 90 L35 90 Z",
        spoiler: { opacity: 1, y: 175, w: 70 },
        grille: { opacity: 0, type: 'none' },
        cage: { opacity: 0 },
        suspension: { h: 4, y_front: 35, y_rear: 155, type: 'arms', color: '#555' },
        spareTire: { opacity: 0, y: 135, scale: 0.5 },
        bumper: { opacity: 0, y: 5, w: 10, h: 5 },
        hideUnderbody: false,
        stripes: false,
        image: '/csr2.png',
        imageScale: 1.0,
    },
    buggy: {
        color: '#eab308',
        detail: '#a16207',
        wheelFront: { w: 12, h: 30, r: 15, x: 38, y: 15 },
        wheelRear: { w: 26, h: 38, r: 8, x: 38, y: 140 },
        bodyPath: "M40 20 L60 20 L70 50 L65 140 L70 170 L30 170 L35 140 L30 50 Z",
        cabinPath: "M42 60 L58 60 L60 90 L40 90 Z",
        spoiler: { opacity: 1, y: 165, w: 50 },
        grille: { opacity: 0, type: 'none' },
        cage: { opacity: 1 },
        suspension: { h: 12, y_front: 30, y_rear: 150, type: 'springs', color: '#333' },
        spareTire: { opacity: 1, y: 120, scale: 0.8 },
        bumper: { opacity: 0.5, y: 10, w: 40, h: 5 },
        hideUnderbody: false,
        stripes: false,
        image: '/csr3.png',
        imageScale: 1.0,
    },
    arena: {
        color: '#d946ef',
        detail: '#86198f',
        wheelFront: { w: 20, h: 32, r: 4, x: 36, y: 22 },
        wheelRear: { w: 20, h: 32, r: 4, x: 36, y: 146 },
        bodyPath: "M32 12 L68 12 L85 45 L80 155 L70 185 L30 185 L20 155 L15 45 Z",
        cabinPath: "M36 55 L64 55 L68 85 L32 85 Z",
        spoiler: { opacity: 1, y: 180, w: 80 },
        grille: { opacity: 0.5, type: 'mesh' },
        cage: { opacity: 0 },
        suspension: { h: 3, y_front: 38, y_rear: 152, type: 'arms', color: '#555' },
        spareTire: { opacity: 0, y: 135, scale: 0.5 },
        bumper: { opacity: 0.8, y: 10, w: 70, h: 5 },
        hideUnderbody: false,
        stripes: false,
        image: '/csr4.png',
        imageScale: 1.0,
    },
    construct: {
        color: '#f97316',
        detail: '#c2410c',
        wheelFront: { w: 22, h: 34, r: 4, x: 35, y: 20 },
        wheelRear: { w: 22, h: 34, r: 4, x: 35, y: 145 },
        bodyPath: "M25 15 L75 15 L80 40 L80 160 L75 185 L25 185 L20 160 L20 40 Z",
        cabinPath: "M30 45 L70 45 L70 75 L30 75 Z",
        spoiler: { opacity: 0, y: 180, w: 60 },
        grille: { opacity: 1, type: 'bars' },
        cage: { opacity: 0 },
        suspension: { h: 6, y_front: 32, y_rear: 158, type: 'arms', color: '#555' },
        spareTire: { opacity: 0, y: 135, scale: 0.5 },
        bumper: { opacity: 1, y: 10, w: 60, h: 12 },
        hideUnderbody: false,
        stripes: false,
        image: '/csr5.png',
        imageScale: 1.0,
    },
    f1: {
        color: '#dc2626',
        detail: '#7f1d1d',
        wheelFront: { w: 14, h: 28, r: 2, x: 38, y: 25 },
        wheelRear: { w: 20, h: 32, r: 2, x: 38, y: 145 },
        bodyPath: "M45 5 L55 5 L65 40 L70 100 L60 160 L55 190 L45 190 L40 160 L30 100 L35 40 Z",
        cabinPath: "M42 60 L58 60 L50 80 Z",
        spoiler: { opacity: 1, y: 185, w: 90 },
        grille: { opacity: 0, type: 'none' },
        cage: { opacity: 0 },
        suspension: { h: 20, y_front: 30, y_rear: 150, type: 'arms', color: '#555' },
        spareTire: { opacity: 0, y: 135, scale: 0.5 },
        bumper: { opacity: 1, y: 0, w: 50, h: 5 },
        hideUnderbody: false,
        stripes: false,
        image: '/csr6.png',
        imageScale: 1.0,
    },
};

export default function CarVisual({ type = 'offroad', className = "" }: { type?: string, className?: string }) {
    // Get target config or fallback
    const config = CAR_CONFIGS[type as keyof typeof CAR_CONFIGS] || CAR_CONFIGS.offroad;

    // Transition settings for mechanical feel
    const transition = {
        type: "spring",
        stiffness: 60,
        damping: 15,
        mass: 1
    } as const;

    return (
        <motion.svg
            viewBox="0 0 100 200"
            className={`w-full h-full ${className}`}
            initial={false}
            animate={config}
            transition={{
                staggerChildren: 0.05
            }}
        >
            <defs>
                {/* 1. CARBON FIBER TEXTURE */}
                <pattern id="carbonFiber" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="4" height="4" fill="#18181b" />
                    <rect width="2" height="2" fill="#27272a" />
                    <rect x="2" y="2" width="2" height="2" fill="#27272a" />
                </pattern>

                {/* 2. DIRT TEXTURE (New) */}
                <pattern id="dirtPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fillOpacity="0" />
                    <circle cx="2" cy="5" r="1.5" fill="#5d4037" fillOpacity="0.3" />
                    <circle cx="12" cy="15" r="1" fill="#5d4037" fillOpacity="0.3" />
                    <circle cx="18" cy="2" r="1.5" fill="#3e2723" fillOpacity="0.3" />
                    <circle cx="8" cy="18" r="1" fill="#3e2723" fillOpacity="0.3" />
                </pattern>

                {/* 3. BODY METALLIC GRADIENT */}
                <linearGradient id={`${type}_bodyGradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={config.color} stopOpacity="0.9" />
                    <stop offset="20%" stopColor={config.detail} stopOpacity="0.6" /> {/* Shadow side */}
                    <stop offset="40%" stopColor={config.color} />
                    <stop offset="60%" stopColor="#ffffff" stopOpacity="0.5" /> {/* Highlight */}
                    <stop offset="80%" stopColor={config.color} />
                    <stop offset="100%" stopColor={config.detail} />
                </linearGradient>

                {/* 4. TIRE TREAD (Chunky Offroad) */}
                <pattern id="tireTread" width="6" height="4" patternUnits="userSpaceOnUse">
                    <rect width="6" height="4" fill="#18181b" />
                    <path d="M0 2 L6 2" stroke="#27272a" strokeWidth="1" />
                    <path d="M1 0 L3 4 M4 0 L6 4" stroke="#27272a" strokeWidth="1.5" />
                </pattern>

                {/* 4. BRAKE DISC */}
                <radialGradient id="brakeDisc">
                    <stop offset="80%" stopColor="#d4d4d8" />
                    <stop offset="90%" stopColor="#52525b" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>

                {/* 5. RIM SHINE */}
                <radialGradient id="rimShine">
                    <stop offset="60%" stopColor="transparent" />
                    <stop offset="90%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>

            {/* --- GROUND SHADOW --- */}
            <motion.ellipse
                cx="50" cy="100"
                fill="black"
                filter="blur(8px)"
                animate={{
                    rx: type === 'f1' ? 30 : 50,
                    ry: type === 'f1' ? 95 : 90,
                    opacity: 0.6
                }}
                transition={transition}
            />

            {/* --- RASTER IMAGE REPLACEMENT --- */}
            {config.image ? (
                <image
                    href={config.image}
                    x="0"
                    y="0"
                    width="100"
                    height="200"
                    preserveAspectRatio="xMidYMid meet"
                    transform={`scale(${config.imageScale || 1}) rotate(${(config as any).imageRotation || 0})`}
                    style={{ transformOrigin: '50px 100px' }}
                />
            ) : (
                <>
                    {/* --- CHASSIS & SUSPENSION --- */}
                    {/* --- WHEELS --- */}
                    {(!config.hideUnderbody) && [
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
                            {/* Tire */}
                            <motion.rect
                                width={wheel.w}
                                height={wheel.h}
                                rx={wheel.r}
                                fill="url(#tireTread)"
                                stroke="#09090b"
                                strokeWidth="1.5"
                                animate={{ width: wheel.w, height: wheel.h, rx: wheel.r }}
                                transition={transition}
                            />

                            {/* Brake Disc (Visible behind rim) */}
                            <motion.circle
                                cx={wheel.w / 2} cy={wheel.h / 2} r={wheel.w * 0.4}
                                fill="url(#brakeDisc)"
                                opacity={0.8}
                            />

                            {/* Rim */}
                            <motion.rect
                                x={(wheel.w - wheel.w * 0.6) / 2}
                                y={(wheel.h - wheel.w * 0.6) / 2}
                                width={wheel.w * 0.6}
                                height={wheel.w * 0.6}
                                rx={2}
                                fill="#52525b"
                                stroke="#d4d4d8"
                                strokeWidth="1"
                            />

                            {/* Lug Nuts */}
                            <motion.circle cx={wheel.w / 2 - 2} cy={wheel.h / 2 - 2} r={1} fill="#18181b" />
                            <motion.circle cx={wheel.w / 2 + 2} cy={wheel.h / 2 - 2} r={1} fill="#18181b" />
                            <motion.circle cx={wheel.w / 2 - 2} cy={wheel.h / 2 + 2} r={1} fill="#18181b" />
                            <motion.circle cx={wheel.w / 2 + 2} cy={wheel.h / 2 + 2} r={1} fill="#18181b" />

                            {/* Rim Shine Overlay */}
                            <motion.rect x={0} y={0} width={wheel.w} height={wheel.h} fill="url(#rimShine)" rx={wheel.r} style={{ mixBlendMode: 'overlay' }} />
                        </motion.g>
                    ))}

                    {/* --- SUSPENSION ARMS (Bottom Layer) --- */}
                    {(!config.hideUnderbody) && (
                        <>
                            <motion.path
                                // Connect center chassis to front wheels
                                d={`M 40 40 L ${50 - config.wheelFront.x + 10} ${config.wheelFront.y + 15}`}
                                stroke={config.suspension.color} strokeWidth={config.suspension.type === 'springs' ? 6 : 4}
                                strokeLinecap="round"
                                strokeDasharray={config.suspension.type === 'springs' ? "2 2" : "none"}
                                animate={{
                                    d: `M 40 40 L ${50 - config.wheelFront.x + 10} ${config.wheelFront.y + 15}`,
                                    stroke: config.suspension.color,
                                    strokeDasharray: config.suspension.type === 'springs' ? "2 2" : "none 9999"
                                }}
                                transition={transition}
                            />
                            <motion.path
                                d={`M 60 40 L ${50 + config.wheelFront.x - 10} ${config.wheelFront.y + 15}`}
                                stroke={config.suspension.color} strokeWidth={config.suspension.type === 'springs' ? 6 : 4}
                                strokeLinecap="round"
                                strokeDasharray={config.suspension.type === 'springs' ? "2 2" : "none"}
                                animate={{
                                    d: `M 60 40 L ${50 + config.wheelFront.x - 10} ${config.wheelFront.y + 15}`,
                                    stroke: config.suspension.color,
                                    strokeDasharray: config.suspension.type === 'springs' ? "2 2" : "none 9999"
                                }}
                                transition={transition}
                            />
                            {/* Rear Suspension */}
                            <motion.path
                                d={`M 40 160 L ${50 - config.wheelRear.x + 10} ${config.wheelRear.y + 15}`}
                                stroke={config.suspension.color} strokeWidth={config.suspension.type === 'springs' ? 6 : 4}
                                strokeLinecap="round"
                                strokeDasharray={config.suspension.type === 'springs' ? "2 2" : "none"}
                                animate={{
                                    d: `M 40 160 L ${50 - config.wheelRear.x + 10} ${config.wheelRear.y + 15}`,
                                    stroke: config.suspension.color,
                                    strokeDasharray: config.suspension.type === 'springs' ? "2 2" : "none 9999"
                                }}
                                transition={transition}
                            />
                            <motion.path
                                d={`M 60 160 L ${50 + config.wheelRear.x - 10} ${config.wheelRear.y + 15}`}
                                stroke={config.suspension.color} strokeWidth={config.suspension.type === 'springs' ? 6 : 4}
                                strokeLinecap="round"
                                strokeDasharray={config.suspension.type === 'springs' ? "2 2" : "none"}
                                animate={{
                                    d: `M 60 160 L ${50 + config.wheelRear.x - 10} ${config.wheelRear.y + 15}`,
                                    stroke: config.suspension.color,
                                    strokeDasharray: config.suspension.type === 'springs' ? "2 2" : "none 9999"
                                }}
                                transition={transition}
                            />
                        </>
                    )}


                    {/* --- CHASSIS (Carbon Fiber Underbody) --- */}
                    {(!config.hideUnderbody) && (
                        <motion.path
                            d="M40 30 L60 30 L65 160 L35 160 Z"
                            fill="url(#carbonFiber)"
                            stroke="#18181b"
                            strokeWidth="1"
                            animate={{ d: type === 'f1' ? "M42 20 L58 20 L55 180 L45 180 Z" : "M40 30 L60 30 L65 160 L35 160 Z" }}
                            transition={transition}
                        />
                    )}

                    {/* --- MAIN BODY SHELL --- */}
                    <defs>
                        <clipPath id={`bodyClip_${type}`}>
                            <path d={config.bodyPath} />
                        </clipPath>
                    </defs>
                    <motion.path
                        fill={`url(#${type}_bodyGradient)`}
                        stroke={config.detail}
                        strokeWidth="1"
                        animate={{
                            d: config.bodyPath,
                            fill: `url(#${type}_bodyGradient)`,
                            stroke: config.detail
                        }}
                        transition={transition}
                        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
                    />

                    {/* --- RACING STRIPES (New) --- */}
                    {config.stripes && (
                        <g clipPath={`url(#bodyClip_${type})`}>
                            <motion.rect x="42" y="0" width="6" height="200" fill="white" opacity="0.9" />
                            <motion.rect x="52" y="0" width="6" height="200" fill="white" opacity="0.9" />
                        </g>
                    )}

                    {/* --- RACING STRIPES / DECALS --- */}
                    <motion.path
                        d={config.bodyPath}
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="0 200" // Just a line down middle?
                        animate={{ d: config.bodyPath }}
                        transition={transition}
                        style={{ mixBlendMode: 'overlay', opacity: 0.3 }}
                    />

                    {/* --- CABIN / WINDSHIELD --- */}
                    <motion.path
                        fill="#09090b"
                        stroke="#27272a"
                        strokeWidth="0.5"
                        animate={{ d: config.cabinPath }}
                        transition={transition}
                    />
                    {/* Glint on Glass */}
                    <motion.path
                        fill="white"
                        fillOpacity="0.1"
                        animate={{ d: config.cabinPath }}
                        transition={transition}
                        transform="scale(0.9) translate(5, 5)"
                        style={{ mixBlendMode: 'screen' }}
                    />

                    {/* --- SPOILER (With Struts) --- */}
                    <motion.g
                        animate={{
                            opacity: config.spoiler.opacity,
                            y: config.spoiler.y
                        }}
                        transition={transition}
                    >
                        {/* Struts */}
                        <rect x="38" y="-5" width="2" height="15" fill="#333" />
                        <rect x="60" y="-5" width="2" height="15" fill="#333" />

                        {/* Wing */}
                        <rect
                            x={50 - config.spoiler.w / 2}
                            y={0}
                            width={config.spoiler.w}
                            height="14"
                            fill="url(#carbonFiber)"
                            rx="4"
                            stroke="#111"
                            strokeWidth="1"
                        />
                        {/* Endplates */}
                        <rect x={50 - config.spoiler.w / 2} y="-2" width="2" height="18" fill={config.detail} />
                        <rect x={50 + config.spoiler.w / 2 - 2} y="-2" width="2" height="18" fill={config.detail} />
                    </motion.g>

                    {/* --- SPARE TIRE (Trophy Truck / Buggy) --- */}
                    <motion.g
                        animate={{
                            opacity: config.spareTire ? config.spareTire.opacity : 0,
                            y: config.spareTire ? config.spareTire.y : 135,
                            scale: config.spareTire ? config.spareTire.scale : 0.5
                        }}
                        transition={transition}
                    >
                        <circle cx="50" cy="0" r="14" fill="url(#tireTread)" stroke="#111" strokeWidth="2" />
                        <circle cx="50" cy="0" r="6" fill="#333" stroke="#555" strokeWidth="1" />
                        <circle cx="50" cy="0" r="2" fill="#111" />
                        {/* Straps */}
                        <path d="M40 -10 L60 10" stroke="#000" strokeWidth="2" opacity="0.6" />
                        <path d="M60 -10 L40 10" stroke="#000" strokeWidth="2" opacity="0.6" />
                    </motion.g>

                    {/* --- ROLL CAGE (Buggy) --- */}
                    <motion.path
                        d="M35 60 L35 120 L65 120 L65 60"
                        fill="none"
                        stroke="#d4d4d8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity={0} // Default hidden
                        animate={{
                            opacity: config.cage.opacity,
                            d: type === 'buggy' ? "M32 60 L32 130 L68 130 L68 60" : "M35 60 L35 120 L65 120 L65 60"
                        }}
                        transition={transition}
                    />

                    {/* --- DETAILS (Grille, Lights) --- */}
                    {/* Grille Mesh */}
                    {config.grille.type !== 'none' && (
                        <motion.rect
                            x="35" y={config.bodyPath.includes('M30 15') ? 15 : 60}
                            width="30" height="6"
                            fill="url(#carbonFiber)"
                            opacity={0.8}
                            rx="1"
                        />
                    )}

                    {/* --- FRONT BUMPER (New) --- */}
                    <motion.rect
                        animate={{
                            opacity: config.bumper ? config.bumper.opacity : 0,
                            x: 50 - (config.bumper ? config.bumper.w / 2 : 0),
                            y: config.bumper ? config.bumper.y : 0,
                            width: config.bumper ? config.bumper.w : 0,
                            height: config.bumper ? config.bumper.h : 0,
                        }}
                        transition={transition}
                        fill="#111"
                        rx="2"
                    />
                    {/* Bumper bars detail */}
                    {config.bumper && config.bumper.opacity > 0 && (
                        <motion.path
                            d={`M ${50 - config.bumper.w / 2 + 5} ${config.bumper.y + 2} L ${50 + config.bumper.w / 2 - 5} ${config.bumper.y + 2}`}
                            stroke="#333" strokeWidth="1" opacity={0.5}
                        />
                    )}

                    {/* Headlights (Projector Style) */}
                    <motion.g animate={{ y: config.bodyPath.includes('M30 15') ? 0 : 5 }}>
                        <circle cx="35" cy="20" r="4" fill="#333" />
                        <circle cx="65" cy="20" r="4" fill="#333" />
                        <motion.circle cx="35" cy="20" r="2.5" fill="#fff" filter="blur(1px)" animate={{ opacity: 0.9 }} />
                        <motion.circle cx="65" cy="20" r="2.5" fill="#fff" filter="blur(1px)" animate={{ opacity: 0.9 }} />
                    </motion.g>

                    {/* Ventilation Vents on Hood */}
                    <motion.path d="M40 30 L60 30" stroke="black" strokeWidth="2" strokeOpacity="0.2" />
                </>
            )}

        </motion.svg>
    );
}
