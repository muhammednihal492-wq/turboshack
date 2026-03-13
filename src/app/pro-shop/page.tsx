import Link from 'next/link';

export default function ProShop() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-red-600 selection:text-black">
            {/* Background Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0 pointer-events-none"></div>
            
            <div className="relative z-10 text-center flex flex-col items-center justify-center px-4">
                <span className="text-6xl md:text-8xl mb-6">🏎️</span>
                
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-white">
                    THE <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">PRO SHOP</span>
                </h1>
                
                <div className="inline-block mt-8 border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <p className="text-xl md:text-3xl font-bold font-mono tracking-widest text-red-500 uppercase drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse">
                        Coming Soon
                    </p>
                </div>
                
                <p className="mt-8 text-white/50 max-w-lg mx-auto leading-relaxed">
                    Premium RC machines, essential upgrades, spare parts, and pro accessories are on their way. Gear up for the ultimate performance.
                </p>
                
                <Link href="/" className="mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded uppercase text-sm font-bold tracking-widest transition-all hover:border-white/50">
                    &larr; Back to Home
                </Link>
            </div>
        </main>
    );
}
