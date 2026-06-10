"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Activity, Cpu, Network, Shield, Landmark, Eye, HelpCircle, FileText, Bell } from 'lucide-react';
import { m, AnimatePresence, type Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import logoImg from '../assets/Digi new color logo.png';

const navLinks = [
  { name: 'About Us', hasDropdown: false, path: '/about' },
  {
    name: 'Investors',
    hasDropdown: true,
    sublinks: [
      { name: 'SEC Filings', path: '/sec-filings', desc: 'Regulatory financial declarations', icon: <FileText className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Documents & Charters', path: '/documents-charters', desc: 'Corporate governance materials', icon: <Landmark className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Investor Center', path: '/investors', desc: 'General investor hub & updates', icon: <Eye className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Email Alerts', path: '/email-alerts', desc: 'Live investor updates and notifications', icon: <Bell className="w-4 h-4 text-brand-yellow" /> },
    ]
  },
  {
    name: 'Infrastructure',
    hasDropdown: true,
    sublinks: [
      { name: 'Energy', path: '/energy', desc: 'Owned high-density power generation', icon: <Cpu className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Global Network', path: '/global-network', desc: 'US footprint inter-site backbone', icon: <Network className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Data Centers', path: '/data-centers', desc: 'Tier III modular compute campuses', icon: <Shield className="w-4 h-4 text-brand-yellow" /> },
    ]
  },
  { name: 'Services', hasDropdown: false, path: '/services' },
  {
    name: 'Company',
    hasDropdown: true,
    sublinks: [
      { name: 'Mission & Vision', path: '/mission-vision', desc: 'Strategic priorities and targets', icon: <Cpu className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Leadership', path: '/leadership', desc: 'Meet our executive leadership team', icon: <Activity className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Press Release', path: '/press-releases', desc: 'Latest media and company releases', icon: <Network className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Careers', path: '/careers', desc: 'Join our high-performance mission', icon: <Shield className="w-4 h-4 text-brand-yellow" /> },
      { name: 'Partnership', path: '/partnership', desc: 'Collaborate and build the future together', icon: <HelpCircle className="w-4 h-4 text-brand-yellow" /> },
    ]
  },
  { name: 'NeoCloudz', hasDropdown: false, path: '/neocloudz', href: 'https://www.neocloudz.com/' },
];

const menuVariants: Variants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.25,
      ease: [0.36, 0.07, 0.19, 0.97]
    }
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 28,
      mass: 0.8
    }
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setTimeout(() => {
      router.push(path);
    }, 250);
  };

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.path && pathname === link.path) return true;
    if (link.hasDropdown && link.sublinks) {
      return link.sublinks.some(sub => pathname === sub.path);
    }
    return false;
  };

  const activeClass = "nav-link flex items-center gap-1 xl:gap-1.5 text-[11px] xl:text-[13px] font-bold uppercase tracking-widest text-brand-yellow px-2.5 xl:px-4.5 py-1.5 xl:py-2 nav-glass-bubble";
  const inactiveClass = "nav-link flex items-center gap-1 xl:gap-1.5 text-[11px] xl:text-[13px] font-semibold uppercase tracking-widest text-white/70 hover:text-brand-yellow px-2.5 xl:px-4.5 py-1.5 xl:py-2 nav-inactive-bubble";

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999]">
      {/* Background layer with blur & transition to prevent containing block issue for fixed children */}
      <div className={`absolute inset-0 transition-all duration-300 -z-10 ${scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-black'
        } border-b border-white/10`} />

      <div className={`relative z-[120] max-w-[1800px] mx-auto px-4 md:px-6 lg:px-4 xl:px-8 flex items-center justify-between gap-2 lg:gap-3 xl:gap-4 transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'
        }`}>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 relative z-[120]" onClick={() => setIsMenuOpen(false)}>
          <img src={logoImg.src} alt="DigiPowerX Logo" className="h-24 md:h-28 lg:h-20 xl:h-24 2xl:h-28 w-auto object-contain transition-all duration-300 brightness-0 invert" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-4 flex-shrink-0">
          {navLinks.filter(l => l.name !== 'NeoCloudz').map(link => {
            const active = isLinkActive(link);
            const linkClass = active ? activeClass : inactiveClass;

            if (link.hasDropdown) {
              return (
                <div key={link.name} className="relative group">
                  <button className={linkClass}>
                    {link.name} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[110]">
                    <div className="bg-black/95 border border-white/10 backdrop-blur-xl p-4 min-w-[240px] shadow-2xl flex flex-col gap-3 rounded-lg">
                      {link.sublinks?.map(sub => {
                        const subActive = pathname === sub.path;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            className={`flex items-start gap-3 p-2 rounded transition-colors group/item ${subActive ? 'bg-white/10 border border-brand-yellow/20' : 'hover:bg-white/5'
                              }`}
                          >
                            <div className="mt-0.5">{sub.icon}</div>
                            <div>
                              <div className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${subActive ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow group-hover/item:text-brand-yellow'
                                }`}>
                                {sub.name}
                              </div>
                              <div className="text-[9px] text-white/40 font-medium normal-case mt-0.5 leading-snug">
                                {sub.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            if (link.href) {
              const isNeo = link.name === 'NeoCloudz';
              const isUsdc = link.name === 'USDC';
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    isNeo
                      ? "bg-brand-yellow text-black px-4 py-2 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-md shadow-brand-yellow/25 rounded whitespace-nowrap"
                      : isUsdc
                        ? "bg-brand-yellow text-black px-4 py-2 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-md shadow-brand-yellow/25 rounded whitespace-nowrap"
                        : linkClass
                  }
                >
                  {link.name}
                </a>
              );
            }

            const isNeo = link.name === 'NeoCloudz';
            const isUsdc = link.name === 'USDC';
            return (
              <Link
                key={link.name}
                href={link.path || '#'}
                className={
                  isNeo
                    ? "bg-brand-yellow text-black px-4 py-2 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-md shadow-brand-yellow/25 rounded whitespace-nowrap"
                    : isUsdc
                      ? "bg-brand-yellow text-black px-4 py-2 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-md shadow-brand-yellow/25 rounded whitespace-nowrap"
                      : linkClass
                }
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions / Mob Toggle */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 relative z-[120]">
          <a
            href="https://www.neocloudz.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex btn-global btn-primary lg:px-4 lg:py-2 lg:text-[10px] xl:px-6 xl:py-3.5 xl:text-[11px]"
          >
            NeoCloudz
          </a>
          <Link href="/contact" className="hidden sm:inline-flex btn-global btn-primary lg:px-4 lg:py-2 lg:text-[10px] xl:px-6 xl:py-3.5 xl:text-[11px]">
            Talk to Us
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 bg-brand-yellow text-black rounded-full shadow-xl hover:bg-white transition-all active:scale-90 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 bg-black/80 z-[110] lg:hidden touch-none"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <m.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-full sm:w-[85%] max-w-[420px] bg-[#07080a] border-l border-white/10 z-[115] flex flex-col pt-24 pb-10 px-6 sm:px-8 overflow-y-auto lg:hidden shadow-[-10px_0_30px_rgba(0,0,0,0.5)] overscroll-contain will-change-transform"
            >
              {/* Subtle visual glow in background of menu */}
              <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="flex flex-col gap-4 relative z-10">
                <div className="text-[10px] font-bold text-white/35 uppercase tracking-[0.4em] mb-2 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_#f5c518]" /> Navigation
                </div>

                {navLinks.map((link) => {
                  const isOpen = activeDropdown === link.name;
                  const active = isLinkActive(link);
                  return (
                    <div key={link.name} className="border-b border-white/5 pb-2">
                      {link.hasDropdown ? (
                        <div className="flex flex-col">
                          <button
                            onClick={() => toggleDropdown(link.name)}
                            className={`w-full flex items-center justify-between text-lg sm:text-xl font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all ${active ? 'text-brand-yellow bg-white/5 border border-brand-yellow/20 shadow-[0_0_15px_rgba(245,197,24,0.1)]' : 'text-white hover:text-brand-yellow'
                              }`}
                          >
                            <span>{link.name}</span>
                            <ChevronDown
                              size={16}
                              className={`text-brand-yellow transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {/* Sublinks Container */}
                          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                            <div className="overflow-hidden flex flex-col gap-2 pl-3 border-l border-brand-yellow/30">
                              {link.sublinks?.map(sub => {
                                const subActive = pathname === sub.path;
                                return (
                                  <Link
                                    key={sub.name}
                                    href={sub.path}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors uppercase tracking-widest ${subActive ? 'text-brand-yellow bg-white/5' : 'text-white/60 hover:text-brand-yellow'
                                      }`}
                                    onClick={(e) => handleMobileClick(e, sub.path)}
                                  >
                                    {sub.icon}
                                    <span>{sub.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : link.href ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            link.name === 'NeoCloudz'
                              ? "flex items-center justify-between text-base font-bold text-black bg-brand-yellow py-3 px-4 rounded uppercase tracking-wider hover:bg-white transition-all my-1.5 shadow-md shadow-brand-yellow/10"
                              : link.name === 'USDC'
                                ? "flex items-center justify-between text-base font-bold text-black bg-brand-yellow py-3 px-4 rounded uppercase tracking-wider hover:bg-white transition-all my-1.5 shadow-md shadow-brand-yellow/10"
                                : `flex items-center justify-between text-lg sm:text-xl font-bold py-2.5 px-4 rounded-xl transition-all uppercase tracking-wider ${active ? 'text-brand-yellow bg-white/5 border border-brand-yellow/20' : 'text-white hover:text-brand-yellow'
                                }`
                          }
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{link.name}</span>
                          <ArrowRight size={14} className={link.name === 'NeoCloudz' ? "text-black" : link.name === 'USDC' ? "text-black" : "text-brand-yellow"} />
                        </a>
                      ) : (
                        <Link
                          href={link.path || '#'}
                          className={
                            link.name === 'NeoCloudz'
                              ? "flex items-center justify-between text-base font-bold text-black bg-brand-yellow py-3 px-4 rounded uppercase tracking-wider hover:bg-white transition-all my-1.5 shadow-md shadow-brand-yellow/10"
                              : link.name === 'USDC'
                                ? "flex items-center justify-between text-base font-bold text-black bg-brand-yellow py-3 px-4 rounded uppercase tracking-wider hover:bg-white transition-all my-1.5 shadow-md shadow-brand-yellow/10"
                                : `flex items-center justify-between text-lg sm:text-xl font-bold py-2.5 px-4 rounded-xl transition-all uppercase tracking-wider ${active ? 'text-brand-yellow bg-white/5 border border-brand-yellow/20' : 'text-white hover:text-brand-yellow'
                                }`
                          }
                          onClick={(e) => handleMobileClick(e, link.path || '#')}
                        >
                          <span>{link.name}</span>
                          <ArrowRight size={14} className={link.name === 'NeoCloudz' ? "text-black" : link.name === 'USDC' ? "text-black" : "text-brand-yellow"} />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Info & Secondary Actions */}
              <div className="mt-auto pt-8 flex flex-col gap-6 relative z-10">
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-white/45">Headquarters</span>
                    <span className="text-[11px] font-bold text-white uppercase">Miami, Florida</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-white/45">System Posture</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <span className="text-[11px] font-bold text-white uppercase">Operational</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/contact"
                    className="w-full btn-global btn-primary"
                    onClick={(e) => handleMobileClick(e, '/contact')}
                  >
                    Talk to Our Team
                  </Link>
                  <Link
                    href="/investors"
                    className="w-full btn-global btn-secondary"
                    onClick={(e) => handleMobileClick(e, '/investors')}
                  >
                    Investor Relations
                  </Link>
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;
