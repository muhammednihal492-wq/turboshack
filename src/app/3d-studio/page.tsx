'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- DATA ---
const HERO_SLIDES = [
    { title: "Custom Toy", subtitle: "Turn your imagination into real 3D printed products.", icon: "🧢🤖" },
    { title: "Mini Me", subtitle: "Turn your photo into a mini 3D printed figurine.", icon: "🧍‍♂️" },
    { title: "Personalized Keychain", subtitle: "Create personalized 3D printed keychains.", icon: "🔗" },
    { title: "Industrial 3D Part", subtitle: "Custom 3D printed mechanical and industrial components.", icon: "⚙️" },
];

const CONCEPTS = [
    { title: "Industrial Products", desc: "Custom 3D printed mechanical and industrial components.", icon: "⚙️" },
    { title: "Mini Me", desc: "Turn your photo into a mini 3D printed figurine.", icon: "🧍‍♂️" },
    { title: "Keychain", desc: "Create personalized 3D printed keychains.", icon: "🔗" },
    { title: "Image to 3D", desc: "Upload your image and convert it into a 3D printable model.", icon: "🖼️➡️🧊" },
];

export default function ThreeDStudio() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-play the concepts slider so they are visible one after the other
    useEffect(() => {
        const slideTimer = setInterval(() => {
            setDirection(1);
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 3000);
        return () => clearInterval(slideTimer);
    }, [currentSlide]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    };

    const slideVariants: any = {
        enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
        exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 100 : -100, opacity: 0, transition: { duration: 0.8, ease: "easeIn" } })
    };

    const fadeInUp: any = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <main className="min-h-screen bg-[#fafafa] text-slate-800 font-sans selection:bg-cyan-200 overflow-x-hidden relative">
            
            {/* 1. STICKY NAVIGATION BAR */}
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${isScrolled ? 'bg-white/95 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                <span className="text-white text-xs font-black tracking-widest pl-1">3D</span>
                            </div>
                            <span className="font-extrabold tracking-[0.2em] text-slate-900 text-xl uppercase">Trixyz</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex gap-10 text-xs font-black tracking-widest uppercase text-slate-500">
                        {['Home', 'Customize', 'Products', 'About Us', 'Reach Us', 'Contact'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="relative group hover:text-cyan-600 transition-colors">
                                {item}
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Hamburger */}
                    <button className="lg:hidden p-2 text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>
                
                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-full left-0 w-full bg-white shadow-xl lg:hidden overflow-hidden flex flex-col"
                        >
                            {['Home', 'Customize', 'Products', 'About Us', 'Reach Us', 'Contact'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="px-8 py-5 border-b border-slate-100 font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-cyan-600" onClick={() => setIsMenuOpen(false)}>
                                    {item}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* 2. HERO SECTION */}
            <section id="home" className="relative w-full min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fafafa] to-slate-100">
                {/* Background Decor Elements */}
                <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-200/40 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] bg-[length:40px_40px] opacity-50" />
                
                <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide + 'text'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-10 md:mb-16 max-w-3xl"
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-3 md:mb-6 leading-tight px-2">
                                {currentSlide === 0 ? "Customize Your Toy" : HERO_SLIDES[currentSlide].title}
                            </h1>
                            <p className="text-base sm:text-lg md:text-2xl text-slate-500 font-medium px-4 md:px-0">
                                {HERO_SLIDES[currentSlide].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Slider Canvas */}
                    <div className="relative w-full flex items-center justify-center md:gap-16 mt-4 md:mt-8 z-20">
                        {/* Prev Btn */}
                        <motion.button onClick={prevSlide} whileHover={{ x: -10, scale: 1.1 }} whileTap={{ scale: 0.9 }} className="shrink-0 w-12 h-12 md:w-20 md:h-20 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-400 hover:text-cyan-500 border border-slate-100 transition-all z-20 absolute left-0 md:relative md:left-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        </motion.button>

                        {/* Interactive 3D Model Placeholder */}
                        <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[500px] md:h-[500px] flex items-center justify-center perspective-1000 shrink-0">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0 flex items-center justify-center preserve-3d"
                                >
                                    {/* 3D Floating Object Card */}
                                    <motion.div 
                                        animate={{ rotateY: 360, y: [-15, 15, -15] }}
                                        transition={{ rotateY: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                                        className="w-full h-full bg-white/60 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white shadow-[0_20px_40px_rgba(0,0,0,0.05),_inset_0_0_20px_rgba(255,255,255,1)] md:shadow-[0_40px_80px_rgba(0,0,0,0.05),_inset_0_0_20px_rgba(255,255,255,1)] flex items-center justify-center relative overflow-hidden group"
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-purple-50 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="text-[100px] md:text-[180px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] md:drop-shadow-[0_30px_30px_rgba(0,0,0,0.2)] z-10 leading-none flex flex-col items-center justify-center gap-1" style={{ transform: "translateZ(60px)" }}>
                                            {HERO_SLIDES[currentSlide].icon}
                                        </div>
                                    </motion.div>
                                    {/* Floor Shadow */}
                                    <div className="absolute -bottom-10 md:-bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-8 md:h-12 bg-black/10 blur-[15px] md:blur-[25px] rounded-full scale-y-50" />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Next Btn */}
                        <motion.button onClick={nextSlide} whileHover={{ x: 10, scale: 1.1 }} whileTap={{ scale: 0.9 }} className="shrink-0 w-12 h-12 md:w-20 md:h-20 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-400 hover:text-cyan-500 border border-slate-100 transition-all z-20 absolute right-0 md:relative md:right-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* 3. CONCEPT / SERVICES SECTION */}
            <section id="products" className="py-12 md:py-32 bg-white relative z-10 w-full overflow-hidden border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-12 md:mb-24">
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Our Concepts</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {CONCEPTS.map((concept, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" } } } as any}
                                whileHover={{ y: -15, boxShadow: "0 40px 80px rgba(0,0,0,0.08)" }}
                                className="bg-[#fafafa] rounded-[2.5rem] p-10 text-center border border-slate-100 transition-all flex flex-col items-center group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="w-28 h-28 mb-8 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 preserve-3d relative z-10">
                                    <div className="group-hover:rotate-12 transition-transform duration-500 drop-shadow-lg">
                                        {concept.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">{concept.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10 px-2">{concept.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. WHATSAPP CTA SECTION */}
            <section id="reach-us" className="py-12 md:py-24 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                        className="bg-white rounded-[3rem] p-12 md:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-shadow duration-500"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center border border-green-100 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-12 h-12 fill-green-500 drop-shadow-sm">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.7c-33.1 0-65.5-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.3l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 50.8 0 98.6 19.8 134.5 55.7s55.7 83.7 55.7 134.5c0 101.7-82.8 184.5-184.6 184.5zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">CONTACT &rarr;</h3>
                                <p className="text-slate-500 font-medium text-lg">WhatsApp to Customize</p>
                            </div>
                        </div>

                        <a href="https://wa.me/message/YZXNYK5M6HMMJ1" target="_blank" rel="noopener noreferrer">
                            <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-sm rounded-full shadow-[0_15px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.5)] hover:bg-green-600 transition-all flex items-center justify-center gap-3"
                            >
                                Start Customization
                            </motion.button>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* 5. QUERY / CONTACT FORM */}
            <section id="contact" className="py-12 md:py-32 bg-white relative">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10 md:mb-20">
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">For Query</h2>
                    </motion.div>

                    <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full bg-[#fafafa] rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-[#fafafa] text-xs font-bold text-slate-400 uppercase tracking-widest z-10 transition-colors group-focus-within:text-cyan-500">Name</label>
                                <input type="text" placeholder="John Doe" className="w-full bg-white border-2 border-slate-200 rounded-[1.5rem] px-8 py-5 text-slate-800 font-bold focus:outline-none focus:border-cyan-500 transition-colors shadow-sm" />
                            </div>
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-[#fafafa] text-xs font-bold text-slate-400 uppercase tracking-widest z-10 transition-colors group-focus-within:text-cyan-500">Contact Number</label>
                                <input type="text" placeholder="+1 234 567 890" className="w-full bg-white border-2 border-slate-200 rounded-[1.5rem] px-8 py-5 text-slate-800 font-bold focus:outline-none focus:border-cyan-500 transition-colors shadow-sm" />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="absolute -top-3 left-6 px-2 bg-[#fafafa] text-xs font-bold text-slate-400 uppercase tracking-widest z-10 transition-colors group-focus-within:text-cyan-500">Query Message</label>
                            <textarea rows={6} placeholder="Tell us about your next project..." className="w-full bg-white border-2 border-slate-200 rounded-[1.5rem] px-8 py-5 text-slate-800 font-bold focus:outline-none focus:border-cyan-500 transition-colors resize-none shadow-sm" />
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" className="w-full py-6 bg-slate-900 border border-slate-800 text-white font-black uppercase tracking-widest text-sm rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 transition-all overflow-hidden relative">
                            Send Inquiry
                        </motion.button>
                    </motion.form>
                </div>
            </section>

            {/* 6. QUICK LINKS & 7. FOOTER */}
            <footer className="bg-slate-900 border-t border-slate-800 pt-12 md:pt-24 pb-12 text-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-12 md:mb-20">
                    {/* Left: Logo */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-[1rem] shadow-lg flex items-center justify-center">
                                <span className="text-white text-base font-black tracking-widest pl-1">3D</span>
                            </div>
                            <span className="font-extrabold tracking-[0.2em] text-white text-2xl uppercase">Trixyz</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                            Precision engineering meets limitless creativity. We build premium quality 3D manufactured assets for individuals and industry.
                        </p>
                    </div>

                    {/* Center: Quick Links */}
                    <div className="flex flex-col gap-8">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Quick Links</h4>
                        <nav className="flex flex-col gap-5 text-slate-400 font-bold text-sm uppercase tracking-widest">
                            {['Reach Us', 'About Us', 'Contact', 'WhatsApp'].map((link) => (
                                <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-cyan-400 w-fit transition-colors">{link}</a>
                            ))}
                        </nav>
                        <a href="https://wa.me/message/YZXNYK5M6HMMJ1" target="_blank" rel="noopener noreferrer">
                            <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full text-xs font-black tracking-[0.2em] transition-colors mt-2 text-white uppercase w-fit">
                                Direct WhatsApp Reach
                            </button>
                        </a>
                    </div>

                    {/* Right: Contact & Social */}
                    <div className="flex flex-col gap-8">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Contact Info</h4>
                        <div className="flex flex-col gap-5 text-slate-400 font-bold text-sm tracking-wide">
                            <p className="flex items-center gap-3"><span className="text-cyan-500">P:</span> +1 (234) 567-890</p>
                            <p className="flex items-center gap-3"><span className="text-cyan-500">E:</span> hello@3dtrixyz.com</p>
                            <p className="flex items-center gap-3"><span className="text-cyan-500">W:</span> +1 (234) 567-891</p>
                        </div>
                        <div className="flex gap-4 mt-2">
                             {['Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                                <div key={social} className="w-12 h-12 rounded-full bg-white/10 cursor-pointer flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all text-slate-400 shadow-inner">
                                    <span className="text-xs font-black uppercase tracking-widest">{social.substring(0, 2)}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <p>&copy; 2026 3D Trixyz. All rights reserved.</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
            
        </main>
    );
}
