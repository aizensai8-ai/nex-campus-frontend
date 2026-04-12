import { Link } from 'react-router-dom';

const Footer = () => {
return (
<footer className="w-full border-t border-[#424754]/15 bg-[#0d1322] tonal-shift">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto">
        <div className="col-span-1 md:col-span-1">
            <span className="font-berkeley-mono text-xs uppercase tracking-widest text-[#adc6ff] block mb-4">Nex Campus</span>
            <p className="text-sm text-[#8c909f] leading-relaxed">The Intelligent Monolith for modern education systems. Scalable, secure, and unified.</p>
        </div>
        <div>
            <span className="text-white text-xs font-bold uppercase tracking-widest block mb-6">Navigation</span>
            <ul className="space-y-3 font-inter text-sm text-[#8c909f]">
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="/portal">Portal</Link></li>
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="/courses">Courses</Link></li>
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="/events">Events</Link></li>
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="#">Research</Link></li>
            </ul>
        </div>
        <div>
            <span className="text-white text-xs font-bold uppercase tracking-widest block mb-6">Platform</span>
            <ul className="space-y-3 font-inter text-sm text-[#8c909f]">
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="#">Sitemap</Link></li>
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="#">Privacy Policy</Link></li>
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="#">Terms of Service</Link></li>
                <li><Link className="hover:text-[#adc6ff] transition-colors" to="#">Campus Status</Link></li>
            </ul>
        </div>
        <div>
            <span className="text-white text-xs font-bold uppercase tracking-widest block mb-6">Newsletter</span>
            <div className="flex">
                <input className="bg-surface-container-low border-0 ghost-border rounded-l-lg text-sm px-4 py-2 w-full focus:ring-1 focus:ring-primary outline-none text-white" placeholder="Email Address" type="email" />
                <button className="bg-primary text-on-primary px-4 py-2 rounded-r-lg">
                    <span className="material-symbols-outlined text-sm">send</span>
                </button>
            </div>
        </div>
    </div>
    <div className="max-w-7xl mx-auto px-8 py-8 border-t border-outline-variant/10 text-center">
        <p className="font-inter text-sm text-[#8c909f]">© 2024 Nex Campus. Precision in Education.</p>
    </div>
</footer>
);
};

export default Footer;
