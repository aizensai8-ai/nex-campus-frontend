import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../lib/animations';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';

const ResetPassword = () => {
    const { token } = useParams();
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await api.post(`/api/auth/reset-password/${token}`, { password });
            showToast({ message: 'Password reset successful. You can now log in.', type: 'success' });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
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
                <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-container rounded-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white">Nex Campus</span>
                </Link>
                <div className="absolute inset-0 z-0 bg-surface-container-low">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#111827] to-secondary/5" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>
                
                <div className="w-full max-w-md relative z-10 bg-surface-container-lowest p-8 rounded-2xl shadow-2xl border border-outline-variant/20">
                    <div className="mb-8 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-2xl">password</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tighter text-white mb-2 font-satoshi">Create New Password</h2>
                        <p className="text-on-surface-variant text-sm">Please enter your new password below.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-md bg-error/10 border border-error/30 text-sm text-red-400 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-mono tracking-widest text-outline uppercase px-1" htmlFor="password">New Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-lg">lock</span>
                                </div>
                                <input
                                    className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-md block pl-11 p-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                                    id="password" name="password" placeholder="••••••••" required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" onClick={() => setShowPassword(v => !v)}>
                                    <span className="material-symbols-outlined text-outline hover:text-white transition-colors text-lg">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono tracking-widest text-outline uppercase px-1" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-lg">lock</span>
                                </div>
                                <input
                                    className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-md block pl-11 p-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                                    id="confirmPassword" name="confirmPassword" placeholder="••••••••" required
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-primary hover:bg-[#34d399] text-on-primary font-semibold py-3.5 rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            type="submit" disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Resetting...
                                </>
                            ) : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </main>
        </motion.div>
    );
};

export default ResetPassword;
