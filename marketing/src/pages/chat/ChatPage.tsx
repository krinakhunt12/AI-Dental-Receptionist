import { CalendarCheck, Clock3, MessageCircle, ShieldAlert, Wallet } from 'lucide-react';
import { ChatPanel } from '../components/chat/ChatPanel';
import { PageHeader } from '../components/sections/PageHeader';
import { Card } from '../components/ui/Card';
import { clinic } from '../data/clinic';
import { useSeo } from '../lib/useSeo';

const capabilities = [
  { icon: CalendarCheck, title: 'Book appointments', text: 'Live slots, chosen in a single message.' },
  { icon: Wallet, title: 'Share prices', text: 'Exact fees for every treatment, instantly.' },
  { icon: Clock3, title: 'Opening hours', text: 'Clinic timings, parking and directions.' },
  { icon: MessageCircle, title: 'Hand off to a human', text: 'Ask for the receptionist any time.' },
];

export function ChatPage() {
  useSeo({
    title: 'Chat with our AI Assistant | SmileCare Dental Clinic',
    description:
      'Ask our 24/7 AI assistant about dental treatments, prices, opening hours and appointments. It books your slot by chat or voice and hands over to a human when you need one.',
    path: '/chat',
  });

  return (
    <>
      <PageHeader
        eyebrow="AI assistant"
        title="Chat with the SmileCare assistant"
        description="Available 24/7 for scheduling and clinic information. It answers instantly, books your slot and passes you to a human whenever you ask."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'AI chat' }]}
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="h-[32rem] sm:h-[36rem]">
            <ChatPanel variant="page" />
          </div>

          <aside className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-ink-900">What it can do</h2>
              <ul className="mt-4 space-y-4">
                {capabilities.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-mint-50 text-brand-600">
                      <item.icon className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink-900">{item.title}</span>
                      <span className="block text-sm text-ink-500">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="rounded-2xl border border-alert-500/30 bg-alert-50 p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-alert-700">
                <ShieldAlert className="size-5" aria-hidden />
                Not a medical adviser
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-alert-700">
                The assistant helps with scheduling and clinic information only. It does not diagnose, prescribe or
                give medical advice. Severe bleeding, major facial swelling, difficulty breathing or a serious
                injury means calling emergency services immediately.
              </p>
              <a
                href={`tel:${clinic.phone}`}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-alert-600 px-4 text-sm font-bold text-white transition-colors hover:bg-alert-700"
              >
                Call {clinic.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
