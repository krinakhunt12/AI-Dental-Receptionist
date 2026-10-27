import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { getTeamUsers, TeamUserItem } from '../api/teamApi';

export function useTeamUsers() {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<TeamUserItem[]>({
    queryKey: queryKeys.teamUsers(clinicId || ''),
    queryFn: () => getTeamUsers(clinicId!),
    enabled: isEnabled,
    staleTime: 5 * 60_000,
  });
}
