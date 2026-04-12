import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Portal from './pages/Portal';
import Courses from './pages/Courses';
import Events from './pages/Events';
import Facilities from './pages/Facilities';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Layout routes with Navbar & Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/events" element={<Events />} />
          <Route path="/facilities" element={<Facilities />} />
        </Route>

        {/* Standalone routes for Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
