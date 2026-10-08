import Logo from './Logo';

export default function LoadingSpinner({ message = 'Loading SmileCare AI Portal…' }: { message?: string }) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 text-slate-400 font-sans">
      <div className="mb-4 animate-bounce">
        <Logo variant="icon" size="xl" animated={true} />
      </div>
      <div className="text-sm font-semibold tracking-wide text-teal-400 animate-pulse font-heading">
        {message}
      </div>
    </div>
  );
}
