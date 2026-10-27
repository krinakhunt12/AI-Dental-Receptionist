# 09 — Frontend UI & Component Guide

## 1. Design System & Layout Principles
- **Root Layout Frame**: `AppLayout.tsx` and `AdminLayout.tsx` establish an unyielding fixed frame: `h-screen w-screen overflow-hidden flex flex-col`.
- **Fixed Sidebar**: Desktop navigation is fixed with internal `overflow-y-auto` scrolling.
- **Scrollable Main Workspace**: The `<main>` viewport features `flex-1 overflow-y-auto` ensuring global document scrollbars never shift the sidebar or top header navigation.
- **Fixed Uniform Cards & Tables**:
  - Tables (Appointments, Patients, Care Protocols, Reminders, Triage Logs) are encapsulated in `h-[540px]` containers with sticky `<thead>` headers and internal `overflow-y-auto` body scrolling.
  - KPI Stat cards maintain fixed heights (`min-h-[155px] flex flex-col justify-between`) preventing layout shift when metric values update.

## 2. TanStack Query Clinic-Scoped Caching
All query keys follow the strict clinic-scoped tuple pattern:
```typescript
queryKeys = {
  all: (clinicId: string) => [clinicId] as const,
  dashboardSummary: (clinicId: string, range?: { from?: string; to?: string }) =>
    [clinicId, 'dashboard', 'summary', range ?? {}] as const,
  appointments: (clinicId: string, filters?: AppointmentFilters) =>
    [clinicId, 'appointments', filters ?? {}] as const,
  careProtocols: (clinicId: string, filters?: CareProtocolFilters) =>
    [clinicId, 'careProtocols', filters ?? {}] as const,
  staffNotifications: (clinicId: string, unreadOnly?: boolean) =>
    [clinicId, 'notifications', { unreadOnly: !!unreadOnly }] as const,
};
```

## 3. UI States (Loading, Empty, Error)
Every screen implements the three mandatory states:
1. **Skeleton Loading**: Pre-rendered layout shells matching card and table dimensions with zero layout shift.
2. **Error State**: Informative error description with a prominent `Retry` button wired to TanStack Query `refetch()`.
3. **Empty State**: Clear contextual empty state with icon, explanatory message, and primary action button (e.g. *"Clear Filters"* or *"Add New"*).
