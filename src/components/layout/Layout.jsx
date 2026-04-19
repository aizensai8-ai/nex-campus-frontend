import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from '../ui/ScrollProgress';

const Layout = () => {
  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <ScrollProgress />
      
      {/* Global Orbital Aurora */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="mesh-blob w-[500px] h-[500px] bg-primary top-[-100px] left-[-100px]" style={{ animationDelay: '0s' }}></div>
        <div className="mesh-blob w-[600px] h-[600px] bg-secondary top-[20%] right-[-200px]" style={{ animationDelay: '-5s', animationDuration: '25s' }}></div>
        <div className="mesh-blob w-[400px] h-[400px] bg-tertiary-fixed bottom-[-100px] left-[30%]" style={{ animationDelay: '-10s', animationDuration: '30s' }}></div>
      </div>

      <div className="flex flex-col min-h-screen relative z-0">
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
