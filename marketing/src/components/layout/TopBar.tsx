import { Clock3, PhoneCall } from 'lucide-react';
import { clinic } from '../../data/clinic';

export function TopBar() {
  return (
    <div className="hidden border-b border-line bg-ink-900 text-white md:block">
      <div className="container-page flex h-9 items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${clinic.phone}`}
            className="flex items-center gap-2 text-ink-200 transition-colors hover:text-white"
          >
            <PhoneCall className="size-3.5" aria-hidden />
            <span className="font-medium">{clinic.phoneDisplay}</span>
          </a>
          <span className="flex items-center gap-2 text-ink-300">
            <Clock3 className="size-3.5" aria-hidden />
            <span>
              Mon–Fri 9 AM–8 PM · Sat 9 AM–6 PM
            </span>
          </span>
        </div>
        <a
          href={`tel:${clinic.phone}`}
          className="flex items-center gap-2 rounded-full bg-alert-500/15 px-3 py-1 font-semibold text-alert-100 transition-colors hover:bg-alert-500/25"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-alert-500 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-alert-500" />
          </span>
          Emergency? Call now
        </a>
      </div>
    </div>
  );
}
