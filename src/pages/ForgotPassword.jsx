import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../lib/animations';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';

const ForgotPassword = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/auth/forgot-password', { email });
            showToast({ message: res.data.message || 'Reset link sent to your email', type: 'success' });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            {...pageTransition}
            className="antialiased overflow-hidden min-h-screen bg-background text-on-surface"
        >
            <main className="min-h-screen flex items-center justify-center relative p-6">
                <div className="absolute inset-0 z-0 bg-surface-container-lowest">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#0d1322] to-secondary/5" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#adc6ff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>
                
                <div className="w-full max-w-md relative z-10 bg-surface-container-low p-8 rounded-2xl shadow-2xl border border-outline-variant/20">
                    <div className="mb-8 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-2xl">lock_reset</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tighter text-white mb-2 font-satoshi">Reset Password</h2>
                        <p className="text-on-surface-variant text-sm">Enter your Gmail address and we'll send you a link to get back into your account.</p>
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
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm rounded-md block pl-11 p-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                                    id="email" name="email" placeholder="you@gmail.com" required type="email"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
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
                                    Sending...
                                </>
                            ) : 'Send Reset Link'}
                        </button>
                    </form>
                    
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full mt-4 text-sm text-outline hover:text-white transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </main>
        </motion.div>
    );
};

export default ForgotPassword;
