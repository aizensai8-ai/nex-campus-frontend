import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Privacy / ToS Modal ─────────────────────────────────────────────────────
const LegalModal = ({ type, onClose }) => {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      body: `Nex Campus respects your privacy and is committed to protecting your personal data.

We collect information you provide directly to us, such as your name, email address, USN, and academic records necessary to provide campus management services.

Your data is used solely for operating the platform — attendance tracking, timetable management, course enrollment, and facility access. We do not sell or share your information with third parties outside of CBIT Kolar.

Data is stored on secure servers and access is restricted to authorized personnel. You may request deletion of your account and associated data by contacting campus administration.

This policy is effective as of January 2024 and may be updated with notice.`,
    },
    terms: {
      title: 'Terms of Service',
      body: `By using Nex Campus, you agree to these terms.

You must be an enrolled student, faculty member, or authorized staff at CBIT Kolar to use this platform. You are responsible for maintaining the security of your account credentials.

You agree not to misuse the platform, attempt unauthorized access, or interfere with the systems. Academic data visible through the portal is confidential and must not be shared.

The platform is provided "as is" for educational and administrative purposes. We reserve the right to modify features, restrict access, or suspend accounts that violate these terms.

For questions, contact support through the Support page.`,
    },
  };

  const { title, body } = content[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:text-white hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {body.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm text-on-surface-variant leading-relaxed mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/10">
          <button
            onClick={onClose}
            className="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [modal, setModal] = useState(null); // 'privacy' | 'terms' | null

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      <footer className="w-full bg-[#111827] relative">
        {/* Gradient separator */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.3) 50%, transparent 100%)' }} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-3">Nex Campus</span>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-4">
              Your campus dashboard for CBIT Kolar. Attendance, courses, and events in one place.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-outline hover:text-white hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">code</span>
              </a>
              <a
                href="mailto:admin@nexcampus.in"
                aria-label="Email"
                className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-outline hover:text-white hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-white text-xs font-bold uppercase tracking-widest block mb-5">Navigation</span>
            <ul className="space-y-3 text-sm text-[#9ca3af]">
              {[
                { label: 'Portal', to: '/portal' },
                { label: 'Courses', to: '/courses' },
                { label: 'Events', to: '/events' },
                { label: 'Facilities', to: '/facilities' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link className="footer-link hover:text-primary" to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <span className="text-white text-xs font-bold uppercase tracking-widest block mb-5">Platform</span>
            <ul className="space-y-3 text-sm text-[#9ca3af]">
              <li>
                <button
                  onClick={() => setModal('privacy')}
                  className="footer-link hover:text-primary text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModal('terms')}
                  className="footer-link hover:text-primary text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <Link className="footer-link hover:text-primary" to="/support">Support</Link>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-[#9ca3af]">
                  <span className="inline-flex relative">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping absolute" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 relative" />
                  </span>
                  All systems operational
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <span className="text-white text-xs font-bold uppercase tracking-widest block mb-5">Stay Updated</span>
            <p className="text-xs text-[#9ca3af] mb-4 leading-relaxed">
              Get campus announcements and event updates in your inbox.
            </p>
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm py-2"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  You're subscribed!
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubscribe}
                  className="flex"
                >
                  <input
                    className="bg-surface-container-high border-0 ghost-border rounded-l-lg text-sm px-3 py-2 w-full focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-outline/50"
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Newsletter email address"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="bg-primary text-on-primary px-3.5 py-2 rounded-r-lg hover:brightness-110 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-8 py-5 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9ca3af]">© 2026 Nex Campus · Built for CBIT Kolar</p>
          <p className="text-xs text-[#9ca3af]">
            Built for{' '}
            <span className="text-primary font-semibold">CBIT Kolar</span>
          </p>
        </div>
      </footer>

      {/* Legal modals */}
      <AnimatePresence>
        {modal && <LegalModal key={modal} type={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Footer;
