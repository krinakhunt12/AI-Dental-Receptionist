import {
  Anchor,
  AlignHorizontalSpaceAround,
  CircleDot,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  type LucideIcon,
} from 'lucide-react';

const registry: Record<string, LucideIcon> = {
  Anchor,
  AlignHorizontalSpaceAround,
  CircleDot,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
};

export function resolveServiceIcon(name: string): LucideIcon {
  return registry[name] ?? Sparkles;
}
