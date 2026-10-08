export const queryKeys = {
  health: ['health'] as const,
  stats: ['stats'] as const,
  appointments: ['appointments'] as const,
  patients: ['patients'] as const,
  conversations: ['conversations'] as const,
  services: ['services'] as const,
  dentists: ['dentists'] as const,
  docs: ['docs'] as const,
  search: (query: string) => ['docs', 'search', query] as const,
};
