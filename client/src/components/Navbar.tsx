import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, HardHat } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, setIsDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 text-navy-900 dark:text-white font-bold text-xl tracking-tight">
          <HardHat className="text-navy-600 dark:text-blue-400" />
          <span>Amna TV</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-600 dark:text-slate-300 hover:text-navy-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-900 dark:text-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 absolute top-full left-0 w-full shadow-lg py-6 px-4 flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-600 dark:text-slate-300 hover:text-navy-600 dark:hover:text-blue-400 font-medium text-lg py-2"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
