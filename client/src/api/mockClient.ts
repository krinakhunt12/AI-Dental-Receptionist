import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SEED_APPOINTMENTS,
  SEED_PATIENTS,
  SEED_CONVERSATIONS,
  SEED_DOCTORS,
  SEED_INVOICES,
  SEED_AI_GAPS,
  Appointment,
  Patient,
  Conversation,
  Doctor,
  Invoice,
} from '../mocks/seedData';
import { useTenant } from '../app/TenantProvider';

// Local memory store for interactive changes during runtime
let appointmentsStore = [...SEED_APPOINTMENTS];
let patientsStore = [...SEED_PATIENTS];
let conversationsStore = [...SEED_CONVERSATIONS];
let doctorsStore = [...SEED_DOCTORS];
let invoicesStore = [...SEED_INVOICES];
let gapsStore = [...SEED_AI_GAPS];

// --- QUERIES ---

export function useAppointmentsQuery() {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['appointments', tenant.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200)); // simulated latency
      return [...appointmentsStore];
    },
  });
}

export function usePatientsQuery() {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['patients', tenant.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return [...patientsStore];
    },
  });
}

export function useConversationsQuery() {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['conversations', tenant.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return [...conversationsStore];
    },
    refetchInterval: 15000, // 15s background refetch for live feed
  });
}

export function useDoctorsQuery() {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['doctors', tenant.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return [...doctorsStore];
    },
  });
}

export function useInvoicesQuery() {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['invoices', tenant.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return [...invoicesStore];
    },
  });
}

export function useKnowledgeGapsQuery() {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['knowledgeGaps', tenant.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return [...gapsStore];
    },
  });
}

// --- MUTATIONS WITH OPTIMISTIC UPDATES ---

export function useRescheduleAppointmentMutation() {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();

  return useMutation({
    mutationFn: async ({ id, newDate, newTime }: { id: string; newDate: string; newTime: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const idx = appointmentsStore.findIndex((a) => a.id === id);
      if (idx !== -1) {
        appointmentsStore[idx] = {
          ...appointmentsStore[idx],
          date: newDate,
          time: newTime,
          status: 'Confirmed',
        };
      }
      return appointmentsStore[idx];
    },
    onMutate: async ({ id, newDate, newTime }) => {
      await queryClient.cancelQueries({ queryKey: ['appointments', tenant.id] });
      const previous = queryClient.getQueryData<Appointment[]>(['appointments', tenant.id]);

      queryClient.setQueryData<Appointment[]>(['appointments', tenant.id], (old) =>
        old
          ? old.map((apt) =>
              apt.id === id ? { ...apt, date: newDate, time: newTime, status: 'Confirmed' } : apt
            )
          : []
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['appointments', tenant.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', tenant.id] });
    },
  });
}

export function useUpdateAppointmentStatusMutation() {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Appointment['status'] }) => {
      await new Promise((r) => setTimeout(r, 200));
      const idx = appointmentsStore.findIndex((a) => a.id === id);
      if (idx !== -1) {
        appointmentsStore[idx] = { ...appointmentsStore[idx], status };
      }
      return appointmentsStore[idx];
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['appointments', tenant.id] });
      const previous = queryClient.getQueryData<Appointment[]>(['appointments', tenant.id]);

      queryClient.setQueryData<Appointment[]>(['appointments', tenant.id], (old) =>
        old ? old.map((apt) => (apt.id === id ? { ...apt, status } : apt)) : []
      );
      return { previous };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', tenant.id] });
    },
  });
}

export function useAddAppointmentMutation() {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();

  return useMutation({
    mutationFn: async (newApt: Omit<Appointment, 'id'>) => {
      await new Promise((r) => setTimeout(r, 300));
      const created: Appointment = {
        ...newApt,
        id: `apt_${Date.now()}`,
      };
      appointmentsStore = [created, ...appointmentsStore];
      return created;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', tenant.id] });
    },
  });
}

export function useTakeoverConversationMutation() {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();

  return useMutation({
    mutationFn: async ({ convId, staffMessage }: { convId: string; staffMessage?: string }) => {
      await new Promise((r) => setTimeout(r, 200));
      const idx = conversationsStore.findIndex((c) => c.id === convId);
      if (idx !== -1) {
        const msgs = [...conversationsStore[idx].messages];
        if (staffMessage) {
          msgs.push({
            id: `msg_staff_${Date.now()}`,
            sender: 'staff',
            text: staffMessage,
            timestamp: 'Just now',
          });
        }
        conversationsStore[idx] = {
          ...conversationsStore[idx],
          status: 'Needs Human',
          messages: msgs,
        };
      }
      return conversationsStore[idx];
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', tenant.id] });
    },
  });
}
