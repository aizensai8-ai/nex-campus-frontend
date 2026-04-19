import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const { login, user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/portal', { replace: true });
        }
    }, [authLoading, navigate, user]);

    if (authLoading) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password, rememberMe);
            showToast({ message: 'Welcome back! Signed in successfully.', type: 'success' });
            navigate('/portal');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            {...pageTransition}
            className="antialiased overflow-hidden min-h-screen bg-background text-on-surface"
        >
            <main className="min-h-screen flex flex-col md:flex-row">
                {/* Left Side: Branding & Image */}
                <section className="relative w-full md:w-1/2 h-64 md:h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-surface-container-low">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#0d1322]/60 to-secondary/5" />
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#adc6ff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
                        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10 p-8 md:p-20 w-full max-w-2xl">
                        <div className="mb-12 flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-container rounded-sm flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
                            </div>
                            <span className="text-xl font-bold tracking-tighter text-white">Nex Campus</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white leading-[1.1] mb-6 font-satoshi">
                            Welcome back to Nex Campus.
                        </h1>
                        <p className="text-on-surface-variant text-lg max-w-md font-normal leading-relaxed">
                            The intelligent monolith for precision education and campus management. Access your ecosystem with ease.
                        </p>
                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary/30 flex items-center justify-center text-xs font-bold text-primary">SK</div>
                                <div className="w-10 h-10 rounded-full border-2 border-background bg-secondary/30 flex items-center justify-center text-xs font-bold text-secondary">PL</div>
                                <div className="w-10 h-10 rounded-full border-2 border-background bg-tertiary/30 flex items-center justify-center text-xs font-bold text-tertiary">MJ</div>
                            </div>
                            <span className="font-mono text-xs tracking-widest text-outline uppercase">Join 4.2k+ Campus Users</span>
                        </div>
                    </div>
                </section>

                {/* Right Side: Login Form */}
                <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-20 bg-background relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#adc6ff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="w-full max-w-md relative z-10">
                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Sign In</h2>
                            <p className="text-on-surface-variant text-sm">Enter your credentials to access your portal.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-md bg-error/10 border border-error/30 text-sm text-red-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-xs font-mono tracking-widest text-outline uppercase px-1" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                                    </div>
                                    <input
                                        className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-md block pl-11 p-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                                        id="email" name="email" placeholder="you@gmail.com" required type="email"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-mono tracking-widest text-outline uppercase" htmlFor="password">Password</label>
                                    <a className="text-xs text-primary hover:text-white transition-colors cursor-pointer" onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/forgot-password');
                                    }}>Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-lg">lock</span>
                                    </div>
                                    <input
                                        className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-md block pl-11 p-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                                        id="password" name="password" placeholder="••••••••" required
                                        type={showPassword ? 'text' : 'password'}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" onClick={() => setShowPassword(v => !v)}>
                                        <span className="material-symbols-outlined text-outline hover:text-white transition-colors text-lg">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-1">
                                <input
                                    className="h-4 w-4 rounded border-outline-variant/40 bg-surface-container-low text-primary focus:ring-primary"
                                    id="rememberMe"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="text-sm text-on-surface-variant" htmlFor="rememberMe">
                                    Remember me on this device
                                </label>
                            </div>

                            <button
                                className="w-full bg-[#3B82F6] hover:bg-primary-container text-on-primary-container font-semibold py-3.5 rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                type="submit" disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-outline-variant/20"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-mono tracking-widest">
                                <span className="bg-background px-4 text-outline">Enterprise SSO</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant/30 rounded-md hover:bg-surface-container-low transition-all group" type="button">
                                <span className="material-symbols-outlined text-lg group-hover:text-white">google</span>
                                <span className="text-sm text-on-surface-variant group-hover:text-white">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant/30 rounded-md hover:bg-surface-container-low transition-all group" type="button">
                                <span className="material-symbols-outlined text-lg group-hover:text-white">key</span>
                                <span className="text-sm text-on-surface-variant group-hover:text-white">Azure AD</span>
                            </button>
                        </div>

                        <p className="mt-10 text-center text-on-surface-variant text-sm">
                            Don't have an account? <a className="text-primary font-medium hover:text-white transition-colors" href="/signup">Sign up</a>
                        </p>
                    </div>

                    <div className="absolute bottom-8 text-center w-full px-8 left-0">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-outline/40">
                            Precision in Education © 2024 Nex Campus
                        </span>
                    </div>
                </section>
            </main>
        </motion.div>
    );
};

export default Login;
