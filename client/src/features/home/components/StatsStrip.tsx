import {
  HiBuildingOffice2,
  HiClock,
  HiArrowTrendingUp,
  HiBolt,
} from 'react-icons/hi2';

export default function StatsStrip() {
  const STATS = [
    {
      value: '250+',
      label: 'Registered Clinics',
      icon: HiBuildingOffice2,
    },
    {
      value: '24/7',
      label: 'AI Reception Uptime',
      icon: HiClock,
    },
    {
      value: '40%+',
      label: 'Booking Increase',
      icon: HiArrowTrendingUp,
    },
    {
      value: '< 2 sec',
      label: 'Average Response Time',
      icon: HiBolt,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-4 border-t border-white/10 mt-2">
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex flex-col p-4 rounded-xl bg-slate-900/50 border border-white/10 hover:border-teal-500/30 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className="text-teal-400 text-lg shrink-0" aria-hidden="true" />
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading">
                {stat.value}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-normal leading-tight">
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
