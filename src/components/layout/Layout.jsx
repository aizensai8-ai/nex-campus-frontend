import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from '../ui/ScrollProgress';

const Layout = () => {
  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <ScrollProgress />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main id="main-content" className="flex-grow w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
