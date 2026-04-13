import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import api from '../lib/api';

const CATEGORY_ICON = {
  hackathon: 'code', workshop: 'build', keynote: 'mic', symposium: 'groups',
  networking: 'hub', sports: 'sports_soccer', cultural: 'celebration',
  academic: 'school', 'open-house': 'home', other: 'event',
};

const CATEGORY_GRADIENT = {
  hackathon: 'from-blue-900/50 to-blue-900/20',
  workshop: 'from-purple-900/50 to-purple-900/20',
  keynote: 'from-amber-900/50 to-amber-900/20',
  sports: 'from-green-900/50 to-green-900/20',
  cultural: 'from-pink-900/50 to-pink-900/20',
  academic: 'from-indigo-900/50 to-indigo-900/20',
};

const Home = () => {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    api.get('/api/courses').then((r) => setFeaturedCourses(Array.isArray(r.data) ? r.data.slice(0, 3) : [])).catch(() => {});
    api.get('/api/events').then((r) => setUpcomingEvents(Array.isArray(r.data) ? r.data.slice(0, 4) : [])).catch(() => {});
  }, []);
  return (
    <motion.main
      {...pageTransition}
      className="min-h-screen"
    >
      {/* ─── Hero ─── */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low ghost-border rounded-full text-primary text-xs font-berkeley-mono uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Nex Campus OS v2.4 Now Live
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-white font-satoshi"
            >
              Nex Campus, coordinated like a{' '}
              <span className="gradient-text">living system</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-xl text-on-surface-variant max-w-xl leading-relaxed"
            >
              The product development system for teams and agents. Integrate campus operations, academic tracking, and facility management into a monolithic intelligent workspace.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={() => navigate('/portal')} className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2">
                Enter the Portal
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button onClick={() => navigate('/courses')} className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg ghost-border hover:bg-surface-variant hover:scale-[1.02] transition-all duration-200">
                View Documentation
              </button>
            </motion.div>
          </div>
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass-panel ghost-border rounded-xl p-6 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-xs font-berkeley-mono text-outline mb-1 uppercase tracking-widest">Live Capacity</p>
                  <h3 className="text-2xl font-bold tracking-tighter">Main Plaza</h3>
                </div>
                <div className="text-right">
                  <p className="text-primary font-berkeley-mono text-xl font-bold">84%</p>
                  <p className="text-[10px] text-outline">OCCUPANCY</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-24 w-full bg-surface-container-lowest rounded-lg overflow-hidden flex items-end gap-1 p-2">
                  <div className="bg-primary/20 w-full h-[40%] rounded-t-sm"></div>
                  <div className="bg-primary/30 w-full h-[60%] rounded-t-sm"></div>
                  <div className="bg-primary/40 w-full h-[55%] rounded-t-sm"></div>
                  <div className="bg-primary/50 w-full h-[80%] rounded-t-sm"></div>
                  <div className="bg-primary w-full h-[95%] rounded-t-sm"></div>
                  <div className="bg-primary/70 w-full h-[70%] rounded-t-sm"></div>
                  <div className="bg-primary/40 w-full h-[45%] rounded-t-sm"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface-container-lowest rounded-lg ghost-border">
                    <p className="text-[10px] text-outline font-berkeley-mono uppercase">Energy Efficiency</p>
                    <p className="text-lg font-bold text-secondary">A+ High</p>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-lg ghost-border">
                    <p className="text-[10px] text-outline font-berkeley-mono uppercase">Next Event</p>
                    <p className="text-lg font-bold">Tech Summit</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 blur-[100px] -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid Feature Section ─── */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp}
            className="mb-16 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 font-satoshi">A new species of campus tool</h2>
            <p className="text-on-surface-variant text-lg">Engineered for high-performance universities who demand precision in every interaction.</p>
          </motion.div>
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto lg:h-[700px]"
          >
            {/* Large Bento Item */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden ghost-border flex flex-col hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-300"
            >
              <div className="p-8">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">architecture</span>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Unified Infrastructure</h3>
                <p className="text-on-surface-variant max-w-md">Real-time synchronization across every department, facility, and student touchpoint.</p>
              </div>
              <div className="mt-auto flex-1 bg-gradient-to-t from-primary/5 to-transparent flex items-center justify-center p-8">
                <img alt="Infrastructure Visualization" className="rounded-lg ghost-border w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyGkycWpK_WR53-_6FDGM-PlLbTZ3LAvn5zoQ_QPn0b-fTnHSDaYrAwc84KG0hdhWvsNgsG-9HdQQO1Pu591I9J0yIpxXlK1vbJR9y4vv51e3ygIahl3buYrIEmREcr4RyK8Pab2M8YSYoLdklFd7D9BYptDUcze-irq9w0FiK0dxjul-b_OPlfZUzVOWUQMVy9Y9wmZxWmMbGFSDL819GdaWRDi9OCiwo1B4JwaA_PXz6yy59pe4aMtALZt7peEzWViIBa8xd_m4" />
              </div>
            </motion.div>

            {/* Vertical Bento Item */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:col-span-4 bg-surface-container-high rounded-xl p-8 ghost-border relative overflow-hidden hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-300"
            >
              <div className="relative z-10 h-full flex flex-col">
                <span className="material-symbols-outlined text-secondary mb-4 text-3xl">bolt</span>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Instant Operations</h3>
                <p className="text-on-surface-variant mb-8">Deploy resources with zero latency. If it happens on campus, it happens in Nex.</p>
                <div className="mt-auto space-y-4">
                  <div className="bg-surface-container-lowest p-4 rounded-lg ghost-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-berkeley-mono text-outline">CPU LOAD</span>
                      <span className="text-xs font-berkeley-mono text-primary">12%</span>
                    </div>
                    <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[12%]"></div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-lg ghost-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-berkeley-mono text-outline">NETWORK</span>
                      <span className="text-xs font-berkeley-mono text-secondary">STABLE</span>
                    </div>
                    <div className="flex gap-1 h-4 items-end">
                      <div className="w-1 bg-secondary h-full"></div>
                      <div className="w-1 bg-secondary h-[80%]"></div>
                      <div className="w-1 bg-secondary h-[90%]"></div>
                      <div className="w-1 bg-secondary h-[100%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Horizontal Bento Item 1 */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:col-span-5 bg-surface-container-high rounded-xl p-8 ghost-border flex items-center gap-6 hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-300"
            >
              <div className="w-1/2">
                <h3 className="text-xl font-bold tracking-tight mb-2">Smart Facilities</h3>
                <p className="text-sm text-on-surface-variant">IoT-enabled room booking and maintenance.</p>
              </div>
              <div className="w-1/2 h-32 bg-surface-container-lowest rounded-lg overflow-hidden">
                <img alt="Facilities" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKrfBbN54AyTW2DZUz2sMXV7HZXPzVGxrFzMp-puBlSUTwW5VYbzC_1hBdGPOjUStc1jS9S5Ak5UZGSRe6E6ZqOgXMPh2X7M0WNMdbHml9gPM_AFg3CopPhgAijfz2AaM65en4BkD2QL1uVuJDoYzf-4GU9cQqI9EbafEHo-74C_ZBgTJgXwHBRKoxnGkmXuTI5j3MofWXXb92BVvE4JBFnCuMzZ8gIG8z_h3dbzBRQixRgVYW-FCohtigrEdL9FsNfiJ5HpdVQl0" />
              </div>
            </motion.div>

            {/* Horizontal Bento Item 2 */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:col-span-7 bg-primary text-on-primary rounded-xl p-8 flex justify-between items-center relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-300"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Academic Core</h3>
                <p className="text-on-primary/80 max-w-xs">Track progress, manage courses, and facilitate research in one fluid view.</p>
              </div>
              <span className="material-symbols-outlined text-8xl opacity-10 absolute -right-4 -bottom-4 rotate-12 group-hover:rotate-0 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <button onClick={() => navigate('/portal')} className="relative z-10 bg-on-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-white hover:scale-[1.02] transition-all duration-200">Launch Core</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Self-Driving Operations ─── */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 border-[1px] border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-12 border-[1px] border-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-24 border-[1px] border-primary/10 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-panel p-8 rounded-full ghost-border flex flex-col items-center">
                  <span className="text-4xl font-berkeley-mono font-bold text-white mb-2">99.8%</span>
                  <span className="text-[10px] font-berkeley-mono text-outline tracking-[0.2em] uppercase">Autonomous</span>
                </div>
              </div>
              <div className="absolute top-0 right-10 bg-surface-container-high ghost-border px-4 py-2 rounded-lg text-xs font-berkeley-mono text-primary shadow-xl">
                NODE_ALPHA_ACTIVE
              </div>
              <div className="absolute bottom-20 left-0 bg-surface-container-high ghost-border px-4 py-2 rounded-lg text-xs font-berkeley-mono text-secondary shadow-xl">
                SYNC_PROTOCOL_V2
              </div>
            </div>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-1 lg:order-2 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-satoshi">Make campus operations self-driving</h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              Nex Campus employs advanced algorithmic agents to handle scheduling, energy optimization, and security protocols automatically.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary ghost-border">
                  <span className="material-symbols-outlined">auto_graph</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Predictive Resource Loading</h4>
                  <p className="text-on-surface-variant text-sm">Anticipate student needs before bottlenecks occur using historical flow data.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary ghost-border">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Neural Academic Routing</h4>
                  <p className="text-on-surface-variant text-sm">Match students with optimal learning resources based on individual progress maps.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ─── Featured Grid Sections ─── */}
      <section className="py-24 px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto space-y-32">

          {/* Featured Courses */}
          <div>
            <motion.div
              {...fadeUp}
              className="flex justify-between items-end mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-satoshi">Featured Courses</h2>
                <p className="text-on-surface-variant">The frontiers of knowledge, delivered via the OS.</p>
              </div>
              <button onClick={() => navigate('/courses')} className="text-primary hover:underline font-semibold flex items-center gap-1 hover:scale-[1.02] transition-transform duration-200">
                Explore Catalog
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </motion.div>
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {featuredCourses.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl animate-pulse">
                    <div className="aspect-[16/10] bg-surface-container-low rounded-xl mb-4"></div>
                    <div className="h-5 w-2/3 bg-surface-container-high rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-surface-container-high rounded"></div>
                  </div>
                ))
                : featuredCourses.map((course) => (
                <motion.div
                  key={course._id}
                  {...staggerItem}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="group cursor-pointer hover:shadow-xl hover:shadow-black/20 rounded-xl transition-shadow duration-300"
                  onClick={() => navigate('/courses')}
                >
                  <div className="aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden mb-4 ghost-border flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-outline text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">{course.code}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-on-surface-variant">{course.instructor} · {course.credits} Credits</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Facilities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              {...fadeUp}
              className="lg:col-span-5 space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white font-satoshi">Facilities engineered for the future</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Our campus is a collection of high-performance environments, from zero-latency labs to bioclimatic social hubs, all connected via the Nex network.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-high rounded-lg ghost-border">
                  <p className="text-primary font-berkeley-mono text-xl mb-1">42</p>
                  <p className="text-[10px] text-outline uppercase tracking-widest">Active Labs</p>
                </div>
                <div className="p-4 bg-surface-container-high rounded-lg ghost-border">
                  <p className="text-secondary font-berkeley-mono text-xl mb-1">2.4k</p>
                  <p className="text-[10px] text-outline uppercase tracking-widest">Smart Hubs</p>
                </div>
              </div>
              <button onClick={() => navigate('/facilities')} className="bg-surface-container-high text-white px-6 py-3 rounded-lg font-bold ghost-border w-full hover:bg-surface-variant hover:scale-[1.02] transition-all duration-200">Explore Campus Map</button>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-7"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <img alt="Library" className="rounded-xl ghost-border w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBzUqpGQAQXQQLDqMDTRr9x7mG57L7Vsw4jFwaTH0ZbaUUbu-jEkhN_rorOgcxVaD1N15akyHFYl36okrIW5lhNbr9_KI7b5Q-BAvCwQoYUMk3IHcoHE2j1by6PjnJboa9i9gW9tpn94-4J8klK0f5wGaanmswzqOoRVV-BiO_KwFAf_nR1jMSDYYkXS8yGa869FJAv-DZIXj1diKqOQAlLg76udxLYgLoI_5ClslExiEFMZYB9unHJRBfbsh-NLpU0H_XuKrKZk8" />
                  <img alt="Engineering Lab" className="rounded-xl ghost-border w-full aspect-video object-cover grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyXVbyaqQGheduA_MhGOWZ8ph_djwNlGUXOBeowCMVA6I25CqZ_22HgFIvxt5Z_b4IX--MSWPs02tVY5TORhaxI9SGOhnkzJYZQ5JJY8DT2QDIEFFxNND5SGggeQRlbmtyXIDbvoejBBGxmCX9msIibkGbhXZeFaA6fn6EteXUm_EVyHnAyqqCG6p7VdP-MQ5_Z3P5lkfWKqcbJD-emWBkfLDPSm43m96WrpgJt0CWzu-sRX1d29ZbVSVouo0khbF3DZv0KbcAQc8" />
                </div>
                <div className="space-y-4">
                  <img alt="Social Hub" className="rounded-xl ghost-border w-full aspect-square object-cover grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLK09EwdE4QjWDA52SA7bacRwF2M9zAbXsMoImClAAlc6j-cniRP4NOvyTrNErDaDweUoL433ErXErPT-nBBWn796OuBbSUsOcXyJNj9ytf-jK3Hal7UufEzHD1TrQGc4tYFlebrD-Va6VksSyxzFbiWqX56kIMW_41IJ9TpAFIQ3rdpUMQPkcp3k7Cr1ladQPe9cG4yTthZ5NTMqWqOjZfDZ0MUBb1rX39bgj1s32qNLTlMFk4sBkx7lJ0mogOhjoCWUGYhzBS8M" />
                  <img alt="Data Center" className="rounded-xl ghost-border w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClv4Di6ppD1zK66m1YvRfRdjqNaV-HIiKqmlbbXj8qaLTAU9f9hyg94LfLOZGUqlihxyGdPWN0gM7hkgV6m7VGg0ErHSQRIVnUkQ5JyAiATzW0Qmv5yTDGlXjYBAitguQiyTU60_GPH2JcR-3D3Znhp0kX6wcd-DDqZa3GIC3pCjdh8uHIUw9657KiaQfhahaX-PzRTkg0zJLHho_6eT9-BcJoqiM25TovFUr00FUf2SGoeNy3NLyuNH8bsMFAU0DAOYc-nDtM1YI" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Events Horizontal Scroller ─── */}
      <section className="px-6 py-24 pb-0 max-w-7xl mx-auto">
        <motion.h2
          {...fadeUp}
          className="text-3xl font-bold tracking-tight text-white mb-12 font-satoshi"
        >
          Upcoming Events
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide no-scrollbar"
        >
          {upcomingEvents.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden ghost-border animate-pulse">
                <div className="h-40 bg-surface-container-highest"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 w-2/3 bg-surface-container-highest rounded"></div>
                  <div className="h-3 w-full bg-surface-container-highest rounded"></div>
                  <div className="h-3 w-1/2 bg-surface-container-highest rounded"></div>
                </div>
              </div>
            ))
            : upcomingEvents.map((event, i) => {
              const d = event.date ? new Date(event.date) : null;
              const dateLabel = d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : '';
              const icon = CATEGORY_ICON[event.category] || 'event';
              const gradient = CATEGORY_GRADIENT[event.category] || 'from-primary/20 to-primary/5';
              return (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden ghost-border group cursor-pointer hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-500"
              onClick={() => navigate('/events')}
            >
              <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out`}>
                <span className="material-symbols-outlined text-white/20 text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-berkeley-mono px-2 py-1 rounded">{dateLabel}</div>
                {event.status === 'past' && (
                  <div className="absolute top-4 right-4 bg-surface-container-high/80 text-outline text-[10px] font-mono px-2 py-0.5 rounded uppercase">Past</div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-berkeley-mono text-outline">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {event.location || 'CBIT Kolar'}
                </div>
              </div>
            </motion.div>
            );})}
        </motion.div>
      </section>

      {/* ─── CTA Section ─── */}
      <motion.section
        {...fadeUp}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl p-12 text-center ghost-border relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tighter text-white mb-6 font-satoshi">Ready to upgrade your campus experience?</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto">Join thousands of students and faculty members who are already navigating the future of education on Nex Campus.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={() => navigate('/signup')} className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:scale-[1.02] hover:brightness-110 transition-all duration-200">Get Started Free</button>
              <button onClick={() => navigate('/portal')} className="bg-surface-container-high text-white px-8 py-3 rounded-lg font-bold ghost-border hover:bg-surface-variant hover:scale-[1.02] transition-all duration-200">Request Demo</button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Home;
