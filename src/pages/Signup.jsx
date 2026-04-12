import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Signup = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col antialiased bg-background text-on-surface"
        >
            {/* TopNavBar */}
            <header className="fixed top-0 left-0 w-full z-50 border-b border-outline-variant/10" style={{ backdropFilter: 'blur(20px)', background: 'rgba(13, 19, 34, 0.8)' }}>
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
                    <div className="text-xl font-bold tracking-tighter text-white font-headline">
                        Nex Campus
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] tracking-widest text-outline uppercase">System Status: Optimal</span>
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(173,198,255,0.6)]"></div>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center pt-20 pb-12 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(66, 71, 84, 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
                {/* Background decorative elements */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]"></div>
                
                <div className="w-full max-w-xl px-6 relative z-10 mt-12">
                    {/* Form Container */}
                    <div className="bg-surface-container-low rounded-xl p-8 md:p-12 shadow-2xl ring-1 ring-outline-variant/15">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold tracking-tighter text-white font-headline mb-2">Create your account</h1>
                            <p className="text-on-surface-variant font-body leading-relaxed">Join the next generation of intelligent campus management.</p>
                        </div>
                        
                        <form className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Full Name</label>
                                <div className="relative group">
                                    <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="Enter your full name" type="text" />
                                </div>
                            </div>
                            
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Student Email</label>
                                <div className="relative group">
                                    <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="name@campus.edu" type="email" />
                                </div>
                            </div>
                            
                            {/* USN Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">University Serial Number (USN)</label>
                                <div className="relative group">
                                    <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline font-mono focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="e.g. 1NC24CS001" type="text" />
                                </div>
                            </div>
                            
                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Password</label>
                                <div className="relative group">
                                    <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="••••••••" type="password" />
                                </div>
                            </div>
                            
                            {/* Terms */}
                            <div className="flex items-start gap-3 py-2">
                                <input className="mt-1 rounded-sm bg-surface-variant border-outline-variant text-primary focus:ring-primary/20" id="terms" type="checkbox" />
                                <label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms">
                                    I agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
                                </label>
                            </div>
                            
                            {/* CTA */}
                            <button className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all active:scale-[0.98]" type="submit">
                                <span>Create Account</span>
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </button>
                        </form>
                        
                        {/* Footer Link */}
                        <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
                            <p className="text-on-surface-variant text-sm">
                                Already have an account? 
                                <Link className="text-primary font-semibold hover:text-white transition-colors ml-1" to="/login">Sign in to Portal</Link>
                            </p>
                        </div>
                    </div>
                    
                    {/* Side features (Bento Style) */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-surface-container-low/50 p-4 rounded-xl ring-1 ring-outline-variant/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-tertiary">verified_user</span>
                            </div>
                            <div>
                                <p className="text-xs font-mono text-outline uppercase tracking-wider">Security</p>
                                <p className="text-xs text-on-surface-variant">SSO Integrated Auth</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-low/50 p-4 rounded-xl ring-1 ring-outline-variant/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-secondary">bolt</span>
                            </div>
                            <div>
                                <p className="text-xs font-mono text-outline uppercase tracking-wider">Access</p>
                                <p className="text-xs text-on-surface-variant">Instant Provisioning</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-outline-variant/15 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto">
                    <div className="md:col-span-1">
                        <div className="font-mono text-xs uppercase tracking-widest text-[#adc6ff] mb-4">Nex Campus</div>
                        <p className="text-sm text-outline leading-relaxed max-w-xs">
                            The precision platform for modern educational ecosystems. Smart. Scalable. Secure.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Platform</h4>
                            <ul className="space-y-2">
                                <li><a className="text-sm text-outline hover:text-primary transition-colors" href="#">Portal</a></li>
                                <li><a className="text-sm text-outline hover:text-primary transition-colors" href="#">Campus Status</a></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Resources</h4>
                            <ul className="space-y-2">
                                <li><a className="text-sm text-outline hover:text-primary transition-colors" href="#">Documentation</a></li>
                                <li><a className="text-sm text-outline hover:text-primary transition-colors" href="#">Support</a></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Legal</h4>
                            <ul className="space-y-2">
                                <li><a className="text-sm text-outline hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="text-sm text-outline hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="px-8 py-6 border-t border-outline-variant/10 text-center flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
                    <p className="font-inter text-xs text-[#c2c6d6]">© 2024 Nex Campus. Precision in Education.</p>
                    <div className="flex gap-6">
                        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-[20px]">terminal</span>
                        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-[20px]">database</span>
                        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-[20px]">public</span>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
};

export default Signup;
