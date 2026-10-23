import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
} from '../api/useAppointments';
import { useDentists } from '../../dentists/api/useDentists';
import { useTreatments } from '../../treatments/api/useTreatments';
import { AppointmentStatus } from '../../../types';

export function useAppointmentsQuery() {
  const apptsQuery = useAppointments();
  const servicesQuery = useTreatments();
  const dentistsQuery = useDentists();

  const createMut = useCreateAppointment();
  const updateMut = useUpdateAppointment();
  const cancelMut = useCancelAppointment();

  return {
    appointments: apptsQuery.data ?? [],
    services: servicesQuery.data ?? [],
    dentists: dentistsQuery.data ?? [],
    isLoading: apptsQuery.isLoading || servicesQuery.isLoading || dentistsQuery.isLoading,
    isError: apptsQuery.isError || servicesQuery.isError || dentistsQuery.isError,
    isRefetching: apptsQuery.isRefetching,
    refetch: () => {
      apptsQuery.refetch();
      servicesQuery.refetch();
      dentistsQuery.refetch();
    },
    createAppointment: async (data: {
      serviceId?: string;
      dentistId: string;
      date: string;
      time: string;
      patientName: string;
      patientPhone: string;
    }) => {
      const treatment =
        servicesQuery.data?.find((s) => s.id === data.serviceId)?.name || 'General Dental Checkup';
      return createMut.mutateAsync({
        treatment,
        treatmentId: data.serviceId,
        doctorId: data.dentistId,
        date: data.date,
        time: data.time,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
      });
    },
    updateStatus: (id: string, status: string) => {
      return updateMut.mutateAsync({
        id,
        data: { status: status as AppointmentStatus },
      });
    },
    deleteAppointment: (id: string) => cancelMut.mutateAsync(id),
  };
}
