// src/layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';

const Layout: React.FC = () => {
  return (
    <div className='flex flex-col h-full'>
      <Navbar />
      <main className="p-2 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
