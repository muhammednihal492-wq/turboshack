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
                                Turbo Shack<br />
                                123 Raceway Avenue<br />
                                Motorsport City, MC 90210
                            </p>
                            <div className="flex items-center space-x-3 hover:text-white transition-colors">
                                <span className="text-lg">📞</span>
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 hover:text-white transition-colors">
                                <span className="text-lg">✉️</span>
                                <span>support@turboshack.com</span>
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
