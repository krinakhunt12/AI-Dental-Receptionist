import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServicesQuery } from './hooks/useServicesQuery';
import { api, queryKeys } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store/useUIStore';
import {
  HiBookmarkSquare,
  HiClock,
  HiUserGroup,
  HiPlus,
} from 'react-icons/hi2';
import { AlertCircle } from 'lucide-react';

export default function ServicesPage() {
  const { services, isLoading } = useServicesQuery();
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('1500');
  const [duration, setDuration] = useState('30');
  const [description, setDescription] = useState('');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setPrice('1500');
    setDuration('30');
    setDescription('');
    setInlineError(null);
    setIsSubmitting(false);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (!name.trim()) {
      setInlineError('Service name is required.');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setInlineError('Please enter a valid price.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createService({
        name: name.trim(),
        price: numPrice,
        durationMins: parseInt(duration, 10) || 30,
        description: description.trim() || undefined,
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.services });
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('treatments') || query.queryKey.includes('services'),
      });

      addToast({
        type: 'success',
        title: 'Service Added',
        message: `${name.trim()} added to the dental procedure catalog.`,
      });

      setIsAddServiceOpen(false);
      resetForm();
    } catch (err: unknown) {
      setInlineError(err instanceof Error ? err.message : 'Failed to create service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading Services Catalog & Pricing…" />;
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-8 font-sans text-slate-100 bg-[#070a12] min-h-screen">
      {/* View Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <HiBookmarkSquare className="text-teal-400 text-3xl" />
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-heading">
              Dental Services & Transparent Pricing Catalog
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Catalog of dental treatments, standard prices in ₹ (INR), slot duration times, and assigned specialist mappings.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsAddServiceOpen(true);
          }}
          className="shrink-0"
        >
          <HiPlus className="w-4 h-4 mr-1.5" />
          Add Service
        </Button>
      </div>

      {/* Services Dark Table Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in-delayed">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-teal-400">
                <th className="p-4">Service Procedure</th>
                <th className="p-4">Standard Price (INR)</th>
                <th className="p-4">Slot Duration</th>
                <th className="p-4">Assigned Specialist(s)</th>
                <th className="p-4">Pricing Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/50 transition-colors duration-200">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                      <HiBookmarkSquare />
                    </div>
                    <span className="font-heading text-base">{s.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-emerald-300 bg-emerald-950/70 border border-emerald-700/80 px-3.5 py-1 rounded-full text-xs inline-flex items-center gap-0.5 font-mono shadow-sm">
                      ₹{s.priceInr.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <HiClock className="text-teal-400" />
                      <span>{s.durationMin} min</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <HiUserGroup className="text-indigo-400" />
                      <span>
                        {s.dentistIds
                          .map((id) => (id === 'patel' ? 'Dr. Patel' : id === 'shah' ? 'Dr. Shah' : id))
                          .join(', ')}
                      </span>
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400 max-w-xs">
                    {s.priceNote || 'Standard fixed clinic procedure rate.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SERVICE MODAL */}
      <Modal
        open={isAddServiceOpen}
        onClose={() => {
          setIsAddServiceOpen(false);
          resetForm();
        }}
        title="Add Dental Service / Treatment"
        description="Register a new clinical procedure with standard pricing in ₹ (INR) and duration."
        size="md"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          {inlineError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{inlineError}</span>
            </div>
          )}

          <Input
            label="Service / Procedure Name *"
            placeholder="e.g. Composite Dental Veneer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Standard Price (₹ INR) *"
              placeholder="e.g. 2500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <Input
              type="number"
              label="Slot Duration (Minutes) *"
              placeholder="e.g. 45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Pricing / Procedure Notes
            </label>
            <textarea
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 text-slate-900"
              rows={2}
              placeholder="e.g. Includes pre-scan and local anesthesia."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddServiceOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
