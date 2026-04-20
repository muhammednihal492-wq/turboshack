import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="w-full bg-[#111111] text-[#e5e5e5] py-16 px-6 md:px-12 z-20 relative border-t border-white/5"
        >
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Contact */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Contact</h3>
                        <div className="space-y-4 text-sm font-light text-white/70">
                            <p className="leading-relaxed">
                                Turbo Shack private limited<br />
                                Connexxions Realtors and Office Interiors, #82/2, NVReddy Complex, Ramaiah Reddy Layout, Wellington Paradise, Singasandra, Bengaluru, Karnataka 560114
                            </p>
                            <a href="https://wa.me/9187413136" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-white transition-colors">
                                <span className="flex items-center justify-center w-5 h-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                    </svg>
                                </span>
                                <span>9187413136</span>
                            </a>
                            <div className="flex items-center space-x-3 hover:text-white transition-colors">
                                <span className="text-lg">✉️</span>
                                <span className="break-all">CONTACT@TURBOSHACK.IN</span>
                            </div>
                            <div className="flex items-center space-x-3 hover:text-white transition-colors">
                                <span className="text-lg">🌐</span>
                                <span>TURBOSHACK.IN</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Policies */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Policies</h3>
                        <ul className="space-y-4 text-sm font-light text-white/70">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Terms and Conditions</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Company</h3>
                        <ul className="space-y-4 text-sm font-light text-white/70">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Newsletter Sign Up</h3>
                        <p className="text-sm font-light text-white/70 leading-relaxed">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        <form className="flex w-full" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-transparent border border-white/20 px-4 py-2 text-sm text-white focus:outline-none focus:border-white/50 transition-colors rounded-l-md"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-white text-black px-6 py-2 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-r-md"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-light text-white/50 flex-1">
                        © 2026 Turbo Shack. All Rights Reserved.
                    </p>
                    <div className="flex-1 flex justify-center">
                        <a href="https://www.instagram.com/intellex.web?igsh=MXc4Z2Uwd243OHpqdA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors duration-300 uppercase tracking-widest text-center">
                            Meet the Developers
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mb-[2px]">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                    <div className="flex items-center justify-center md:justify-end flex-1 gap-1 md:gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex-wrap sm:flex-nowrap">
                        {/* Fake Payment Icons using text/emoji for simplicity, but visually distinct */}
                        <div className="text-[9px] md:text-xs font-bold border border-white/20 px-1.5 md:px-2 py-1 rounded whitespace-nowrap">VISA</div>
                        <div className="text-[9px] md:text-xs font-bold border border-white/20 px-1.5 md:px-2 py-1 rounded whitespace-nowrap">MC</div>
                        <div className="text-[9px] md:text-xs font-bold border border-white/20 px-1.5 md:px-2 py-1 rounded whitespace-nowrap">MAESTRO</div>
                        <div className="text-[9px] md:text-xs font-bold border border-white/20 px-1.5 md:px-2 py-1 rounded whitespace-nowrap">AMEX</div>
                        <div className="text-[9px] md:text-xs font-bold border border-white/20 px-1.5 md:px-2 py-1 rounded whitespace-nowrap">DISCOVER</div>
                        <div className="text-[9px] md:text-xs font-bold border border-white/20 px-1.5 md:px-2 py-1 rounded whitespace-nowrap">GPay</div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
