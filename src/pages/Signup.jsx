import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { pageTransition } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Signup = () => {
    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', usn: '', password: '', semester: '', sectionLetter: '', address: '' });
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null); // 'terms' | 'privacy' | null
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) { setError('Please accept the Terms of Service to continue.'); return; }
        setError('');
        if (!form.semester || !form.sectionLetter) {
            setError('Please select both a semester and a section.');
            return;
        }
        const section = `${form.semester}${form.sectionLetter}`;
        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, usn: form.usn, password: form.password, section, semester: parseInt(form.semester), address: form.address }, rememberMe);
            showToast({ message: 'Account created! Welcome to Nex Campus.', type: 'success' });
            navigate('/portal');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            {...pageTransition}
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
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]"></div>

                <div className="w-full max-w-xl px-6 relative z-10 mt-12">
                    <div className="bg-surface-container-low rounded-xl p-8 md:p-12 shadow-2xl ring-1 ring-outline-variant/15">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold tracking-tighter text-white font-headline mb-2">Create your account</h1>
                            <p className="text-on-surface-variant font-body leading-relaxed">Join the next generation of intelligent campus management.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-md bg-error/10 border border-error/30 text-sm text-red-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Full Name</label>
                                <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="Enter your full name" type="text" name="name" value={form.name} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Student Email</label>
                                <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="you@gmail.com" type="email" name="email" value={form.email} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">University Serial Number (USN)</label>
                                <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline font-mono focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="e.g. 1ck24cs001" type="text" name="usn" value={form.usn} onChange={(e) => setForm(f => ({ ...f, usn: e.target.value.toLowerCase() }))} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Home Region / Address</label>
                                <input className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="e.g. Bangarpet, Mulbagal..." type="text" name="address" value={form.address} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Semester <span className="text-primary">*</span></label>
                                    <select
                                        className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface focus:ring-1 focus:ring-primary-container transition-all outline-none"
                                        name="semester"
                                        value={form.semester}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">— select —</option>
                                        <option value="1">1st Semester</option>
                                        <option value="2">2nd Semester</option>
                                        <option value="3">3rd Semester</option>
                                        <option value="4">4th Semester</option>
                                        <option value="5">5th Semester</option>
                                        <option value="6">6th Semester</option>
                                        <option value="7">7th Semester</option>
                                        <option value="8">8th Semester</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Section <span className="text-primary">*</span></label>
                                    <select
                                        className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface focus:ring-1 focus:ring-primary-container transition-all outline-none"
                                        name="sectionLetter"
                                        value={form.sectionLetter}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">— select —</option>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                        <option value="E">Section E</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Password</label>
                                <div className="relative">
                                    <input 
                                        className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-4 pr-12 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none" 
                                        placeholder="••••••••" 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        value={form.password} 
                                        onChange={handleChange} 
                                        required 
                                        minLength={6} 
                                    />
                                    <button 
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-white transition-colors p-1"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    className="mt-1 h-4 w-4 rounded-sm bg-surface-variant border-outline-variant text-primary focus:ring-primary/20"
                                    id="rememberMe"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="text-sm text-on-surface-variant leading-tight" htmlFor="rememberMe">
                                    Remember me on this device
                                </label>
                            </div>

                            <div className="flex items-start gap-3 py-2">
                                <input className="mt-1 rounded-sm bg-surface-variant border-outline-variant text-primary focus:ring-primary/20" id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                                <label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms">
                                    I agree to the{' '}
                                    <button type="button" onClick={() => setModal('terms')} className="text-primary hover:underline">Terms of Service</button>
                                    {' '}and{' '}
                                    <button type="button" onClick={() => setModal('privacy')} className="text-primary hover:underline">Privacy Policy</button>.
                                </label>
                            </div>

                            <button
                                className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                type="submit" disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </>
                                )}
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

            {/* Terms/Privacy Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="relative bg-surface-container-low rounded-xl p-8 max-w-lg w-full shadow-2xl ring-1 ring-outline-variant/20 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {modal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                            </h3>
                            <button onClick={() => setModal(null)} className="text-outline hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
                            {modal === 'terms' ? (
                                <>
                                    <p><strong className="text-white">1. Acceptance of Terms</strong><br />By creating an account on Nex Campus, you agree to these Terms of Service. If you disagree, do not use the platform.</p>
                                    <p><strong className="text-white">2. Eligibility</strong><br />You must be a registered student or faculty member with a valid Gmail address to use Nex Campus.</p>
                                    <p><strong className="text-white">3. Account Security</strong><br />You are responsible for maintaining the confidentiality of your account credentials. Report unauthorized access immediately.</p>
                                    <p><strong className="text-white">4. Acceptable Use</strong><br />Use Nex Campus only for lawful educational purposes. Do not misuse platform resources or attempt to disrupt services.</p>
                                    <p><strong className="text-white">5. Intellectual Property</strong><br />Course materials and campus content are the property of Nex Campus and respective instructors.</p>
                                    <p><strong className="text-white">6. Termination</strong><br />We reserve the right to suspend accounts that violate these terms without prior notice.</p>
                                </>
                            ) : (
                                <>
                                    <p><strong className="text-white">1. Data We Collect</strong><br />We collect your name, email address, USN, and usage data to provide campus services.</p>
                                    <p><strong className="text-white">2. How We Use Your Data</strong><br />Your data is used to manage your account, personalize your experience, and send important campus communications.</p>
                                    <p><strong className="text-white">3. Data Sharing</strong><br />We do not sell your personal data. Data may be shared with campus departments for academic purposes only.</p>
                                    <p><strong className="text-white">4. Data Security</strong><br />We employ industry-standard security measures including encryption and secure storage to protect your information.</p>
                                    <p><strong className="text-white">5. Your Rights</strong><br />You may request access to, correction of, or deletion of your personal data by contacting campus administration.</p>
                                    <p><strong className="text-white">6. Cookies</strong><br />We use cookies for session management and analytics. You can disable cookies in your browser settings.</p>
                                </>
                            )}
                        </div>
                        <button onClick={() => setModal(null)} className="mt-6 w-full bg-primary text-on-primary font-bold py-3 rounded-lg hover:bg-primary-fixed-dim transition-all">
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Signup;
