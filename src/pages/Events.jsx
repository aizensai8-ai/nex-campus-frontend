import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '../lib/animations';

const Events = () => {
  return (
    <motion.main
      {...pageTransition}
      className="pt-24 pb-20 max-w-[1440px] mx-auto px-6"
    >
      {/* Hero Section */}
      <motion.section
        {...fadeUp}
        className="mb-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4 font-satoshi">Campus Events</h1>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Precision-scheduled symposia, hackathons, and cultural exchanges. The intelligence of our campus, live and in person.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-sm border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live Feed Active
          </div>
        </div>
      </motion.section>

      {/* Bento Grid / Timeline Layout */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 md:grid-cols-12 gap-px bg-outline-variant/15 border border-outline-variant/15 rounded-xl overflow-hidden"
      >
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
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
                <h3 className="text-4xl font-bold tracking-tighter text-white font-satoshi">Building the Autonomous Campus</h3>
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
                <button className="px-8 py-3 bg-primary text-on-primary font-bold tracking-tighter hover:bg-white hover:scale-[1.02] transition-all duration-200">
                  Register Seat
                </button>
              </div>
            </div>
          </motion.div>

          {/* Event List */}
          <motion.div
            {...staggerContainer}
            className="space-y-px bg-outline-variant/15"
          >
            {[
              { when: "Next Tuesday", date: "Oct 15", title: "Quantum Computing Lab Open House", dept: "Hosted by Dept. of Applied Physics", loc: "North Wing, L4" },
              { when: "Next Week", date: "Oct 22", title: "Sustainable Logistics Symposium", dept: "Global Supply Chain Initiative", loc: "Main Hall" },
              { when: "Late Oct", date: "Oct 29", title: "Nex AI Hackathon: The Genesis Project", dept: "48-hour endurance coding", loc: "The Hub", waitlist: true },
            ].map((event) => (
              <motion.div
                key={event.title}
                {...staggerItem}
                className="group grid grid-cols-1 md:grid-cols-12 items-center bg-surface-container-low py-8 md:px-0 hover:bg-surface-container-high cursor-pointer transition-colors duration-200"
              >
                <div className="md:col-span-2 flex flex-col md:items-center mb-4 md:mb-0">
                  <span className="font-mono text-xs text-outline uppercase">{event.when}</span>
                  <span className="text-xl font-bold text-white">{event.date}</span>
                </div>
                <div className="md:col-span-6 space-y-1">
                  <h4 className="text-xl font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors">{event.title}</h4>
                  <p className="text-sm text-on-surface-variant font-mono">{event.dept}</p>
                </div>
                <div className="md:col-span-2 text-sm text-outline flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">sensors</span>
                  {event.loc}
                </div>
                <div className="md:col-span-2 flex md:justify-end mt-4 md:mt-0">
                  {event.waitlist ? (
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-sm">Waitlist Only</span>
                  ) : (
                    <button className="text-xs font-mono font-bold uppercase tracking-widest border border-outline-variant/30 px-4 py-2 hover:border-primary hover:text-primary transition-all duration-200">
                      View Details
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Secondary Bento Grid */}
      <motion.section
        {...staggerContainer}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { icon: "calendar_month", title: "Sync Calendar", desc: "Integrate Nex Campus events directly into your personal workflow via iCal or Google Calendar.", link: "Get Sync Link →" },
          { icon: "campaign", title: "Host an Event", desc: "Propose your own technical seminar or workshop. Review current guidelines for venue booking.", link: "Submit Proposal →" },
          { icon: "history", title: "Past Recordings", desc: "Missed a session? Access the full archive of recorded keynotes and seminar papers.", link: "Archive Access →" },
        ].map((card) => (
          <motion.div
            key={card.title}
            {...staggerItem}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px' }}>{card.icon}</span>
            <h5 className="text-lg font-bold text-white mb-2">{card.title}</h5>
            <p className="text-sm text-on-surface-variant mb-6">{card.desc}</p>
            <a className="text-xs font-mono text-primary uppercase tracking-widest hover:underline" href="#">{card.link}</a>
          </motion.div>
        ))}
      </motion.section>
    </motion.main>
  );
};

export default Events;
