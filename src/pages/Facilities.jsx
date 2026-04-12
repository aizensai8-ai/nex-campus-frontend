import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '../lib/animations';

const Facilities = () => {
  return (
    <motion.main
      {...pageTransition}
      className="max-w-[1440px] mx-auto px-6 py-12"
    >
      {/* Hero Header */}
      <motion.section
        {...fadeUp}
        className="mb-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi">Campus Infrastructure.</h1>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Access state-of-the-art learning environments, specialized labs, and collaborative spaces designed for the next generation of pioneers.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/10 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-berkeley-mono text-xs uppercase tracking-widest text-primary">Live Campus Occupancy: 64%</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid Layout */}
      <motion.div
        {...staggerContainer}
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* FEATURED: Learning Resource Center */}
        <motion.div
          {...staggerItem}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="md:col-span-8 group relative overflow-hidden bg-surface-container-low rounded-xl border border-outline-variant/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
        >
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD67qZlOaN9W5dg4629VwjUX9zxvkbuo8J5i-V5wD5GCDC6bzGCYh1oEwerhH2dHYxlNezjtkxFqB28hl3urnQXE8K2mE2qnnaeu-nvnMb9jNQeGD2qpptky0H5LJefFvDnkdo8pC4MsJbsK5UTX53Mi1PdibUc9XgdwlRUuEdXsP3J4DDC1L5zHXpyDIeWBDrnrOQ6Gt3BJ68ciae3vcVONQbhmb1a0pYRmvvkFZXPJwDUE1H1evlIgtJx6VBziZQdliNGTbQgps" alt="Library" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/20 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-primary/30">Open Now</span>
              <span className="font-berkeley-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Main Block · Lvl 2-5</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-white mb-2 font-satoshi">Learning Resource Center</h2>
            <p className="text-on-surface-variant max-w-lg mb-6">Hybrid research library with over 200 silent study pods, collaborative media rooms, and full-spectrum digital archives.</p>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-berkeley-mono text-outline tracking-wider">Hours</span>
                <span className="text-sm font-semibold">08:00 — 22:00</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-berkeley-mono text-outline tracking-wider">Capacity</span>
                <span className="text-sm font-semibold">450 Seats</span>
              </div>
              <button className="ml-auto flex items-center justify-center h-12 w-12 rounded-full bg-white text-background hover:scale-110 transition-transform duration-200">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* SECONDARY: Innovation Studio + Student Success */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {[
            {
              icon: "biotech", iconColor: "text-primary", iconBg: "bg-primary-container/20",
              badge: "Reserved Only", badgeColor: "bg-secondary-container/20 text-secondary border-secondary/30",
              title: "Innovation Studio",
              desc: "Rapid prototyping lab featuring industrial 3D printers, laser cutters, and VR development bays.",
              meta: "Tech Hub · Wing C", hours: "24/7 Access",
            },
            {
              icon: "groups", iconColor: "text-tertiary", iconBg: "bg-tertiary-container/20",
              badge: "Open Now", badgeColor: "bg-primary/20 text-primary border-primary/30",
              title: "Student Success Center",
              desc: "Holistic support hub offering career counseling, peer tutoring, and mental health workshops.",
              meta: "Plaza · Level 1", hours: "09:00 — 18:00",
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              {...staggerItem}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1 bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 flex flex-col justify-between hover:bg-surface-container-high transition-colors duration-200 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`h-12 w-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${card.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                </div>
                <span className={`${card.badgeColor} px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border`}>{card.badge}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tighter text-white mb-2">{card.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{card.desc}</p>
              </div>
              <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                <span className="font-berkeley-mono text-xs text-outline">{card.meta}</span>
                <span className="text-xs font-semibold">{card.hours}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TIER 3: Smaller Grid Items */}
        {[
          {
            title: "NexFit Gymnasium",
            statusColor: "bg-primary", statusLabel: "Operational",
            desc: "Full-service fitness center with smart bio-tracking equipment.",
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKpMW1AB1uEUqebzUPlu6cZiqxmD-i8JAMoXAat9GLM6H23AcK3kYsPylkbbCp5XW7BlGasPjVHOI5BEkycvDraUFOKSuK7hlVjMQ9OqbkBcYdUKU_4dfGsxAoD2S0zWUZ8IVDndcMP92JsnYFFckzLgo_o2mYHibfAEaUoWQ_nrnPIGh8uOInAkTpBdKEyepqfoZTBy2Unyd8TIH0k52WiZ-F9f5MraIUVtYd03aNcHGqygKlQTuX5Erpzl-ySjea1EqjL7ESAeI",
          },
          {
            title: "Central Atrium Dining",
            statusColor: "bg-secondary", statusLabel: "Peak Hours",
            desc: "Eco-conscious dining experience with curated seasonal menus.",
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUv8hklAERQhJQFQajNUa0uq8lroQIXygx6szovEOkwj4hAya0Y5ZH0OsrJCaS8p-dK9W0ayp3y_S-Shi5WVmXQW3_ldM4FdF3EuM2C8m9srL2cJ7m0W9vscWF9oYDnQd1ll-KVS4Wu_OjzeZp7LilYBGzFcVqEAx7TRA6M6GAxw5caMODLXIrsuN-jwWGkNQu1qmwfuvlK7Ok07qlU7gjqNgC1v5wvlscpvC5cNR3E2Hxyl6CjdYqnqOw69ZiWf0l5H0FEQYCOiU",
          },
        ].map((item) => (
          <motion.div
            key={item.title}
            {...staggerItem}
            whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:col-span-3 bg-surface-container-low p-5 rounded-xl border border-outline-variant/5 group cursor-pointer"
          >
            <div className="w-full h-32 rounded-lg bg-surface-container-highest mb-4 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.src} alt={item.title} />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
            <div className="flex items-center gap-2 mb-3">
              <span className={`h-1.5 w-1.5 rounded-full ${item.statusColor}`}></span>
              <span className="text-[10px] font-berkeley-mono text-outline uppercase tracking-wider">{item.statusLabel}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}

        {/* Conference Hall */}
        <motion.div
          {...staggerItem}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="md:col-span-6 bg-surface-container-low rounded-xl border border-outline-variant/5 p-8 flex items-center gap-8 group cursor-pointer hover:bg-surface-container transition-colors duration-200"
        >
          <div className="flex-1">
            <h4 className="text-2xl font-bold tracking-tighter text-white mb-3 font-satoshi">Conference Hall A</h4>
            <p className="text-sm text-on-surface-variant mb-6">400-seat auditorium with Dolby Atmos integration and 8K projection capabilities for global seminars.</p>
            <button className="bg-primary text-on-primary px-6 py-2 text-xs font-bold uppercase tracking-widest rounded hover:bg-primary-fixed-dim hover:scale-[1.02] transition-all duration-200">
              Check Availability
            </button>
          </div>
          <div className="hidden lg:block w-48 h-full bg-surface-container-highest rounded-lg overflow-hidden border border-outline-variant/10">
            <img className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Nc_b-iDZfeKNUO50k-Q8CLAgmEU7lqJstkEbY5fGNIY_l06LGaQrwbLzfw1ZLi-BPEtS7pPV5TrO40FJyp8dpHvfrA5lR8VtiStVAXJmtkTX6uOmrEjSn03xFLSJPRnfQgDZ84oH9Cw9O53_zKAbnE6z09lnN97CBKEDma0BIuoua23XbBwBoN52ZwwG8Co5L8CObKkriUWIP2HrT-7S-f1bKXKBcD4mbSOkZKEnhEynWHPrCryp8N0fTzqg_EIg76bQ9ujNF2Q" alt="Hall" />
          </div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default Facilities;
