// src/components/layout/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out
      ${scrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg py-2' 
        : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="relative group"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent
              hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
              SG
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600
              group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link 
                key={item.path} 
                to={item.path}
                className="relative px-3 py-2 group"
              >
                <div className="relative overflow-hidden">
                  <span className={`text-base font-medium transition-colors duration-300
                    ${location.pathname === item.path 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {item.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600
                    transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </div>
              </Link>
            ))}
            <Button 
              className="ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600
                text-white font-medium px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300
                shadow-lg hover:shadow-xl"
            >
              <a  href="/Shishir_Ghimire.pdf" download='Shishir_Ghimire.pdf' >
              Resume
              </a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 focus:outline-none group"
          >
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ease-in-out
                ${isMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ease-in-out mt-1
                ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ease-in-out mt-1
                ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="pt-4 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 text-base font-medium rounded-lg text-white transition-all duration-300
                  ${location.pathname === item.path
                    ? 'bg-gradient-to-r from-purple-600/10 to-pink-600/10 text-purple-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {item.label}
              </Link>
            ))}
            <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white
              hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
              Resume
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;