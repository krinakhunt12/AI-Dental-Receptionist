import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const controlClasses =
  'w-full rounded-xl border bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12 disabled:bg-ink-50 disabled:text-ink-400';

export interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  optional?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, optional, containerClassName, className, id, required, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={inputId} className="text-sm font-semibold text-ink-800">
        {label}
        {required && (
          <span className="ml-1 text-alert-600" aria-hidden>
            *
          </span>
        )}
        {optional && <span className="ml-2 text-xs font-medium text-ink-400">Optional</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          controlClasses,
          'h-11',
          error ? 'border-alert-500 focus:border-alert-500 focus:ring-alert-500/12' : 'border-line',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-sm font-medium text-alert-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="text-xs text-ink-400">
            {hint}
          </p>
        )
      )}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, optional, containerClassName, className, id, required, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const describedBy = error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={textareaId} className="text-sm font-semibold text-ink-800">
        {label}
        {required && (
          <span className="ml-1 text-alert-600" aria-hidden>
            *
          </span>
        )}
        {optional && <span className="ml-2 text-xs font-medium text-ink-400">Optional</span>}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          controlClasses,
          'min-h-28 resize-y py-3',
          error ? 'border-alert-500 focus:border-alert-500 focus:ring-alert-500/12' : 'border-line',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${textareaId}-error`} role="alert" className="text-sm font-medium text-alert-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${textareaId}-hint`} className="text-xs text-ink-400">
            {hint}
          </p>
        )
      )}
    </div>
  );
});
