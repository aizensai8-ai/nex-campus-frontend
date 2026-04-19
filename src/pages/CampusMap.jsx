import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLOORS = [
  'Ground Floor',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  'Terrace',
  'Campus Grounds'
];

const COLORS = {
  Labs: 'rgba(59,130,246,0.15)',
  Classrooms: 'rgba(34,197,94,0.15)',
  Staff: 'rgba(245,158,11,0.15)',
  Washrooms: 'rgba(156,163,175,0.15)',
  Special: 'rgba(168,85,247,0.15)',
  Stairs: 'rgba(239,68,68,0.3)'
};

const LEGEND = [
  { label: 'Laboratories', color: '#3b82f6' },
  { label: 'Classrooms', color: '#22c55e' },
  { label: 'Staff / Admin', color: '#f59e0b' },
  { label: 'Washrooms', color: '#9ca3af' },
  { label: 'Special Rooms', color: '#a855f7' },
  { label: 'Stairs', color: '#ef4444' }
];

const MAP_DATA = {
  'Ground Floor': [
    { name: 'CAFE', type: 'Special', x: 0, y: 0, w: 150, h: 60 },
    { name: 'LAB 4', type: 'Labs', x: 150, y: 0, w: 200, h: 60 },
    { name: 'LAB 5', type: 'Labs', x: 350, y: 0, w: 200, h: 60 },
    { name: 'WASHROOM Boys', type: 'Washrooms', x: 550, y: 0, w: 150, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: 700, y: 40, w: 60, h: 80 }, 
    { name: 'LAB 3', type: 'Labs', x: 640, y: 60, w: 60, h: 380 },
    { name: 'PRINCIPAL', type: 'Staff', x: 0, y: 440, w: 150, h: 60 },
    { name: 'OFFICE', type: 'Staff', x: 150, y: 440, w: 120, h: 60 },
    { name: 'LOBBY', type: 'Special', x: 270, y: 440, w: 160, h: 60 },
    { name: 'LAB 1', type: 'Labs', x: 430, y: 440, w: 150, h: 60 },
    { name: 'LAB 2', type: 'Labs', x: 580, y: 440, w: 120, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: -60, y: 120, w: 60, h: 80 }, 
    { name: 'WATER', type: 'Special', x: 0, y: 60, w: 60, h: 100 },
    { name: 'TEACHER AUDITORIUM', type: 'Special', x: 0, y: 160, w: 60, h: 280 },
  ],
  '1st Floor': [
    { name: 'MATHS STAFF', type: 'Staff', x: 0, y: 0, w: 200, h: 60 },
    { name: 'LAB', type: 'Labs', x: 200, y: 0, w: 150, h: 60 },
    { name: 'LAB', type: 'Labs', x: 350, y: 0, w: 150, h: 60 },
    { name: 'GIRLS RESTROOM', type: 'Washrooms', x: 500, y: 0, w: 200, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: 700, y: 40, w: 60, h: 80 },
    { name: 'Class', type: 'Classrooms', x: 640, y: 60, w: 60, h: 95 },
    { name: 'Class', type: 'Classrooms', x: 640, y: 155, w: 60, h: 95 },
    { name: 'Class', type: 'Classrooms', x: 640, y: 250, w: 60, h: 95 },
    { name: 'Class', type: 'Classrooms', x: 640, y: 345, w: 60, h: 95 },
    { name: 'SEMINAR HALL', type: 'Special', x: 0, y: 440, w: 140, h: 60 },
    { name: 'LAB', type: 'Labs', x: 140, y: 440, w: 280, h: 60 },
    { name: 'LAB', type: 'Labs', x: 420, y: 440, w: 280, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: -60, y: 80, w: 60, h: 80 },
    { name: 'WATER', type: 'Special', x: 0, y: 60, w: 60, h: 80 },
    { name: 'SEMINAR CONT', type: 'Special', x: 0, y: 140, w: 60, h: 300 },
  ],
  '2nd Floor': [
    { name: 'AIML STAFF', type: 'Staff', x: 0, y: 0, w: 140, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 140, y: 0, w: 140, h: 60 },
    { name: 'LAB', type: 'Labs', x: 280, y: 0, w: 140, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 420, y: 0, w: 140, h: 60 },
    { name: 'BOYS RESTROOM', splitName: ['BOYS', 'RESTROOM'], type: 'Washrooms', x: 560, y: 0, w: 70, h: 60 },
    { name: 'GIRLS RESTROOM', splitName: ['GIRLS', 'RESTROOM'], type: 'Washrooms', x: 630, y: 0, w: 70, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: 700, y: 40, w: 60, h: 80 },
    { name: 'LAB', type: 'Labs', x: 640, y: 60, w: 60, h: 120 },
    { name: 'LAB', type: 'Labs', x: 640, y: 180, w: 60, h: 120 },
    { name: 'CSE HOD', type: 'Staff', x: 640, y: 300, w: 60, h: 140 },
    { name: 'STAFF', type: 'Staff', x: 0, y: 440, w: 100, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 100, y: 440, w: 100, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 200, y: 440, w: 100, h: 60 },
    { name: 'LAB', type: 'Labs', x: 300, y: 440, w: 200, h: 60 },
    { name: 'LAB', type: 'Labs', x: 500, y: 440, w: 200, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: -60, y: 100, w: 60, h: 80 },
    { name: 'LAB', type: 'Labs', x: 0, y: 60, w: 60, h: 140 },
    { name: 'Class', type: 'Classrooms', x: 0, y: 200, w: 60, h: 140 },
    { name: 'STAFF', type: 'Staff', x: 0, y: 340, w: 60, h: 100 },
  ],
  '3rd Floor': [
    { name: 'STAFF', type: 'Staff', x: 0, y: 0, w: 140, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 140, y: 0, w: 140, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 280, y: 0, w: 140, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 420, y: 0, w: 140, h: 60 },
    { name: 'BOYS RESTROOM', splitName: ['BOYS', 'RESTROOM'], type: 'Washrooms', x: 560, y: 0, w: 70, h: 60 },
    { name: 'GIRLS RESTROOM', splitName: ['GIRLS', 'RESTROOM'], type: 'Washrooms', x: 630, y: 0, w: 70, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: 700, y: 40, w: 60, h: 80 },
    { name: 'AUDITORIUM', type: 'Special', x: 640, y: 60, w: 60, h: 380 },
    { name: 'STAFF', type: 'Staff', x: 0, y: 440, w: 120, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 120, y: 440, w: 140, h: 60 },
    { name: 'YOGA', type: 'Special', x: 260, y: 440, w: 160, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 420, y: 440, w: 140, h: 60 },
    { name: 'Class', type: 'Classrooms', x: 560, y: 440, w: 140, h: 60 },
    { name: 'Stairs', type: 'Stairs', x: -60, y: 100, w: 60, h: 80 },
    { name: 'Class', type: 'Classrooms', x: 0, y: 60, w: 60, h: 126 },
    { name: 'Class', type: 'Classrooms', x: 0, y: 186, w: 60, h: 126 },
    { name: 'Class', type: 'Classrooms', x: 0, y: 312, w: 60, h: 128 },
  ],
  'Terrace': [
    { name: 'Solar Panels', type: 'Special', x: 0, y: 0, w: 700, h: 60 },
    { name: 'Solar Panels', type: 'Special', x: 0, y: 440, w: 700, h: 60 },
    { name: 'Solar Panels', type: 'Special', x: 0, y: 60, w: 60, h: 380 },
    { name: 'Solar Panels', type: 'Special', x: 640, y: 60, w: 60, h: 380 },
  ]
};

// Walking directions from Main Gate to key locations
const DIRECTIONS = {
  'CAFE':                 { route: 'Main Gate → Straight through lobby → Ground floor, left wing', eta: '1 min' },
  'LAB 1':               { route: 'Main Gate → Main Block entrance → Ground floor, right side', eta: '2 min' },
  'LAB 2':               { route: 'Main Gate → Main Block → Ground floor, far right', eta: '2 min' },
  'LAB 3':               { route: 'Main Gate → Main Block → Right side staircase → Ground floor east', eta: '3 min' },
  'LAB 4':               { route: 'Main Gate → Main Block → Top corridor, second door', eta: '2 min' },
  'LAB 5':               { route: 'Main Gate → Main Block → Top corridor, third door', eta: '2 min' },
  'PRINCIPAL':           { route: 'Main Gate → Straight → Ground floor, left corner office', eta: '2 min' },
  'OFFICE':              { route: 'Main Gate → Straight → Ground floor, next to Principal cabin', eta: '2 min' },
  'LOBBY':               { route: 'Main Gate → Walk straight 20 m → You\'re at the lobby', eta: '1 min' },
  'TEACHER AUDITORIUM':  { route: 'Main Gate → Left side ground floor corridor', eta: '3 min' },
  'MATHS STAFF':         { route: 'Main Gate → Main Block → 1st Floor stairs → Turn left', eta: '3 min' },
  'SEMINAR HALL':        { route: 'Main Gate → Main Block → 1st Floor stairs → Turn right', eta: '3 min' },
  'AIML STAFF':          { route: 'Main Gate → Main Block → 2nd Floor stairs → Turn left (AIML corridor)', eta: '4 min' },
  'CSE HOD':             { route: 'Main Gate → Main Block → 2nd Floor stairs → Right side, end of corridor', eta: '4 min' },
  'STAFF':               { route: 'Main Gate → Main Block → Target floor via stairs → Staff room', eta: '4–5 min' },
  'AUDITORIUM':          { route: 'Main Gate → Main Block → 3rd Floor stairs → Right wing, large hall', eta: '5 min' },
  'YOGA':                { route: 'Main Gate → Main Block → 3rd Floor stairs → Bottom corridor, center', eta: '5 min' },
  'Solar Panels':        { route: 'Main Gate → Main Block → Terrace stairs → Rooftop (restricted access)', eta: '6 min' },
  'Boys-hostel':         { route: 'Main Gate → Left on campus road → 200 m → Hostel entrance', eta: '4 min' },
  'Civil-block/Library': { route: 'Main Gate → Straight → Right at junction → Civil Block (Library on ground floor)', eta: '5 min' },
  'Mechanical-block':    { route: 'Main Gate → Straight → Far right end of campus road', eta: '6 min' },
  'Canteen':             { route: 'Main Gate → Left → 50 m down the road → Canteen building on left', eta: '2 min' },
  'Main-branch':         { route: 'Main Gate → Walk straight → You\'re at the Main Block entrance', eta: '1 min' },
  'Prakruthi-college':   { route: 'Main Gate → Straight, past Main Block → Far right of campus', eta: '7 min' },
  'SECURITY':            { route: 'Main Gate → 10 m inside → Security cabin on right', eta: '< 1 min' },
  'Main Gate':           { route: 'You are at the Main Gate.', eta: '0 min' },
  'Back Gate':           { route: 'Main Gate → Straight → Through campus → Back Gate', eta: '8 min' },
};

// Searchable index: flatten all rooms across all floors
const buildSearchIndex = () => {
  const index = [];
  Object.entries(MAP_DATA).forEach(([floor, rooms]) => {
    rooms.forEach(r => {
      if (r.type === 'Stairs') return;
      index.push({ name: r.name, floor, type: r.type });
    });
  });
  // Add campus grounds buildings
  ['Boys-hostel','Civil-block/Library','Mechanical-block','Canteen','Main-branch','Prakruthi-college','SECURITY','Main Gate','Back Gate'].forEach(name => {
    index.push({ name, floor: 'Campus Grounds', type: 'Special' });
  });
  return index;
};

export default function CampusMap() {
  const [selectedFloor, setSelectedFloor] = useState('Ground Floor');
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const searchRef = useRef(null);
  const searchIndex = useMemo(buildSearchIndex, []);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return searchIndex.filter(r => r.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search, searchIndex]);

  const goToRoom = (room) => {
    setSearch('');
    setSearchFocus(false);
    if (room.floor === 'Campus Grounds') {
      setSelectedFloor('Campus Grounds');
    } else {
      setSelectedFloor(room.floor);
    }
    setActiveRoom({ name: room.name, type: room.type, floor: room.floor });
  };

  const renderFloor = () => {
    const rooms = MAP_DATA[selectedFloor];
    if (!rooms) return null;

    return (
      <motion.svg
        key={selectedFloor}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        viewBox="-100 -50 900 800"
        className="w-full max-w-[700px] mx-auto drop-shadow-lg"
      >
        {/* Background Grid Pattern */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
        <rect x="-100" y="-50" width="900" height="800" fill="url(#grid)" />

        {/* Central Courtyard text */}
        <text x="350" y="250" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontSize="20" className="uppercase tracking-widest font-berkeley-mono pointer-events-none">
          Open Courtyard
        </text>

        {/* Grand Split Staircase in Courtyard */}
        {selectedFloor !== '3rd Floor' && selectedFloor !== 'Terrace' && (
          <g stroke="rgba(74,158,255,0.4)" strokeWidth="1" fill="none">
            {/* Central rounded landing projecting from the building */}
            <path d="M 310 440 L 310 400 A 40 40 0 0 1 390 400 L 390 440" fill="rgba(255,255,255,0.02)" />
            
            {/* Main steps leading up to landing */}
            <line x1="310" y1="435" x2="390" y2="435" />
            <line x1="310" y1="430" x2="390" y2="430" />
            <line x1="310" y1="425" x2="390" y2="425" />
            <line x1="310" y1="420" x2="390" y2="420" />
            <line x1="310" y1="415" x2="390" y2="415" />
            <line x1="310" y1="410" x2="390" y2="410" />

            {/* Left sweeping staircase branch */}
            <path d="M 310 400 C 280 400 270 420 260 440" />
            <path d="M 310 380 C 260 380 250 420 240 440" />
            <line x1="305" y1="400" x2="305" y2="381" />
            <line x1="295" y1="402" x2="295" y2="383" />
            <line x1="285" y1="408" x2="282" y2="388" />
            <line x1="275" y1="416" x2="269" y2="398" />
            <line x1="267" y1="428" x2="258" y2="411" />
            <line x1="262" y1="436" x2="250" y2="423" />

            {/* Right sweeping staircase branch */}
            <path d="M 390 400 C 420 400 430 420 440 440" />
            <path d="M 390 380 C 440 380 450 420 460 440" />
            <line x1="395" y1="400" x2="395" y2="381" />
            <line x1="405" y1="402" x2="405" y2="383" />
            <line x1="415" y1="408" x2="418" y2="388" />
            <line x1="425" y1="416" x2="431" y2="398" />
            <line x1="433" y1="428" x2="442" y2="411" />
            <line x1="438" y1="436" x2="450" y2="423" />
          </g>
        )}

        {/* Outer Building Rooms */}
        {rooms.map((room, idx) => (
          <g 
            key={`${room.name}-${idx}`} 
            className="cursor-pointer group"
            onClick={() => setActiveRoom({ ...room, floor: selectedFloor })}
            onMouseMove={(e) => {
              setHoveredRoom({ name: room.name, x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <rect 
              x={room.x} y={room.y} 
              width={room.w} height={room.h} 
              fill={COLORS[room.type] || 'rgba(255,255,255,0.05)'} 
              stroke="rgba(74,158,255,0.3)" 
              strokeWidth="1.5" 
              className="transition-all duration-200 group-hover:stroke-[#3b82f6] group-hover:stroke-2 hover:brightness-125" 
            />
            {/* Split text vertically if space is vertical */}
            <text 
              x={room.x + room.w/2} 
              y={room.y + room.h/2} 
              fill="rgba(255,255,255,0.6)" 
              textAnchor="middle" 
              dominantBaseline="central" 
              fontSize="10"
              className="pointer-events-none transition-colors group-hover:fill-white font-berkeley-mono"
            >
              {room.splitName ? (
                <>
                  <tspan x={room.x + room.w/2} dy="-0.6em">{room.splitName[0]}</tspan>
                  <tspan x={room.x + room.w/2} dy="1.4em">{room.splitName[1]}</tspan>
                </>
              ) : room.h > room.w && room.name.includes(' ') && !room.name.includes('(') ? (
                <>
                  <tspan x={room.x + room.w/2} dy="-0.6em">{room.name.split(' ')[0]}</tspan>
                  <tspan x={room.x + room.w/2} dy="1.4em">{room.name.substring(room.name.indexOf(' ') + 1)}</tspan>
                </>
              ) : (
                room.name
              )}
            </text>
          </g>
        ))}
        
        {/* Entrance Road Marker for Ground Floor */}
        {selectedFloor === 'Ground Floor' && (
           <g>
              <path d="M 330 500 L 330 650 M 370 500 L 370 650" stroke="rgba(74,158,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <text x="350" y="520" fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle" className="uppercase tracking-widest pointer-events-none font-berkeley-mono">Main Entrance</text>
           </g>
        )}
      </motion.svg>
    );
  };

  const getCampusGroundsSVG = () => {
    const BUILDINGS = [
      { id: 'hostel', name: 'Boys-hostel', x: 40, y: 40, w: 120, h: 60, notchSide: 'bottom' },
      { id: 'civil', name: 'Civil-block/Library', x: 310, y: 40, w: 160, h: 60, notchSide: 'bottom' },
      { id: 'mech', name: 'Mechanical-block', x: 585, y: 40, w: 150, h: 60, notchSide: 'bottom' },
      { id: 'canteen', name: 'Canteen', x: 10, y: 230, w: 90, h: 60, notchSide: 'right' },
      { id: 'main', name: 'Main-branch', x: 170, y: 200, w: 180, h: 90, notchSide: 'bottom' },
      { id: 'prakruthi', name: 'Prakruthi-college', x: 750, y: 210, w: 140, h: 70, notchSide: 'bottom' },
      { id: 'security', name: 'SECURITY', x: 280, y: 440, w: 90, h: 40, notchSide: 'left' }
    ];

    const GATES = [
      { id: 'gate-main', name: 'Main Gate', x: 190, y: 550, w: 140, h: 30 },
      { id: 'gate-back', name: 'Back Gate', x: 750, y: 550, w: 140, h: 30 }
    ];

    const AREAS = [
      { id: 'playground', label: 'PlayGround', x: 144, y: 144, w: 232, h: 50, stroke: 'rgba(156,163,175,0.4)', fill: 'rgba(156,163,175,0.02)', labelColor: 'rgba(156,163,175,0.8)' },
      { id: 'mango-groves', label: 'Mango Grooves', x: 404, y: 144, w: 242, h: 192, stroke: 'rgba(6,182,212,0.5)', fill: 'rgba(34,197,94,0.03)', labelColor: 'rgba(34,197,94,0.9)' },
      { id: 'mango-park', label: 'Mango-park', x: 274, y: 364, w: 532, h: 180, stroke: 'rgba(6,182,212,0.5)', fill: 'rgba(34,197,94,0.03)', labelColor: 'rgba(34,197,94,0.9)' },
      { id: 'parking', label: 'PARKING', x: 144, y: 364, w: 102, h: 180, stroke: 'rgba(156,163,175,0.5)', fill: 'rgba(156,163,175,0.02)', labelColor: 'rgba(156,163,175,0.6)' }
    ];

    const ROADS_PATHS = [
      `M 100,100 L 100,130 L 660,130`,
      `M 390,100 L 390,350`,
      `M 660,100 L 660,350`,
      `M 100,260 L 130,260 L 130,350 L 820,350`,
      `M 260,290 L 260,550`,
      `M 820,280 L 820,550`,
      `M 260,460 L 280,460`
    ];

    const getBldgPath = (x, y, w, h, notchSide) => {
      const nw = 16, nd = 12;
      if (notchSide === 'bottom') {
        return `M ${x},${y} L ${x+w},${y} L ${x+w},${y+h} L ${x+w/2+nw/2},${y+h} L ${x+w/2+nw/2},${y+h-nd} L ${x+w/2-nw/2},${y+h-nd} L ${x+w/2-nw/2},${y+h} L ${x},${y+h} Z`;
      }
      if (notchSide === 'right') {
        return `M ${x},${y} L ${x+w},${y} L ${x+w},${y+h/2-nw/2} L ${x+w-nd},${y+h/2-nw/2} L ${x+w-nd},${y+h/2+nw/2} L ${x+w},${y+h/2+nw/2} L ${x+w},${y+h} L ${x},${y+h} Z`;
      }
      if (notchSide === 'left') {
        return `M ${x},${y} L ${x+w},${y} L ${x+w},${y+h} L ${x},${y+h} L ${x},${y+h/2+nw/2} L ${x+nd},${y+h/2+nw/2} L ${x+nd},${y+h/2-nw/2} L ${x},${y+h/2-nw/2} Z`;
      }
      return `M ${x},${y} L ${x+w},${y} L ${x+w},${y+h} L ${x},${y+h} Z`;
    };

    return (
      <motion.svg
        key="grounds"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        viewBox="0 0 900 620"
        className="w-full max-w-[900px] mx-auto"
      >
        <defs>
          <pattern id="gd" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(74,158,255,0.04)" strokeWidth="0.5" />
          </pattern>
          <filter id="bldgGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feFlood floodColor="#f43f5e" floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gatePulse">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <style>{`
            @keyframes dashFlow { to { stroke-dashoffset: -40; } }
            @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
            .road-flow { animation: dashFlow 2.5s linear infinite; }
            .gate-pulse { animation: pulse 2s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* Background */}
        <rect width="900" height="620" fill="url(#gd)" />
        <rect width="900" height="620" rx="12" fill="none" stroke="rgba(74,158,255,0.08)" strokeWidth="1" />

        {/* ═══ REGIONS ═══ */}
        {AREAS.map(area => (
          <g key={area.id}>
            <rect x={area.x} y={area.y} width={area.w} height={area.h} rx="4" fill={area.fill} stroke={area.stroke} strokeWidth="1.5" strokeDasharray="6 6" className="pointer-events-none" />
            <text x={area.x + area.w/2} y={area.y + area.h/2} fill={area.labelColor} textAnchor="middle" dominantBaseline="central" fontSize="13" className="font-berkeley-mono pointer-events-none tracking-[0.15em]">{area.label}</text>
          </g>
        ))}

        {/* Mango Grooves Trees */}
        {[430, 470, 510, 550, 590, 630].map((tx, i) => (
          <circle key={`tree1-${i}`} cx={tx} cy={180 + (i % 3) * 20} r="2.5" fill="rgba(34,197,94,0.15)" className="pointer-events-none" />
        ))}
        {[445, 485, 525, 565, 605, 615].map((tx, i) => (
          <circle key={`tree2-${i}`} cx={tx} cy={280 - (i % 3) * 20} r="2.5" fill="rgba(34,197,94,0.15)" className="pointer-events-none" />
        ))}

        {/* ═══ ROADS ═══ */}
        <g>
          {/* Outer Edge */}
          <g fill="none" stroke="#06b6d4" strokeWidth="18" strokeLinecap="square" strokeLinejoin="miter">
            {ROADS_PATHS.map((d, i) => <path key={`out-${i}`} d={d} />)}
          </g>
          {/* Inner Surface */}
          <g fill="none" stroke="#0a1628" strokeWidth="14" strokeLinecap="square" strokeLinejoin="miter">
            {ROADS_PATHS.map((d, i) => <path key={`in-${i}`} d={d} />)}
          </g>
          {/* Center Dash */}
          <g fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="12 8" strokeLinecap="butt" strokeLinejoin="miter" className="road-flow">
            {ROADS_PATHS.map((d, i) => <path key={`dash-${i}`} d={d} />)}
          </g>
        </g>

        {/* ═══ COMPASS (Under Buildings in layer priority) ═══ */}
        <g transform="translate(830, 70)">
          <circle cx="0" cy="0" r="28" fill="rgba(74,158,255,0.03)" stroke="rgba(74,158,255,0.15)" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(74,158,255,0.08)" strokeWidth="0.5" />
          <path d="M 0,-22 L 0,22 M -22,0 L 22,0" stroke="rgba(74,158,255,0.2)" strokeWidth="1" />
          <path d="M -3,-16 L 0,-22 L 3,-16" fill="none" stroke="rgba(74,158,255,0.4)" strokeWidth="1.2" />
          <path d="M -3,16 L 0,22 L 3,16" fill="none" stroke="rgba(74,158,255,0.4)" strokeWidth="1.2" />
          <path d="M -16,-3 L -22,0 L -16,3" fill="none" stroke="rgba(74,158,255,0.4)" strokeWidth="1.2" />
          <path d="M 16,-3 L 22,0 L 16,3" fill="none" stroke="rgba(74,158,255,0.4)" strokeWidth="1.2" />
          <text x="0" y="-32" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="10" className="font-berkeley-mono">N</text>
          <text x="0" y="40" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="10" className="font-berkeley-mono">S</text>
          <text x="-34" y="4" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="10" className="font-berkeley-mono">W</text>
          <text x="34" y="4" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="10" className="font-berkeley-mono">E</text>
          <circle cx="0" cy="0" r="2.5" fill="rgba(74,158,255,0.5)" />
        </g>

        {/* ═══ BUILDINGS ═══ */}
        {BUILDINGS.map((b) => (
          <g key={b.id} className="cursor-pointer group" onMouseMove={(e) => setHoveredRoom({ name: b.name, x: e.clientX, y: e.clientY })} onMouseLeave={() => setHoveredRoom(null)} onClick={() => setActiveRoom({ name: b.name, type: 'Special', floor: 'Campus Grounds' })}>
            <path
              d={getBldgPath(b.x, b.y, b.w, b.h, b.notchSide)}
              fill="rgba(244, 63, 94, 0.15)"
              stroke="rgba(244, 63, 94, 0.8)"
              strokeWidth="1.5"
              className="transition-all duration-300 group-hover:brightness-150 group-hover:fill-[rgba(244,63,94,0.3)]"
              filter="url(#bldgGlow)"
            />
            <text
              x={b.x + b.w / 2 - (b.notchSide === 'right' ? 6 : (b.notchSide === 'left' ? -6 : 0))}
              y={b.y + b.h / 2 - (b.notchSide === 'bottom' ? 3 : 0)}
              fill="white"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={b.name.length > 13 ? "10" : "11"}
              className="font-berkeley-mono pointer-events-none tracking-wider group-hover:scale-110 group-hover:font-bold transition-transform duration-300 origin-center"
              style={{ transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h / 2}px` }}
            >
              {b.name}
            </text>
          </g>
        ))}

        {/* ═══ GATES ═══ */}
        {GATES.map((g, i) => (
          <g key={g.id} className="gate-pulse cursor-pointer group" style={{ animationDelay: i * 0.5 + 's' }} onClick={() => setActiveRoom({ name: g.name, type: 'Special', floor: 'Campus Grounds' })}>
            <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="4" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" filter="url(#gatePulse)" className="group-hover:brightness-150 transition-all" />
            <text x={g.x + g.w/2} y={g.y + g.h/2 + 1} fill="white" textAnchor="middle" fontSize="12" dominantBaseline="central" className="font-berkeley-mono tracking-[0.2em] pointer-events-none group-hover:scale-110 transition-transform origin-center" style={{ transformOrigin: `${g.x + g.w / 2}px ${g.y + g.h / 2}px` }}>
              {g.name}
            </text>
          </g>
        ))}

        {/* ═══ LABELS ═══ */}
        <text x="12" y="18" fill="rgba(74,158,255,0.25)" fontSize="8" className="font-berkeley-mono tracking-[0.4em] uppercase pointer-events-none">
          CAMPUS · GROUNDS · BLUEPRINT
        </text>
        <text x="888" y="608" fill="rgba(255,255,255,0.12)" textAnchor="end" fontSize="7" className="font-berkeley-mono tracking-[0.3em] pointer-events-none">
          CBIT KOLAR · NEX CAMPUS
        </text>
      </motion.svg>
    );
  };

  return (
    <main className="min-h-screen bg-[#0a1628] pt-24 pb-24 text-white flex flex-col items-center">
      <div className="w-full max-w-[700px] px-6 flex flex-col items-center">

        {/* Header */}
        <div className="mb-6 text-center w-full">
          <h1 className="text-3xl font-bold tracking-tight mb-1 font-satoshi text-[#4a9eff]">Campus Blueprint</h1>
          <p className="text-white/50 text-xs tracking-widest uppercase border-b border-white/10 pb-4 font-berkeley-mono">
            Interactive floor plan mapping system
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full mb-6" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4a9eff]/60 text-xl">search</span>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#4a9eff]/40 focus:border-[#4a9eff]/30 outline-none font-berkeley-mono transition-all"
            placeholder='Find a room — "CSE Lab", "Library", "Canteen"...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {searchFocus && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#0d1322] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                {suggestions.map((r, i) => (
                  <button key={i} onMouseDown={() => goToRoom(r)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                    <span className="material-symbols-outlined text-[#4a9eff]/60 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {r.type === 'Labs' ? 'computer' : r.type === 'Classrooms' ? 'school' : r.type === 'Staff' ? 'person' : r.type === 'Washrooms' ? 'wc' : 'location_on'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-berkeley-mono truncate">{r.name}</p>
                      <p className="text-[10px] text-white/30">{r.floor}</p>
                    </div>
                    {DIRECTIONS[r.name] && (
                      <span className="ml-auto text-[10px] text-[#4a9eff]/50 font-berkeley-mono">{DIRECTIONS[r.name].eta}</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center flex-wrap gap-4 mb-6 w-full">
           {LEGEND.map(item => (
             <div key={item.label} className="flex items-center gap-1.5 font-berkeley-mono text-[10px] uppercase tracking-widest text-white/70">
               <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }}></span>
               <span>{item.label}</span>
             </div>
           ))}
        </div>

        {/* Floor Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 w-full">
          {FLOORS.map((floor) => (
            <button
              key={floor}
              onClick={() => { setSelectedFloor(floor); setActiveRoom(null); }}
              className={`px-3 py-1.5 rounded text-[10px] uppercase font-berkeley-mono tracking-widest border transition-all ${
                selectedFloor === floor 
                  ? 'border-[#4a9eff] text-[#4a9eff] bg-[#4a9eff]/10' 
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

      </div>

      {/* Blueprint Canvas area */}
      <div className="w-full max-w-[700px] relative flex flex-col items-center overflow-hidden border border-white/5 bg-black/20 rounded-xl">
        <AnimatePresence mode="wait">
          {selectedFloor === 'Campus Grounds' ? getCampusGroundsSVG() : renderFloor()}
        </AnimatePresence>

        {/* Dynamic Tooltip on Hover */}
        <AnimatePresence>
          {hoveredRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed z-50 pointer-events-none px-2 py-1 bg-[#0a1628]/95 backdrop-blur rounded border border-[#3b82f6]/50 shadow-lg"
              style={{ left: hoveredRoom.x + 10, top: hoveredRoom.y + 10 }}
            >
              <span className="text-[#4a9eff] text-[10px] font-berkeley-mono uppercase tracking-widest">{hoveredRoom.name}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popup Map Card on Click */}
        <AnimatePresence>
          {activeRoom && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-4 right-4 bg-[#0a1628]/98 backdrop-blur border border-[#3b82f6]/30 shadow-2xl rounded-xl p-4 z-50"
            >
              <button onClick={() => setActiveRoom(null)}
                className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-base">close</span>
              </button>

              <div className="mb-1 text-[#4a9eff] font-berkeley-mono text-[9px] tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEGEND.find(l => l.label === 'Laboratories' && activeRoom.type === 'Labs' ? true : l.label.includes(activeRoom.type))?.color || '#4a9eff' }} />
                {activeRoom.floor} · {activeRoom.type}
              </div>
              <h3 className="text-base font-bold text-white mb-3 font-berkeley-mono pr-6">{activeRoom.name}</h3>

              {DIRECTIONS[activeRoom.name] ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2.5 bg-white/3 rounded-lg border border-white/5">
                    <span className="material-symbols-outlined text-[#4a9eff] text-base flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>directions_walk</span>
                    <div>
                      <p className="text-[10px] font-berkeley-mono text-white/40 uppercase tracking-widest mb-1">Route from Main Gate</p>
                      <p className="text-xs text-white/80 leading-relaxed">{DIRECTIONS[activeRoom.name].route}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-berkeley-mono text-white/40">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    Walking time: {DIRECTIONS[activeRoom.name].eta}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-white/40 font-berkeley-mono">Use the stairs on either side to reach this location.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
