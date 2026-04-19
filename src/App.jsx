import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';
import NexBot from './components/NexBot';
import BootLoader from './components/BootLoader';
import Home from './pages/Home';
import Portal from './pages/Portal';
import Courses from './pages/Courses';
import Events from './pages/Events';
import Facilities from './pages/Facilities';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import Support from './pages/Support';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CampusMap from './pages/CampusMap';
import Faculty from './pages/Faculty';
import Placements from './pages/Placements';
import LostFound from './pages/LostFound';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
        {/* Layout routes with Navbar & Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/events" element={<Events />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/campus-map" element={<CampusMap />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Standalone routes for Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </AnimatePresence>
    <NexBot />
    <BootLoader onComplete={() => console.log('NexOS Booted.')} />
    </>
  );
}

export default App;
