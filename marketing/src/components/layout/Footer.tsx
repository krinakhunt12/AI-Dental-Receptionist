import { Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clinic } from '../../data/clinic';
import { services } from '../../data/services';
import { socialIcons } from '../ui/SocialIcons';
import { BrandLogo } from './BrandLogo';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Our dentists', to: '/dentists' },
  { label: 'Book appointment', to: '/book' },
  { label: 'AI chat', to: '/chat' },
  { label: 'Contact', to: '/contact' },
];

const socialIconMap = socialIcons;

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-4">
          <BrandLogo />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-500">
            Gentle, modern dental care for the whole family. Our team combines experienced dentists with a
            24/7 AI receptionist, so you can book, ask and plan whenever it suits you.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {clinic.socials.map((social) => {
              const Icon = socialIconMap[social.icon as keyof typeof socialIconMap];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`SmileCare on ${social.label}`}
                  className="flex size-10 items-center justify-center rounded-xl border border-line text-ink-500 transition-colors hover:border-brand-300 hover:bg-mint-50 hover:text-brand-700"
                >
                  {Icon ? <Icon className="size-4" aria-hidden /> : null}
                </a>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-900">Quick links</h2>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-[15px] text-ink-500 transition-colors hover:text-brand-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-900">Treatments</h2>
          <ul className="mt-5 space-y-3">
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <Link
                  to={`/services#${service.id}`}
                  className="text-[15px] text-ink-500 transition-colors hover:text-brand-700"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-900">Visit us</h2>
          <ul className="mt-5 space-y-3 text-[15px] text-ink-500">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <span>
                {clinic.address.line1}, {clinic.address.line2}, {clinic.address.city} {clinic.address.postalCode}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <a href={`tel:${clinic.phone}`} className="transition-colors hover:text-brand-700">
                {clinic.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <a href={`mailto:${clinic.email}`} className="transition-colors hover:text-brand-700">
                {clinic.email}
              </a>
            </li>
          </ul>

          <h3 className="mt-7 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-900">
            <Clock3 className="size-4 text-brand-600" aria-hidden />
            Opening hours
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-500">
            {clinic.hours.map((entry) => (
              <li key={entry.day} className="flex justify-between gap-4">
                <span>{entry.day}</span>
                <span className="font-semibold text-ink-700">{entry.open}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line bg-mint-50/60">
        <div className="container-page flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex items-start gap-2 text-sm text-ink-600">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
            <span>
              Our AI assistant helps with scheduling and clinic information. It does not provide medical advice.
            </span>
          </p>
          <p className="text-sm text-ink-400">
            © {new Date().getFullYear()} SmileCare Dental Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
