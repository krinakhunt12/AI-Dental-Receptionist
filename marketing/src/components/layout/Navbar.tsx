import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Menu, PhoneCall, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { clinic } from '../../data/clinic';
import { BrandLogo } from './BrandLogo';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Dentists', to: '/dentists' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          'border-b transition-all duration-300',
          scrolled
            ? 'border-line bg-white/85 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-white/70 backdrop-blur-md',
        )}
      >
        <nav aria-label="Main" className="container-page flex h-16 items-center justify-between gap-6 lg:h-[72px]">
          <Link to="/" className="rounded-xl" aria-label="SmileCare Dental Clinic — home">
            <BrandLogo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors',
                      isActive
                        ? 'text-brand-700'
                        : 'text-ink-600 hover:bg-mint-50 hover:text-ink-900',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-600"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${clinic.phone}`}
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <PhoneCall className="size-4" aria-hidden />
              {clinic.phoneDisplay}
            </a>
            <Link
              to="/book"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-500 px-5 text-sm font-bold text-ink-900 shadow-soft transition-all hover:bg-accent-400 hover:shadow-card"
            >
              <CalendarCheck className="size-4" aria-hidden />
              Book Appointment
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex size-11 items-center justify-center rounded-xl border border-line bg-white text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </nav>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-line bg-white/95 backdrop-blur-xl lg:hidden"
            >
              <div className="container-page space-y-1 py-4">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors',
                        isActive ? 'bg-mint-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to="/book"
                  className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 text-sm font-bold text-ink-900"
                >
                  <CalendarCheck className="size-4" aria-hidden />
                  Book Appointment
                </Link>
                <a
                  href={`tel:${clinic.phone}`}
                  className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm font-semibold text-ink-700"
                >
                  <PhoneCall className="size-4" aria-hidden />
                  {clinic.phoneDisplay}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
