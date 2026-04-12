import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '../lib/animations';

const COURSES = [
  {
    code: "CS-402", badge: "New", badgeColor: "bg-secondary/10 text-secondary",
    title: "Neural Network Architectures",
    desc: "Advanced exploration of transformer models, convolutional layers, and deep RL heuristics.",
    instructor: "Dr. Elena Vance",
    schedule: "MWF 10:00 AM", credits: "3 Credits",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9m0jFv_3RCtOQqPJXlysf2An2nQKaYx2qDf9REvJTx8kDZGA8p04xdfJayELeWLlK9noeevq5P0RBdi5jrkmA6mE5oc4BXDbkiFmDxwJHaVgxxxJOZ2yw76tUnjoOH7WPAUvqic7jVvWJ-jgSvlPX0uxF-JXzf1oo0Dza3VZh0FMY2FPggJ18iiHfNBktGJMp7GhvUNmebRHn2M_-GPOZvdSAuk9ZjWTwiHZCLvIS3xhHAPAQOy-xLgim4G80wESGef3b9zkix2o",
  },
  {
    code: "DS-210", badge: "Popular", badgeColor: "bg-secondary/10 text-secondary",
    title: "Predictive Campus Analytics",
    desc: "Using real-time telemetry data to predict urban campus flow and resource allocation.",
    instructor: "Sarah Jenkins",
    schedule: "TTH 02:30 PM", credits: "4 Credits",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0QDyXihKPprGoYUhe-yfzNOJnFCaXcgmd4f4ZEpbZrmlvozPgVGKSCAAaaWllu9ByNorAUOG7KQ4E9Eym6i-MfpMvHo3-rzjmnWvUQSK7ScxsVihov_fisgWZaDWJiNy5vaTY6NsJ8jTyqLBNHxHiODFbkwJASu7FM-fggjZ17v4zT1L1IPr-DrYk5MR0wkIZkYEp6fm3RVI7YmGUvZ2yCMPlPq2PhBhCOT3bey3tQVynyItQF8xfO3g0KntvlWCG4Zb9Slfpge0",
  },
  {
    code: "AI-550", badge: "", badgeColor: "",
    title: "Ethical AI Systems",
    desc: "Examining bias, transparency, and governance in large-scale autonomous deployments.",
    instructor: "Prof. Marcus Thorne",
    schedule: "FRI 09:00 AM", credits: "2 Credits",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNaF28Sz7ITJ8sinOsSs5TjbwYIaRF70aA1EyFeJx7uGkkdEECWggvHWHFjZmhCuXzvwHMC7D7YOMaM4YFdDsWjjdGi1QKszkqpjPh_qQPO_u0mJWdXiQiTBEGtgLcCdma_X4YOEy_UGX3R4n6H7uYLkXAj6iyw1qeg_2Ggc4FfUzBBB-N8dvk1QtVzIssRTU9B7eIxcURISfg6ojhW0tZfzl4ut0UJrbrNafCPKR5EuXVfJ2PMugKT8mqq94DaeD2H9tbJS9poi8",
  },
  {
    code: "PH-105", badge: "New", badgeColor: "bg-secondary/10 text-secondary",
    title: "Quantum Mechanics for Devs",
    desc: "A bridge between classical physics and the emerging field of quantum computation.",
    instructor: "Dr. Li Wei",
    schedule: "MWF 11:30 AM", credits: "4 Credits",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAOm5rjWeeP4ttTjcKEp11Gezjt1ycSxT9CI0ViHftw0UDmCD0UH6xZA_TY0yLH0yGDl91rW202aBktsOYU4apubfollIsiz6GcX3F0RU4mtdrJEai5k4F5dgIDu4OUtDWOAO1gU_6f4yI-gW_FbGqEHzlRtenP2nN3RAaSGAqVeKFSwz17P98F5AdDbJA0647qT2R_nzEXj6XgrkyzVnMcv9VZHRZkteq5J1Tkle8QufiGEv6CdvXnu4eoPo0YuCjVYx5uMF69dk",
  },
  {
    code: "CS-101", badge: "", badgeColor: "",
    title: "Foundations of Computation",
    desc: "The essential introduction to logic, algorithms, and systematic problem solving.",
    instructor: "Arthur Moore",
    schedule: "TTH 09:00 AM", credits: "4 Credits",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1ELZZSz5nIvnTTKPOQmEv1y40az-MZn8rPpTfgRGIDcK2wRaaBQsrqmOqxUF0oeV6m3tXjo_beKyvg-lilhA0KK6cHPHlrsQK5BGTAuCxTxDdgp8Ud5mlY_qj8STZOVkVN2ImQnlYvCtUjxExNsZHNAi3njubZmuBH2X58tBxWtleNb-EH1rpsven7se6IBV71goYBTGhuNRPCXSeJe2X-KOhOsA4zI256-Sy_E3pMV8dM8z_jQNX81iwSgAkXSIZ-BzYlhN_h_E",
  },
  {
    code: "DES-302", badge: "Popular", badgeColor: "bg-secondary/10 text-secondary",
    title: "Interface Philosophy",
    desc: "Theoretical approaches to high-end digital environments and human-computer interaction.",
    instructor: "Jules Sterling",
    schedule: "WED 04:00 PM", credits: "3 Credits",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn8-p_KJm1gQ8bX8y2qEshfslscF6O8sQLVr5qkFpgm4xXGOpP5Oy-Qrk8CuuTHs2rdybhxISqitDn626RHcntc_nESkWTX2gGkE9aqeBU9xc0nuv0GGKraCz-ZkstI4P5D7y7e_tg4zeooYK7-fdqXEZxkYZSimLkU_cSiy1yq_vdLXHkdOYXYgElladIm0VzasMn3kkP3qzxQp8b0YnxehfZufAz0bVIwTRW36BUKUWcTYR2P4_4QFlyFBJAPzDBpNs8lVfBRUI",
  },
];

const Courses = () => {
  return (
    <motion.main
      {...pageTransition}
      className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto"
    >
      {/* Hero Section */}
      <motion.section
        {...fadeUp}
        className="mb-16"
      >
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 font-satoshi">
            Expand your <span className="text-primary">intelligence</span> footprint.
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Access the complete directory of next-generation curriculum. From Quantum Computing to Ethical AI, browse our specialized campus offerings.
          </p>
          <div className="relative max-w-2xl group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-high border-none rounded-lg pl-12 pr-4 py-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              placeholder="Search by course name, code, or instructor..."
              type="text"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium text-outline bg-surface-container rounded border border-outline-variant/20">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <motion.aside
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full lg:w-64 flex-shrink-0"
        >
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-outline mb-4">Departments</h3>
              <div className="space-y-2">
                {['Computer Science', 'Data Science', 'Artificial Intelligence', 'Physics & Math', 'Creative Technology'].map((dept, i) => (
                  <label key={dept} className="flex items-center gap-3 group cursor-pointer">
                    <input defaultChecked={i === 1} className="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary/20" type="checkbox" />
                    <span className={`text-sm transition-colors ${i === 1 ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{dept}</span>
                  </label>
                ))}
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
        </motion.aside>

        {/* Grid Content */}
        <div className="flex-grow">
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {COURSES.map((course) => (
              <motion.div
                key={course.code}
                {...staggerItem}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-colors duration-300 group rounded-lg cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-primary font-medium">{course.code}</span>
                    {course.badge && (
                      <span className={`${course.badgeColor} text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider`}>{course.badge}</span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">{course.title}</h2>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">{course.desc}</p>
                </div>
                <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src={course.avatar} />
                    <span className="text-xs text-on-surface font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {course.schedule}</span>
                    <span>{course.credits}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default Courses;
