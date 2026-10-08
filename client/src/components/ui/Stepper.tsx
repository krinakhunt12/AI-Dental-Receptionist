import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  subtitle?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Connecting line background */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

        {/* Progress line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-teal-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
              className={`relative z-10 flex flex-col items-center group ${
                isCompleted && onStepClick ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2 ${
                  isCompleted
                    ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-white dark:bg-slate-900 border-teal-600 text-teal-600 ring-4 ring-teal-100 dark:ring-teal-950'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : step.id}
              </div>

              <div className="mt-2 text-center">
                <span
                  className={`block text-xs font-semibold ${
                    isCurrent
                      ? 'text-teal-700 dark:text-teal-400'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
                {step.subtitle && (
                  <span className="hidden sm:block text-[11px] text-slate-400">{step.subtitle}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
