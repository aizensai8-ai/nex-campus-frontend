import { motion } from 'framer-motion';

const Courses = () => {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto"
        >
            {/* Hero Section */}
            <section className="mb-16">
                <div className="max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 font-headline">
                        Expand your <span className="text-primary">intelligence</span> footprint.
                    </h1>
                    <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                        Access the complete directory of next-generation curriculum. From Quantum Computing to Ethical AI, browse our specialized campus offerings.
                    </p>
                    {/* Search Bar */}
                    <div className="relative max-w-2xl group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                        <input className="w-full bg-surface-container-high border-none rounded-lg pl-12 pr-4 py-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="Search by course name, code, or instructor..." type="text" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium text-outline bg-surface-container rounded border border-outline-variant/20">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="sticky top-28 space-y-8">
                        <div>
                            <h3 className="text-xs font-mono uppercase tracking-widest text-outline mb-4">Departments</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 group cursor-pointer">
                                    <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary/20" type="checkbox" />
                                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Computer Science</span>
                                </label>
                                <label className="flex items-center gap-3 group cursor-pointer">
                                    <input defaultChecked className="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary/20" type="checkbox" />
                                    <span className="text-sm text-on-surface transition-colors">Data Science</span>
                                </label>
                                <label className="flex items-center gap-3 group cursor-pointer">
                                    <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary/20" type="checkbox" />
                                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Artificial Intelligence</span>
                                </label>
                                <label className="flex items-center gap-3 group cursor-pointer">
                                    <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary/20" type="checkbox" />
                                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Physics & Math</span>
                                </label>
                                <label className="flex items-center gap-3 group cursor-pointer">
                                    <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary/20" type="checkbox" />
                                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Creative Technology</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-mono uppercase tracking-widest text-outline mb-4">Status</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-xs rounded hover:bg-surface-variant cursor-pointer transition-colors">All</span>
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded cursor-pointer transition-colors">New Offerings</span>
                                <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-xs rounded hover:bg-surface-variant cursor-pointer transition-colors">Popular</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Grid Content */}
                <div className="flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Course Card 1 */}
                        <div className="course-card-border outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 group rounded-lg">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-mono text-xs text-primary font-medium">CS-402</span>
                                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">Neural Network Architectures</h2>
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">Advanced exploration of transformer models, convolutional layers, and deep RL heuristics.</p>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                                <div className="flex items-center gap-3">
                                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9m0jFv_3RCtOQqPJXlysf2An2nQKaYx2qDf9REvJTx8kDZGA8p04xdfJayELeWLlK9noeevq5P0RBdi5jrkmA6mE5oc4BXDbkiFmDxwJHaVgxxxJOZ2yw76tUnjoOH7WPAUvqic7jVvWJ-jgSvlPX0uxF-JXzf1oo0Dza3VZh0FMY2FPggJ18iiHfNBktGJMp7GhvUNmebRHn2M_-GPOZvdSAuk9ZjWTwiHZCLvIS3xhHAPAQOy-xLgim4G80wESGef3b9zkix2o" />
                                    <span className="text-xs text-on-surface font-medium">Dr. Elena Vance</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> MWF 10:00 AM</span>
                                    <span>3 Credits</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="course-card-border outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 group rounded-lg">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-mono text-xs text-primary font-medium">DS-210</span>
                                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Popular</span>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">Predictive Campus Analytics</h2>
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">Using real-time telemetry data to predict urban campus flow and resource allocation.</p>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                                <div className="flex items-center gap-3">
                                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0QDyXihKPprGoYUhe-yfzNOJnFCaXcgmd4f4ZEpbZrmlvozPgVGKSCAAaaWllu9ByNorAUOG7KQ4E9Eym6i-MfpMvHo3-rzjmnWvUQSK7ScxsVihov_fisgWZaDWJiNy5vaTY6NsJ8jTyqLBNHxHiODFbkwJASu7FM-fggjZ17v4zT1L1IPr-DrYk5MR0wkIZkYEp6fm3RVI7YmGUvZ2yCMPlPq2PhBhCOT3bey3tQVynyItQF8xfO3g0KntvlWCG4Zb9Slfpge0" />
                                    <span className="text-xs text-on-surface font-medium">Sarah Jenkins</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> TTH 02:30 PM</span>
                                    <span>4 Credits</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 3 */}
                        <div className="course-card-border outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 group rounded-lg">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-mono text-xs text-primary font-medium">AI-550</span>
                                    <span></span>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">Ethical AI Systems</h2>
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">Examining bias, transparency, and governance in large-scale autonomous deployments.</p>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                                <div className="flex items-center gap-3">
                                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNaF28Sz7ITJ8sinOsSs5TjbwYIaRF70aA1EyFeJx7uGkkdEECWggvHWHFjZmhCuXzvwHMC7D7YOMaM4YFdDsWjjdGi1QKszkqpjPh_qQPO_u0mJWdXiQiTBEGtgLcCdma_X4YOEy_UGX3R4n6H7uYLkXAj6iyw1qeg_2Ggc4FfUzBBB-N8dvk1QtVzIssRTU9B7eIxcURISfg6ojhW0tZfzl4ut0UJrbrNafCPKR5EuXVfJ2PMugKT8mqq94DaeD2H9tbJS9poi8" />
                                    <span className="text-xs text-on-surface font-medium">Prof. Marcus Thorne</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> FRI 09:00 AM</span>
                                    <span>2 Credits</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 4 */}
                        <div className="course-card-border outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 group rounded-lg">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-mono text-xs text-primary font-medium">PH-105</span>
                                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">Quantum Mechanics for Devs</h2>
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">A bridge between classical physics and the emerging field of quantum computation.</p>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                                <div className="flex items-center gap-3">
                                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAOm5rjWeeP4ttTjcKEp11Gezjt1ycSxT9CI0ViHftw0UDmCD0UH6xZA_TY0yLH0yGDl91rW202aBktsOYU4apubfollIsiz6GcX3F0RU4mtdrJEai5k4F5dgIDu4OUtDWOAO1gU_6f4yI-gW_FbGqEHzlRtenP2nN3RAaSGAqVeKFSwz17P98F5AdDbJA0647qT2R_nzEXj6XgrkyzVnMcv9VZHRZkteq5J1Tkle8QufiGEv6CdvXnu4eoPo0YuCjVYx5uMF69dk" />
                                    <span className="text-xs text-on-surface font-medium">Dr. Li Wei</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> MWF 11:30 AM</span>
                                    <span>4 Credits</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 5 */}
                        <div className="course-card-border outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 group rounded-lg">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-mono text-xs text-primary font-medium">CS-101</span>
                                    <span></span>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">Foundations of Computation</h2>
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">The essential introduction to logic, algorithms, and systematic problem solving.</p>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                                <div className="flex items-center gap-3">
                                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ELZZSz5nIvnTTKPOQmEv1y40az-MZn8rPpTfgRGIDcK2wRaaBQsrqmOqxUF0oeV6m3tXjo_beKyvg-lilhA0KK6cHPHlrsQK5BGTAuCxTxDdgp8Ud5mlY_qj8STZOVkVN2ImQnlYvCtUjxExNsZHNAi3njubZmuBH2X58tBxWtleNb-EH1rpsven7se6IBV71goYBTGhuNRPCXSeJe2X-KOhOsA4zI256-Sy_E3pMV8dM8z_jQNX81iwSgAkXSIZ-BzYlhN_h_E" />
                                    <span className="text-xs text-on-surface font-medium">Arthur Moore</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> TTH 09:00 AM</span>
                                    <span>4 Credits</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 6 */}
                        <div className="course-card-border outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 group rounded-lg">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-mono text-xs text-primary font-medium">DES-302</span>
                                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Popular</span>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">Interface Philosophy</h2>
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">Theoretical approaches to high-end digital environments and human-computer interaction.</p>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                                <div className="flex items-center gap-3">
                                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn8-p_KJm1gQ8bX8y2qEshfslscF6O8sQLVr5qkFpgm4xXGOpP5Oy-Qrk8CuuTHs2rdybhxISqitDn626RHcntc_nESkWTX2gGkE9aqeBU9xc0nuv0GGKraCz-ZkstI4P5D7y7e_tg4zeooYK7-fdqXEZxkYZSimLkU_cSiy1yq_vdLXHkdOYXYgElladIm0VzasMn3kkP3qzxQp8b0YnxehfZufAz0bVIwTRW36BUKUWcTYR2P4_4QFlyFBJAPzDBpNs8lVfBRUI" />
                                    <span className="text-xs text-on-surface font-medium">Jules Sterling</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> WED 04:00 PM</span>
                                    <span>3 Credits</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.main>
    );
};

export default Courses;
