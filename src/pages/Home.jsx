import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low ghost-border rounded-full text-primary text-xs font-berkeley-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Nex Campus OS v2.4 Now Live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-white">
              Nex Campus, coordinated like a <span className="text-primary">living system</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
              The product development system for teams and agents. Integrate campus operations, academic tracking, and facility management into a monolithic intelligent workspace.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all flex items-center gap-2">
                Enter the Portal
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg ghost-border hover:bg-surface-variant transition-all">
                View Documentation
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            {/* Dashboard Widget Hero */}
            <div className="glass-panel ghost-border rounded-xl p-6 shadow-2xl relative z-10">
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
            </div>
            {/* Decorative back elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
            <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 blur-[100px] -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">A new species of campus tool</h2>
            <p className="text-on-surface-variant text-lg">Engineered for high-performance universities who demand precision in every interaction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto lg:h-[700px]">
            {/* Large Bento Item */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden ghost-border flex flex-col">
              <div className="p-8">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">architecture</span>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Unified Infrastructure</h3>
                <p className="text-on-surface-variant max-w-md">Real-time synchronization across every department, facility, and student touchpoint.</p>
              </div>
              <div className="mt-auto flex-1 bg-gradient-to-t from-primary/5 to-transparent flex items-center justify-center p-8">
                <img alt="Infrastructure Visualization" className="rounded-lg ghost-border w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyGkycWpK_WR53-_6FDGM-PlLbTZ3LAvn5zoQ_QPn0b-fTnHSDaYrAwc84KG0hdhWvsNgsG-9HdQQO1Pu591I9J0yIpxXlK1vbJR9y4vv51e3ygIahl3buYrIEmREcr4RyK8Pab2M8YSYoLdklFd7D9BYptDUcze-irq9w0FiK0dxjul-b_OPlfZUzVOWUQMVy9Y9wmZxWmMbGFSDL819GdaWRDi9OCiwo1B4JwaA_PXz6yy59pe4aMtALZt7peEzWViIBa8xd_m4"/>
              </div>
            </div>
            
            {/* Vertical Bento Item */}
            <div className="md:col-span-4 bg-surface-container-high rounded-xl p-8 ghost-border relative overflow-hidden">
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
            </div>

            {/* Horizontal Bento Item 1 */}
            <div className="md:col-span-5 bg-surface-container-high rounded-xl p-8 ghost-border flex items-center gap-6">
              <div class="w-1/2">
                <h3 class="text-xl font-bold tracking-tight mb-2">Smart Facilities</h3>
                <p class="text-sm text-on-surface-variant">IoT-enabled room booking and maintenance.</p>
              </div>
              <div class="w-1/2 h-32 bg-surface-container-lowest rounded-lg overflow-hidden">
                <img alt="Facilities" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKrfBbN54AyTW2DZUz2sMXV7HZXPzVGxrFzMp-puBlSUTwW5VYbzC_1hBdGPOjUStc1jS9S5Ak5UZGSRe6E6ZqOgXMPh2X7M0WNMdbHml9gPM_AFg3CopPhgAijfz2AaM65en4BkD2QL1uVuJDoYzf-4GU9cQqI9EbafEHo-74C_ZBgTJgXwHBRKoxnGkmXuTI5j3MofWXXb92BVvE4JBFnCuMzZ8gIG8z_h3dbzBRQixRgVYW-FCohtigrEdL9FsNfiJ5HpdVQl0"/>
              </div>
            </div>
            
            {/* Horizontal Bento Item 2 */}
            <div className="md:col-span-7 bg-primary text-on-primary rounded-xl p-8 flex justify-between items-center relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Academic Core</h3>
                <p className="text-on-primary/80 max-w-xs">Track progress, manage courses, and facilitate research in one fluid view.</p>
              </div>
              <span className="material-symbols-outlined text-8xl opacity-10 absolute -right-4 -bottom-4 rotate-12 group-hover:rotate-0 transition-transform duration-500" style={{fontVariationSettings: "'FILL' 1"}}>school</span>
              <button className="relative z-10 bg-on-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors">Launch Core</button>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Driving Operations Section */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Abstract Visualizer */}
              <div className="absolute inset-0 border-[1px] border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-12 border-[1px] border-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-24 border-[1px] border-primary/10 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-panel p-8 rounded-full ghost-border flex flex-col items-center">
                  <span className="text-4xl font-berkeley-mono font-bold text-white mb-2">99.8%</span>
                  <span className="text-[10px] font-berkeley-mono text-outline tracking-[0.2em] uppercase">Autonomous</span>
                </div>
              </div>
              {/* Floating Data Points */}
              <div className="absolute top-0 right-10 bg-surface-container-high ghost-border px-4 py-2 rounded-lg text-xs font-berkeley-mono text-primary shadow-xl">
                NODE_ALPHA_ACTIVE
              </div>
              <div className="absolute bottom-20 left-0 bg-surface-container-high ghost-border px-4 py-2 rounded-lg text-xs font-berkeley-mono text-secondary shadow-xl">
                SYNC_PROTOCOL_V2
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Make campus operations self-driving</h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              Nex Campus employs advanced algorithmic agents to handle scheduling, energy optimization, and security protocols automatically. Set your parameters, and watch the system optimize itself.
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
          </div>
        </div>
      </section>

      {/* Featured Grid Sections */}
      <section className="py-24 px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Featured Courses */}
          <div>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Featured Courses</h2>
                <p className="text-on-surface-variant">The frontiers of knowledge, delivered via the OS.</p>
              </div>
              <button className="text-primary hover:underline font-semibold flex items-center gap-1">
                Explore Catalog
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group cursor-pointer">
                <div className="aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden mb-4 ghost-border">
                  <img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJuyKGrUdfPP3j40KR_T3cfGYhnqObEEzgHOIKe0WXci4u-KeOW21Jw0Q7S7gEe6ITn5ZioCsSvpTd-HZXjcETps4_svgvTWlDpFnS_8C2yFchKyl05KEfKUS9VrRZDg2e4PcNNmcGb1vl005zXJt5ZlMLZly6lKNDiR7x1CSWSMqYB7U66uK3OJd7w-kNv3S5oF6X9rzcjReBoj9Hys4A42QndQrhiu8wLKtfdSpsDwhK6WRTVxjX5y5rhcaRTvdruiISZf4UXzE"/>
                </div>
                <h3 className="text-xl font-bold mb-1">Quantum Systems Design</h3>
                <p className="text-sm text-on-surface-variant">Level 400 • 12 Credits</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden mb-4 ghost-border">
                  <img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDExOURvciBR3gc2mvKthcE8HbV3zOqA-IRbnKvpQ8X6z7essWKskt7zoRekZoK8rubJulZVIfDD5QRjQ3GQJ6WDcQsmniBMrttDppvk1DBW4OOCzxQCCMRAmey_ND5q45klNLsRKJYNsnT0xpGiLJPGjYmga5k_VNbFAdm3n7C6U7ZBu0NWQa0dKTQIrMw8XNZzGclSHgA6KUrnotioBtUq3v1Fh8HN2JyK18ZnUuRCY74O7HFYw1OXCZfg9sL22GXgjp03GwBLq0"/>
                </div>
                <h3 className="text-xl font-bold mb-1">Algorithmic Ethics</h3>
                <p className="text-sm text-on-surface-variant">Level 300 • 8 Credits</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden mb-4 ghost-border">
                  <img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8MBspROSwHgN0KPkgkV0vi0KX3eWPTiVKVJ_iG8o8hLQAg0dCI7dTLhLOHaxDanCESAmK6ML8hToB0HPsLyFWQlxj2d5c8Bp9QO_n21L-9mbAV2LyYxHWPeMpv_HH3uV2RKX6KOV2VU_0CZGYrNhZCwjN0yWj78JvAkAiPW-ymKcx_wLpOh-sqLFdkHTJ8-8xQ_3dpPR91JuUltHAzxet-ZuCqfPZPxvODApZuiT6XOJfYozaFLVLXhPg4MrQy5gZDYU1gii5OUQ"/>
                </div>
                <h3 className="text-xl font-bold mb-1">Orbital Economics</h3>
                <p className="text-sm text-on-surface-variant">Level 500 • 15 Credits</p>
              </div>
            </div>
          </div>

          {/* Facilities: Side-by-Side Asymmetric */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white">Facilities engineered for the future</h2>
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
              <button className="bg-surface-container-high text-white px-6 py-3 rounded-lg font-bold ghost-border w-full hover:bg-surface-variant transition-all">Explore Campus Map</button>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <img alt="Library" className="rounded-xl ghost-border w-full aspect-[3/4] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBzUqpGQAQXQQLDqMDTRr9x7mG57L7Vsw4jFwaTH0ZbaUUbu-jEkhN_rorOgcxVaD1N15akyHFYl36okrIW5lhNbr9_KI7b5Q-BAvCwQoYUMk3IHcoHE2j1by6PjnJboa9i9gW9tpn94-4J8klK0f5wGaanmswzqOoRVV-BiO_KwFAf_nR1jMSDYYkXS8yGa869FJAv-DZIXj1diKqOQAlLg76udxLYgLoI_5ClslExiEFMZYB9unHJRBfbsh-NLpU0H_XuKrKZk8"/>
                  <img alt="Engineering Lab" className="rounded-xl ghost-border w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyXVbyaqQGheduA_MhGOWZ8ph_djwNlGUXOBeowCMVA6I25CqZ_22HgFIvxt5Z_b4IX--MSWPs02tVY5TORhaxI9SGOhnkzJYZQ5JJY8DT2QDIEFFxNND5SGggeQRlbmtyXIDbvoejBBGxmCX9msIibkGbhXZeFaA6fn6EteXUm_EVyHnAyqqCG6p7VdP-MQ5_Z3P5lkfWKqcbJD-emWBkfLDPSm43m96WrpgJt0CWzu-sRX1d29ZbVSVouo0khbF3DZv0KbcAQc8"/>
                </div>
                <div className="space-y-4">
                  <img alt="Social Hub" className="rounded-xl ghost-border w-full aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLK09EwdE4QjWDA52SA7bacRwF2M9zAbXsMoImClAAlc6j-cniRP4NOvyTrNErDaDweUoL433ErXErPT-nBBWn796OuBbSUsOcXyJNj9ytf-jK3Hal7UufEzHD1TrQGc4tYFlebrD-Va6VksSyxzFbiWqX56kIMW_41IJ9TpAFIQ3rdpUMQPkcp3k7Cr1ladQPe9cG4yTthZ5NTMqWqOjZfDZ0MUBb1rX39bgj1s32qNLTlMFk4sBkx7lJ0mogOhjoCWUGYhzBS8M"/>
                  <img alt="Data Center" className="rounded-xl ghost-border w-full aspect-[3/4] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClv4Di6ppD1zK66m1YvRfRdjqNaV-HIiKqmlbbXj8qaLTAU9f9hyg94LfLOZGUqlihxyGdPWN0gM7hkgV6m7VGg0ErHSQRIVnUkQ5JyAiATzW0Qmv5yTDGlXjYBAitguQiyTU60_GPH2JcR-3D3Znhp0kX6wcd-DDqZa3GIC3pCjdh8uHIUw9657KiaQfhahaX-PzRTkg0zJLHho_6eT9-BcJoqiM25TovFUr00FUf2SGoeNy3NLyuNH8bsMFAU0DAOYc-nDtM1YI"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events: Full Width Horizontal Scroller */}
      <section className="px-6 py-24 pb-0 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-12">Upcoming Events</h2>
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide no-scrollbar">
          <div className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden ghost-border group">
            <div className="h-40 relative">
              <img alt="Event" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK485cEVVNJXpEYfuL7WZK8eEzfxHu4EzD93FJf3xJ51x90gZreReNdI36-uBVX099I_7QDLbc28I-kq6Ekcbl9kpONegoNxWTDPL6m5xWEuBDbgKv9tA2XXkUP_gM9SF0t-PAQBbuZyrFPK2LOC6Q7ph3BxwTi1n6Wah3EJcDwjjbJO1WewR63SOMeG5lG6fr_W8jqMSvzY4B5t1N1-pwfNoRmp63iSLcVv-nZXaKR0xTmZk1CiBTysE_KkLgVdXk05OhQFC2HeM"/>
              <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-berkeley-mono px-2 py-1 rounded">OCT 24</div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Nex Summit 2024</h3>
              <p className="text-sm text-on-surface-variant mb-4">The annual gathering of campus innovators and developers.</p>
              <div className="flex items-center gap-2 text-[10px] font-berkeley-mono text-outline">
                <span className="material-symbols-outlined text-sm">location_on</span>
                GREAT HALL • 09:00 AM
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden ghost-border group">
            <div className="h-40 relative">
              <img alt="Event" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK_5LwPvVet91yTvIYUzi6I8WbYwLbJvDJS87GxE5HU8yqGfb4oRL_sWiVy2z6CRXdfLW3loKF8CoqD5E8bJPZWxzYgplljCfphUbFXXWlYku9swJUV1P5XV1XqhN9QEw4mvpCYKNsVisa6hVfZN6wu_dFXOT99eZNKbdesvjvjtQQ78NaoimXKWXbp-BgNuvnKvvzmZjEvIN81P2rL7p4PnJ69NyHL0FIWxAxXkvIm0X_0A1jHnZt2L_MrcF3Z1Mos-znK9TV6yM"/>
              <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-berkeley-mono px-2 py-1 rounded">OCT 28</div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Cyber Security Hackathon</h3>
              <p className="text-sm text-on-surface-variant mb-4">48 hours of intense perimeter testing and offensive security.</p>
              <div className="flex items-center gap-2 text-[10px] font-berkeley-mono text-outline">
                <span className="material-symbols-outlined text-sm">location_on</span>
                NODE LAB • 06:00 PM
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden ghost-border group">
            <div className="h-40 relative">
              <img alt="Event" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI_DqMg5FTxRRH89rX0FmrKm7wF3GzQsHcLBV1aPfpD4Nx37IsrZmhEjxQEkhx-VufHjT0VpgJxiXJY9Rub9HIzmmRcvsB88emOYeAixo5fZ-JXwR1Gv5-myCs91jtHxNhzQb8f6PZlM-jL8IRTLApK2Eh3C38u2eyQspfI3IBn9debzzWLYiDU6WGlYrIJ_u9xvSmJ6QUpfC9Wikvwn495VBcH7q3TPvW91iSKfiOj4pi4xTi1tisQNvFpXnJhowAmhRMGUjwLDk"/>
              <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-berkeley-mono px-2 py-1 rounded">NOV 02</div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Social Design Workshop</h3>
              <p className="text-sm text-on-surface-variant mb-4">Redefining human interaction in the digital age.</p>
              <div className="flex items-center gap-2 text-[10px] font-berkeley-mono text-outline">
                <span className="material-symbols-outlined text-sm">location_on</span>
                PLAZA HUB • 02:00 PM
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden ghost-border group">
            <div className="h-40 relative">
              <img alt="Event" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBqFnnCWrH5AwAW1w8bjc4-Nt7cVwpqGEgq2967NznbNzGp9nvUAzWqCa7o_6d3Qd363cJIaFFKppTiCqICpz9Gb5HvjfRXnIMpZArzXR3A56ct13LSnN5crAkUryiqoVr3yISKY6L1WSHpkSjrH4qrG6OVaHBqfiYgmijFWGgqcc5bwC_d_P-XvCJqsAb8-k61nNCMHqO-uwtYYKh0Yk7N7MUlgDeL-h0XhVdB_z85_gQ8pqtXe-IAca4hnL6Nq7guWiZ4SeRAqA"/>
              <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-berkeley-mono px-2 py-1 rounded">NOV 05</div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Alumni Networking</h3>
              <p className="text-sm text-on-surface-variant mb-4">Connect with the Nex pioneers shaping global industries.</p>
              <div className="flex items-center gap-2 text-[10px] font-berkeley-mono text-outline">
                <span className="material-symbols-outlined text-sm">location_on</span>
                VIRTUAL HUB • 07:00 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl p-12 text-center ghost-border relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tighter text-white mb-6">Ready to upgrade your campus experience?</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto">Join thousands of students and faculty members who are already navigating the future of education on Nex Campus.</p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform">Get Started Free</button>
              <button className="bg-surface-container-high text-white px-8 py-3 rounded-lg font-bold ghost-border hover:bg-surface-variant transition-all">Request Demo</button>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default Home;
