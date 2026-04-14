import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageTransition, fadeUpBlur } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';

const SEM_ORDINAL = (n) =>
  n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  // Derive initial semester + letter from the stored section string (e.g. "4C")
  const initSemester     = user?.section?.[0] || user?.semester?.toString() || '';
  const initSectionLetter = user?.section?.[1] || '';

  const [form, setForm] = useState({
    name:          user?.name          || '',
    usn:           user?.usn           || '',
    semester:      initSemester,
    sectionLetter: initSectionLetter,
  });

  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  // Password state
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Keep form in sync if user context loads after mount (e.g. hard-reload)
  useEffect(() => {
    if (user) {
      setForm({
        name:          user.name  || '',
        usn:           user.usn   || '',
        semester:      user.section?.[0] || user.semester?.toString() || '',
        sectionLetter: user.section?.[1] || '',
      });
    }
  }, [user?.name, user?.usn, user?.section]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.semester || !form.sectionLetter) {
      setError('Please select both a semester and a section letter.');
      return;
    }
    setError('');
    setSaving(true);

    const section  = `${form.semester}${form.sectionLetter}`;
    const semester = parseInt(form.semester);

    try {
      const res = await api.put('/api/users/profile', {
        name: form.name.trim(),
        usn:  form.usn.trim().toLowerCase(),
        section,
        semester,
      });

      // Sync AuthContext so Navbar / Portal reflect changes immediately
      updateUser({
        name:     res.data.name,
        usn:      res.data.usn,
        section:  res.data.section,
        semester: res.data.semester,
      });

      showToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePwdChange = (e) => setPwdForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
        return setPwdError('New passwords do not match.');
    }

    setPwdSaving(true);
    try {
        await api.put('/api/users/password', {
            currentPassword: pwdForm.currentPassword,
            newPassword: pwdForm.newPassword,
        });
        setPwdSuccess('Password updated successfully');
        showToast({ message: 'Password updated successfully!', type: 'success' });
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
        setPwdError(err.response?.data?.message || 'Failed to update password.');
    } finally {
        setPwdSaving(false);
    }
  };

  const currentSection =
    form.semester && form.sectionLetter
      ? `${form.semester}${form.sectionLetter}`
      : '—';

  return (
    <motion.main
      {...pageTransition}
      className="pt-24 pb-20 max-w-[1440px] mx-auto px-6"
    >
      {/* ── Header ── */}
      <motion.section {...fadeUpBlur} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Link
            to="/portal"
            className="flex items-center gap-1 text-xs font-mono text-outline uppercase tracking-widest hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Portal
          </Link>
          <span className="text-outline/40">/</span>
          <span className="text-xs font-mono text-outline uppercase tracking-widest">Edit Profile</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-satoshi">
          Edit Profile
        </h1>
        <p className="text-on-surface-variant mt-2 max-w-xl">
          Update your name, USN, and section. Your email address cannot be changed.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Form ── */}
        <motion.div
          {...fadeUpBlur}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2"
        >
          <div className="bg-surface-container-low rounded-xl p-8 ring-1 ring-outline-variant/15 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none"
                  placeholder="Your full name"
                />
              </div>

              {/* Email — read-only */}
              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1 flex items-center gap-2">
                  Email
                  <span className="text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-outline normal-case tracking-normal font-sans">
                    read-only
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-surface-container-highest/50 border-none rounded-lg py-3.5 px-4 text-outline cursor-not-allowed outline-none"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">lock</span>
                </div>
              </div>

              {/* USN */}
              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">
                  University Serial Number (USN)
                </label>
                <input
                  name="usn"
                  type="text"
                  value={form.usn}
                  onChange={(e) => setForm((f) => ({ ...f, usn: e.target.value.toLowerCase() }))}
                  className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline font-mono focus:ring-1 focus:ring-primary-container transition-all outline-none"
                  placeholder="e.g. 1ck24cs001"
                />
              </div>

              {/* Semester + Section letter */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">
                    Semester <span className="text-primary">*</span>
                  </label>
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface focus:ring-1 focus:ring-primary-container transition-all outline-none"
                  >
                    <option value="">— select —</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={String(n)}>
                        {SEM_ORDINAL(n)} Semester
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">
                    Section <span className="text-primary">*</span>
                  </label>
                  <select
                    name="sectionLetter"
                    value={form.sectionLetter}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface focus:ring-1 focus:ring-primary-container transition-all outline-none"
                  >
                    <option value="">— select —</option>
                    {['A', 'B', 'C', 'D', 'E'].map((l) => (
                      <option key={l} value={l}>Section {l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview badge */}
              {form.semester && form.sectionLetter && (
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                  Will be saved as section
                  <span className="font-mono text-white bg-primary/15 border border-primary/25 px-2 py-0.5 rounded">
                    {currentSection}
                  </span>
                  ({SEM_ORDINAL(parseInt(form.semester))} Semester, Section {form.sectionLetter})
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Change Password Form ── */}
          {!user?.googleId && (
          <div className="bg-surface-container-low rounded-xl p-8 ring-1 ring-outline-variant/15 shadow-2xl mt-8">
            <h2 className="text-xl font-bold tracking-tighter text-white mb-6">Change Password</h2>

            {pwdError && (
              <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {pwdSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Current Password</label>
                <div className="relative group">
                  <input
                    name="currentPassword"
                    type={showPwd ? 'text' : 'password'}
                    value={pwdForm.currentPassword}
                    onChange={handlePwdChange}
                    required
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 pr-11 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" onClick={() => setShowPwd(v => !v)}>
                    <span className="material-symbols-outlined text-outline hover:text-white transition-colors text-[18px]">
                        {showPwd ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">New Password</label>
                  <input
                    name="newPassword"
                    type={showPwd ? 'text' : 'password'}
                    value={pwdForm.newPassword}
                    onChange={handlePwdChange}
                    required
                    minLength={6}
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono tracking-widest text-outline uppercase ml-1">Confirm New</label>
                  <input
                    name="confirmPassword"
                    type={showPwd ? 'text' : 'password'}
                    value={pwdForm.confirmPassword}
                    onChange={handlePwdChange}
                    required
                    minLength={6}
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pwdSaving}
                className="w-full bg-surface-container-high border border-outline-variant/30 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pwdSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
          )}
        </motion.div>

        {/* ── Info panel ── */}
        <motion.div
          {...fadeUpBlur}
          transition={{ delay: 0.12 }}
          className="space-y-4"
        >
          {/* Current info card */}
          <div className="bg-surface-container-low rounded-xl p-6 ring-1 ring-outline-variant/15">
            <p className="text-xs font-mono text-outline uppercase tracking-widest mb-4">Current Profile</p>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">person</span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{user?.name || '—'}</p>
                <p className="text-on-surface-variant text-xs truncate">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-outline font-mono text-[10px] uppercase tracking-wider">USN</span>
                <span className="text-white font-mono">{user?.usn || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-outline font-mono text-[10px] uppercase tracking-wider">Section</span>
                <span className="text-white font-mono">{user?.section || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-outline font-mono text-[10px] uppercase tracking-wider">Role</span>
                <span className={`font-semibold capitalize ${user?.role === 'admin' ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {user?.role || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-surface-container-low/50 rounded-xl p-5 ring-1 ring-outline-variant/10">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">info</span>
              <div>
                <p className="text-xs font-semibold text-white mb-1">Gmail is permanent</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your Gmail address is tied to your VTU identity and cannot be changed. Contact campus administration if there's an issue.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </motion.main>
  );
};

export default EditProfile;
