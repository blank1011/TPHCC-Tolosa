import { CalendarDays, Moon, Sparkles, Users, Hand } from 'lucide-react';

const services = [
  { icon: CalendarDays, title: 'Sunday Morning', lines: ['Sunday School: 9:30 AM', 'Worship: 10:30 AM'] },
  { icon: Moon, title: 'Sunday Evening', lines: ['Evening Service: 5:30 PM'] },
  { icon: Sparkles, title: 'Wednesday Evening', lines: ['Midweek Service: 5:30 PM'] },
  { icon: Users, title: 'Discipleship Friday', lines: ['Group Study: 6:30 PM'] },
  { icon: Hand, title: 'Saturday Prayer', lines: ['Prayer Meeting: 6:00 AM', 'Outreach: 7:00 AM'] },
  { icon: Sparkles, title: '180Jam', lines: ['Last Friday Monthly: 5:00 PM'] },
];

export default function ServiceTimes() {
  return (
    <section
      className="relative overflow-hidden bg-navy/80 py-16 text-white"
      style={{ backgroundImage: 'url(/images/world_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Weekly Rhythm</p>
            <h2 className="mt-3 text-3xl font-bold">Service Times</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-200">
            Join us for worship, prayer, discipleship, and outreach throughout the week. Our doors are open to everyone.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="rounded-[1.5rem] bg-white/10 p-6 shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-1" key={service.title}>
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-red-400">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-white">{service.title}</h3>
                <div className="space-y-2 text-sm text-slate-200">
                  {service.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
