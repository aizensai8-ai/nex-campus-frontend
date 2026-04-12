import { motion } from 'framer-motion';

const Events = () => {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20 max-w-[1440px] mx-auto px-6"
        >
            {/* Hero Section */}
            <section className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">Campus Events</h1>
                        <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
                            Precision-scheduled symposia, hackathons, and cultural exchanges. The intelligence of our campus, live and in person.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-sm border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Live Feed Active
                    </div>
                </div>
            </section>

            {/* Bento Grid / Timeline Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-outline-variant/15 border border-outline-variant/15 rounded-xl overflow-hidden">
                {/* Timeline Sidebar (Desktop) */}
                <div className="hidden md:block md:col-span-1 bg-surface-container-lowest py-8 text-center border-r border-outline-variant/15">
                    <div className="sticky top-28 space-y-12">
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-xs text-outline mb-2">OCT</span>
                            <span className="text-2xl font-bold text-white">12</span>
                        </div>
                        <div className="flex flex-col items-center opacity-40">
                            <span className="font-mono text-xs text-outline mb-2">OCT</span>
                            <span className="text-2xl font-bold text-white">15</span>
                        </div>
                        <div className="flex flex-col items-center opacity-40">
                            <span className="font-mono text-xs text-outline mb-2">OCT</span>
                            <span className="text-2xl font-bold text-white">22</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-11 bg-surface-container-low p-8 md:p-12">
                    {/* Featured Event Bento */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <div className="relative group cursor-pointer overflow-hidden rounded-xl aspect-[4/3] lg:aspect-auto">
                            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4D2HKIw1XvhYVX2-K5-G-jOKlh50nomZY-hBQOQMkCKKihj4tLTAVJLj-8Q-4-vOgQ0B6_-l4DHba-Vqts_h9fWMoq1ziotH3dJnfZpsH0C8D9LV0OGvh4RP-PC44cLOcpYlR5hwcAtDJacauXH8k8zKMwMmxXkNQKy5WcEY4gvQCLdf2Pin0TYKbxEJlP3Tu4DSxx5bumYITGQ_mw0vpQozEsZgZcAUHCqtr9ffiANj111juzmZANe_B1BHU-glNxp7WACj6HcE" alt="Featured event" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-2 py-1 bg-primary text-on-primary text-[10px] font-mono font-bold uppercase tracking-tighter rounded-sm mb-3">Keynote Event</span>
                                <h2 className="text-3xl font-bold tracking-tighter text-white">The Future of Neural Architectures</h2>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="space-y-2">
                                <span className="font-mono text-xs text-primary uppercase tracking-widest">October 12, 2024</span>
                                <h3 className="text-4xl font-bold tracking-tighter text-white">Building the Autonomous Campus</h3>
                                <p className="text-on-surface-variant leading-relaxed">Join lead engineers from the Nex Infrastructure Team for a deep dive into the mesh network controlling our smart facilities.</p>
                            </div>
                            <div className="flex items-center gap-6 font-mono text-xs text-outline">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    Aud. Alpha-7
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    14:00 — 17:30
                                </div>
                            </div>
                            <div className="pt-4">
                                <button className="px-8 py-3 bg-primary text-on-primary font-bold tracking-tighter hover:bg-white transition-colors duration-300">
                                    Register Seat
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Event List (Timeline Items) */}
                    <div className="space-y-px bg-outline-variant/15">
                        {/* Event 01 */}
                        <div className="group grid grid-cols-1 md:grid-cols-12 items-center bg-surface-container-low py-8 md:px-0 transition-all hover:bg-surface-container-high cursor-pointer">
                            <div className="md:col-span-2 flex flex-col md:items-center mb-4 md:mb-0">
                                <span className="font-mono text-xs text-outline uppercase">Next Tuesday</span>
                                <span className="text-xl font-bold text-white">Oct 15</span>
                            </div>
                            <div className="md:col-span-6 space-y-1">
                                <h4 className="text-xl font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors">Quantum Computing Lab Open House</h4>
                                <p className="text-sm text-on-surface-variant font-mono">Hosted by Dept. of Applied Physics</p>
                            </div>
                            <div className="md:col-span-2 text-sm text-outline flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">sensors</span>
                                North Wing, L4
                            </div>
                            <div className="md:col-span-2 flex md:justify-end mt-4 md:mt-0">
                                <button className="text-xs font-mono font-bold uppercase tracking-widest border border-outline-variant/30 px-4 py-2 hover:border-primary hover:text-primary transition-all">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Event 02 */}
                        <div className="group grid grid-cols-1 md:grid-cols-12 items-center bg-surface-container-low py-8 md:px-0 transition-all hover:bg-surface-container-high cursor-pointer">
                            <div className="md:col-span-2 flex flex-col md:items-center mb-4 md:mb-0">
                                <span className="font-mono text-xs text-outline uppercase">Next Week</span>
                                <span className="text-xl font-bold text-white">Oct 22</span>
                            </div>
                            <div className="md:col-span-6 space-y-1">
                                <h4 className="text-xl font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors">Sustainable Logistics Symposium</h4>
                                <p className="text-sm text-on-surface-variant font-mono">Global Supply Chain Initiative</p>
                            </div>
                            <div className="md:col-span-2 text-sm text-outline flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">sensors</span>
                                Main Hall
                            </div>
                            <div className="md:col-span-2 flex md:justify-end mt-4 md:mt-0">
                                <button className="text-xs font-mono font-bold uppercase tracking-widest border border-outline-variant/30 px-4 py-2 hover:border-primary hover:text-primary transition-all">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Event 03 */}
                        <div className="group grid grid-cols-1 md:grid-cols-12 items-center bg-surface-container-low py-8 md:px-0 transition-all hover:bg-surface-container-high cursor-pointer">
                            <div className="md:col-span-2 flex flex-col md:items-center mb-4 md:mb-0">
                                <span className="font-mono text-xs text-outline uppercase">Late Oct</span>
                                <span className="text-xl font-bold text-white">Oct 29</span>
                            </div>
                            <div className="md:col-span-6 space-y-1">
                                <h4 className="text-xl font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors">Nex AI Hackathon: The Genesis Project</h4>
                                <p className="text-sm text-on-surface-variant font-mono">48-hour endurance coding</p>
                            </div>
                            <div className="md:col-span-2 text-sm text-outline flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">sensors</span>
                                The Hub
                            </div>
                            <div className="md:col-span-2 flex md:justify-end mt-4 md:mt-0">
                                <span className="text-[10px] font-mono text-secondary uppercase tracking-widest px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-sm">Waitlist Only</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Bento Grid Section */}
            <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
                    <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px' }}>calendar_month</span>
                    <h5 className="text-lg font-bold text-white mb-2">Sync Calendar</h5>
                    <p className="text-sm text-on-surface-variant mb-6">Integrate Nex Campus events directly into your personal workflow via iCal or Google Calendar.</p>
                    <a className="text-xs font-mono text-primary uppercase tracking-widest hover:underline" href="#">Get Sync Link →</a>
                </div>
                <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
                    <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px' }}>campaign</span>
                    <h5 className="text-lg font-bold text-white mb-2">Host an Event</h5>
                    <p className="text-sm text-on-surface-variant mb-6">Propose your own technical seminar or workshop. Review current guidelines for venue booking.</p>
                    <a className="text-xs font-mono text-primary uppercase tracking-widest hover:underline" href="#">Submit Proposal →</a>
                </div>
                <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
                    <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px' }}>history</span>
                    <h5 className="text-lg font-bold text-white mb-2">Past Recordings</h5>
                    <p className="text-sm text-on-surface-variant mb-6">Missed a session? Access the full archive of recorded keynotes and seminar papers.</p>
                    <a className="text-xs font-mono text-primary uppercase tracking-widest hover:underline" href="#">Archive Access →</a>
                </div>
            </section>
        </motion.main>
    );
};

export default Events;
