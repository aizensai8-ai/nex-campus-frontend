import { motion } from 'framer-motion';

const Portal = () => {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20"
        >
            {/* Hero Section */}
            <section className="max-w-[1440px] mx-auto px-6 mb-16">
                <div className="relative overflow-hidden rounded-xl bg-surface-container-low min-h-[400px] flex flex-col justify-center items-center text-center p-8">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFK-JOIqRc96iV4q-x7SAButIXxoVj0u9yDVgsSS6xsGilQvXDwRYL_7Ed6Bjn-hvfLNjSekf1p3QbOSYzOAjcsGmUfK4VNw5BnHD60StvQqzher_mOQlhAGsvWW60DCd-Zpodd-ejuE1hX1PJ7_Wx8f-aQCCPsT7Ce0R3gSOx8CCV82zPpBOhHzQ76NVfk6abM4-MoINcHmTVQTlQG2eeFV9UktNweBbovqfF5lFmhheFmP2OPm-vg0Wve9x6Zm-Z5PbQD8GDxJM" alt="Network visualization" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 max-w-4xl leading-tight">
                        A calm place for Nex Campus students to check what matters next.
                    </h1>
                    <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-inter mb-10">
                        Streamline your academic life with our precision-engineered portal. Access grades, schedules, and campus resources in one unified view.
                    </p>
                    {/* Auth Callout */}
                    <div className="glass-panel ghost-border p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 max-w-md w-full relative z-10">
                        <div className="text-left flex-1">
                            <p className="text-white font-semibold">Log in to open your student profile.</p>
                            <p className="text-on-surface-variant text-sm">Secure access for verified USN holders.</p>
                        </div>
                        <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold tracking-tight hover:opacity-90 transition-opacity whitespace-nowrap">
                            Sign In Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Bento Grid Section */}
            <section className="max-w-[1440px] mx-auto px-6 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Verification Tile */}
                    <div className="md:col-span-8 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container transition-colors">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                                <span className="font-berkeley-mono text-xs text-primary uppercase tracking-widest">Security Layer</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">USN Verification</h3>
                            <p className="text-on-surface-variant max-w-md">Instantly authenticate your campus identity using your unique Student Number for secure portal access.</p>
                        </div>
                        <div className="mt-8 flex items-end justify-between">
                            <span className="text-4xl font-bold text-primary opacity-20 group-hover:opacity-100 transition-opacity">01</span>
                            <span className="material-symbols-outlined text-white">arrow_forward</span>
                        </div>
                    </div>

                    {/* Schedule Tile */}
                    <div className="md:col-span-4 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container transition-colors">
                        <div>
                            <span className="material-symbols-outlined text-secondary mb-6">calendar_month</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Course schedule</h3>
                            <p className="text-on-surface-variant">Your daily academic rhythm, synced in real-time with campus changes.</p>
                        </div>
                        <div className="mt-8">
                            <div className="flex flex-col gap-2">
                                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="bg-secondary h-full w-2/3"></div>
                                </div>
                                <span className="font-berkeley-mono text-[10px] text-on-surface-variant uppercase">Next: Advance Robotics 14:00</span>
                            </div>
                        </div>
                    </div>

                    {/* Event Feed Tile */}
                    <div className="md:col-span-4 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container transition-colors">
                        <div>
                            <span className="material-symbols-outlined text-tertiary mb-6">campaign</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Event feed</h3>
                            <p className="text-on-surface-variant">Stay connected with live campus happenings, workshops, and guest lectures.</p>
                        </div>
                        <div className="mt-8 flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-low"></div>
                            <div className="w-8 h-8 rounded-full bg-tertiary border-2 border-surface-container-low"></div>
                            <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-low flex items-center justify-center text-[10px]">+12</div>
                        </div>
                    </div>

                    {/* Support Tile */}
                    <div className="md:col-span-8 bg-surface-container-low ghost-border rounded-xl p-8 flex items-center gap-8 group cursor-pointer hover:bg-surface-container transition-colors overflow-hidden">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-primary">support_agent</span>
                                <span className="font-berkeley-mono text-xs text-primary uppercase tracking-widest">24/7 Concierge</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Campus support</h3>
                            <p className="text-on-surface-variant">Direct line to academic advisors and technical support teams for immediate assistance.</p>
                        </div>
                        <div className="hidden lg:block w-48 h-48 relative">
                            <img className="absolute inset-0 w-full h-full object-cover rounded-xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYB3PbAClabbSeyeYt8cbrLZREHl7wVDDVnTZig7mZipc7Gn01LgZ0QWfL_rz1SrCTMoEN-tErZv0aRTTenWRhU2_dIUT_1KZG-_ns9mNE-pbTdey7EdO0mvNNoSCgN0o9u1XtNWuaNc4XnU9A__i8e06L_Qv5K_0VFVHiQFg2ahof-BNKvRgCu0iGXN-FITRtgB28lhW6B1yOT3RIrlPsFqBfIotLqtVwEWYb5hrZrZ8NrZAykKpgQAf7l60xagFNh7QfW8EaD8Y" alt="Support" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sections: Dual Column */}
            <section className="max-w-[1440px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Quick Courses (Left Column) */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Quick Courses</h2>
                            <span className="font-berkeley-mono text-xs text-on-surface-variant uppercase">Active Enrollment</span>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 ghost-border hover:bg-surface-container-high transition-colors cursor-pointer">
                                <div className="w-12 h-12 bg-primary-container/20 rounded-lg flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">code</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-semibold">Advanced Systems Design</h4>
                                    <p className="text-on-surface-variant text-sm">Unit 04: Distributed Ledger Technology</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-berkeley-mono text-xs text-primary">84%</span>
                                </div>
                            </div>
                            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 ghost-border hover:bg-surface-container-high transition-colors cursor-pointer">
                                <div className="w-12 h-12 bg-secondary-container/20 rounded-lg flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">architecture</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-semibold">Urban Ecology & Planning</h4>
                                    <p className="text-on-surface-variant text-sm">Unit 12: Vertical Farming Architecture</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-berkeley-mono text-xs text-secondary">42%</span>
                                </div>
                            </div>
                            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 ghost-border hover:bg-surface-container-high transition-colors cursor-pointer">
                                <div className="w-12 h-12 bg-tertiary-container/20 rounded-lg flex items-center justify-center text-tertiary">
                                    <span className="material-symbols-outlined">psychology</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-semibold">Cognitive Neurobiology</h4>
                                    <p className="text-on-surface-variant text-sm">Unit 09: Neural Plasticity Models</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-berkeley-mono text-xs text-tertiary">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campus Services (Right Column) */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Campus Services</h2>
                            <span className="font-berkeley-mono text-xs text-on-surface-variant uppercase">Global Directory</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-surface-container-low p-6 rounded-xl ghost-border hover:bg-surface-container-high transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-on-surface-variant mb-4">local_library</span>
                                <h4 className="text-white font-semibold mb-1">Central Library</h4>
                                <p className="text-on-surface-variant text-xs">Reserve study pods or digital archives.</p>
                            </div>
                            <div className="bg-surface-container-low p-6 rounded-xl ghost-border hover:bg-surface-container-high transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-on-surface-variant mb-4">fitness_center</span>
                                <h4 className="text-white font-semibold mb-1">Sports Complex</h4>
                                <p className="text-on-surface-variant text-xs">Book courts or check gym capacity.</p>
                            </div>
                            <div className="bg-surface-container-low p-6 rounded-xl ghost-border hover:bg-surface-container-high transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-on-surface-variant mb-4">restaurant</span>
                                <h4 className="text-white font-semibold mb-1">Dining Hall</h4>
                                <p className="text-on-surface-variant text-xs">Live menu and table availability.</p>
                            </div>
                            <div className="bg-surface-container-low p-6 rounded-xl ghost-border hover:bg-surface-container-high transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-on-surface-variant mb-4">medical_services</span>
                                <h4 className="text-white font-semibold mb-1">Health Center</h4>
                                <p className="text-on-surface-variant text-xs">Schedule walk-ins or vaccinations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </motion.main>
    );
};

export default Portal;
