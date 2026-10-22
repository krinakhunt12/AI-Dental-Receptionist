import { motion, useReducedMotion } from 'framer-motion';
import { Bot, MessageCircle, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../ui/Button';

interface ChatLine {
  side: 'user' | 'assistant';
  text: string;
  delay?: number;
}

const conversation: ChatLine[] = [
  { side: 'user', text: "Hi! I'd like to book a dental cleaning tomorrow." },
  { side: 'assistant', text: 'Of course. I have 10 AM, 2 PM and 5 PM open tomorrow. Which time suits you?' },
  { side: 'user', text: 'Around 5 PM, please.' },
  { side: 'assistant', text: '5 PM is available. May I have your name and phone number?' },
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mint-50 via-white to-canvas">
      <div
        className="pointer-events-none absolute -right-32 -top-40 size-[520px] rounded-full bg-brand-100/50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-accent-100/40 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-700 shadow-soft"
          >
            <Sparkles className="size-3.5" aria-hidden />
            24/7 AI receptionist
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-6 text-4xl font-extrabold leading-[1.08] text-ink-900 sm:text-5xl lg:text-6xl"
          >
            Healthy smiles,
            <span className="text-brand-600"> booked in seconds.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600"
          >
            Gentle dental care from experienced dentists, backed by an AI receptionist that answers your questions
            and books your appointment by chat or voice — at 2 PM or 2 AM.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink to="/book" size="lg" variant="accent" className="w-full sm:w-auto">
              Book Appointment
            </ButtonLink>
            <ButtonLink to="/chat" size="lg" variant="outline" className="w-full sm:w-auto">
              <MessageCircle className="size-4" aria-hidden />
              Chat with our AI Assistant
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 text-sm font-semibold text-ink-600"
          >
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-4 fill-accent-400 text-accent-400" />
                ))}
              </span>
              4.9 rating
            </span>
            <span className="size-1 rounded-full bg-ink-300" aria-hidden />
            <span>5,000+ happy patients</span>
            <span className="size-1 rounded-full bg-ink-300" aria-hidden />
            <span>15+ years experience</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -right-6 -top-6 hidden rounded-2xl border border-line bg-white px-4 py-3 shadow-card sm:block">
            <p className="text-xs font-bold text-ink-900">Booking speed</p>
            <p className="mt-0.5 text-sm font-semibold text-brand-700">22 seconds average</p>
          </div>

          <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-line bg-white px-4 py-3 shadow-card sm:block">
            <p className="text-xs font-bold text-ink-900">Last booking</p>
            <p className="mt-0.5 text-sm font-semibold text-brand-700">Cleaning · Today 5:00 PM</p>
          </div>

          <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <span className="relative flex size-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Bot className="size-5" aria-hidden />
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
              </span>
              <div>
                <p className="text-[15px] font-bold text-ink-900">SmileCare Assistant</p>
                <p className="text-xs font-medium text-emerald-700">Online 24/7</p>
              </div>
              <span className="ml-auto rounded-full bg-mint-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                Live chat
              </span>
            </div>

            <div className="space-y-3 py-5">
              {conversation.map((line, index) => (
                <motion.div
                  key={line.text}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.5 + index * 0.35 }}
                  className={line.side === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      line.side === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-tr-md bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white'
                        : 'max-w-[88%] rounded-2xl rounded-tl-md bg-ink-100 px-4 py-2.5 text-sm leading-relaxed text-ink-800'
                    }
                  >
                    {line.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-line bg-ink-50/70 px-4 py-3 text-sm text-ink-400">
              <MessageCircle className="size-4" aria-hidden />
              Ask about prices, timings or a treatment…
            </div>

            <p className="mt-4 text-center text-xs text-ink-400">
              Prefer a call?{' '}
              <Link to="/contact" className="font-semibold text-brand-700 underline underline-offset-2">
                Reach our front desk
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
