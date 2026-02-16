# BusMate Web Frontend - UI Pages & Dependencies

**Generated on:** February 9, 2026
**Total Pages:** 104

---

## 📊 Overview

This document lists all UI pages in the BusMate Web Frontend application and their dependencies (components, services, libraries, contexts, hooks, types, and validation rules) that are located within the `src` folder.

### Module Summary

| Module | Page Count |
|--------|------------|
| **Admin Module** | 28 |
| **MOT (Ministry of Transport) Module** | 52 |
| **Operator Module** | 20 |
| **Root** | 1 |
| **TimeKeeper Module** | 3 |

---

## Admin Module

### `/admin`

**File:** `src/app/admin/(authenticated)/(dashboard)/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/dashboard`
  - `components/admin/dashboard/user-growth-trends-chart`
  - `components/admin/shared`

---

### `/admin/analytics`

**File:** `src/app/admin/(authenticated)/analytics/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/analytics`
  - `components/admin/shared`

---

### `/admin/analytics/reports`

**File:** `src/app/admin/(authenticated)/analytics/reports/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/analytics`
  - `components/admin/shared`
  - `components/ui/button`

---

### `/admin/logs/application`

**File:** `src/app/admin/(authenticated)/logs/application/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/logs/application-logs`

---

### `/admin/logs`

**File:** `src/app/admin/(authenticated)/logs/page.tsx`

**Dependencies:** None (no local imports from src)

---

### `/admin/logs/security`

**File:** `src/app/admin/(authenticated)/logs/security/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/logs/security-logs`

---

### `/admin/logs/user-activity`

**File:** `src/app/admin/(authenticated)/logs/user-activity/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/logs/user-activity`

---

### `/admin/monitoring/api-health`

**File:** `src/app/admin/(authenticated)/monitoring/api-health/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/monitoring/api-health`

---

### `/admin/monitoring/microservice-uptime`

**File:** `src/app/admin/(authenticated)/monitoring/microservice-uptime/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/monitoring/microservice-uptime`

---

### `/admin/monitoring`

**File:** `src/app/admin/(authenticated)/monitoring/page.tsx`

**Dependencies:** None (no local imports from src)

---

### `/admin/monitoring/resource-usage`

**File:** `src/app/admin/(authenticated)/monitoring/resource-usage/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/monitoring/resource-usage`

---

### `/admin/notifications/compose`

**File:** `src/app/admin/(authenticated)/notifications/compose/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/broadcast`
  - `components/admin/shared`
  - `components/ui/button`

---

### `/admin/notifications/detail/[id]`

**File:** `src/app/admin/(authenticated)/notifications/detail/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/notifications/notification-detail`

---

### `/admin/notifications`

**File:** `src/app/admin/(authenticated)/notifications/page.tsx`

**Dependencies:** None (no local imports from src)

---

### `/admin/notifications/received`

**File:** `src/app/admin/(authenticated)/notifications/received/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/notifications/notification-panel`

---

### `/admin/notifications/sent/[id]`

**File:** `src/app/admin/(authenticated)/notifications/sent/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/notifications/sent-notification-detail`

---

### `/admin/notifications/sent`

**File:** `src/app/admin/(authenticated)/notifications/sent/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/broadcast`
  - `components/ui/button`

---

### `/admin/profile`

**File:** `src/app/admin/(authenticated)/profile/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/profile`
  - `components/admin/shared`
  - `components/ui/button`

---

### `/admin/settings/backup`

**File:** `src/app/admin/(authenticated)/settings/backup/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/settings/backup-recovery`
  - `components/admin/shared`
  - `components/ui/button`

---

### `/admin/settings`

**File:** `src/app/admin/(authenticated)/settings/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/settings`
  - `components/admin/shared`
  - `components/ui/button`

---

### `/admin/users/add-mot`

**File:** `src/app/admin/(authenticated)/users/add-mot/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/shared`
  - `components/admin/users`
  - `components/ui/button`

---

### `/admin/users/conductor/[id]`

**File:** `src/app/admin/(authenticated)/users/conductor/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/profile`
  - `components/admin/shared`

---

### `/admin/users/fleet/[id]/bus/[busId]`

**File:** `src/app/admin/(authenticated)/users/fleet/[id]/bus/[busId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/shared`

---

### `/admin/users/fleet/[id]`

**File:** `src/app/admin/(authenticated)/users/fleet/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/profile`
  - `components/admin/shared`

---

### `/admin/users/mot/[id]`

**File:** `src/app/admin/(authenticated)/users/mot/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/profile`
  - `components/admin/shared`

---

### `/admin/users`

**File:** `src/app/admin/(authenticated)/users/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/shared`
  - `components/admin/users`
  - `components/ui/button`

---

### `/admin/users/passenger/[id]`

**File:** `src/app/admin/(authenticated)/users/passenger/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/profile`
  - `components/admin/shared`

---

### `/admin/users/timekeeper/[id]`

**File:** `src/app/admin/(authenticated)/users/timekeeper/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/profile`
  - `components/admin/shared`

---

## MOT (Ministry of Transport) Module

### `/mot/bus-fare-details`

**File:** `src/app/mot/(authenticated)/(fare)/bus-fare-details/page.tsx`

**Dependencies:** None (no local imports from src)

---

### `/mot/bus-fare-form`

**File:** `src/app/mot/(authenticated)/(fare)/bus-fare-form/page.tsx`

**Dependencies:** None (no local imports from src)

---

### `/mot/bus-fare`

**File:** `src/app/mot/(authenticated)/(fare)/bus-fare/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/FareFilters`
  - `components/mot/FareQuickActions`
  - `components/mot/FareStatistics`
  - `components/mot/FareTable`
  - `components/mot/confirmation-modals`
  - `components/mot/pagination`
  - `components/shared/layout`

---

### `/mot/edit-policy/[id]`

**File:** `src/app/mot/(authenticated)/(policies)/edit-policy/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/content-editor-form`
  - `components/mot/document-details-form`
  - `components/mot/edit-policy-actions`
  - `components/mot/edit-policy-header`
  - `components/mot/edit-policy-tabs`
  - `components/mot/file-management-section`
  - `components/mot/layout`
  - `components/mot/version-history-section`
  - `components/shared/layout`

---

### `/mot/policy-details/[id]`

**File:** `src/app/mot/(authenticated)/(policies)/policy-details/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/layout`
  - `components/mot/policy-action-buttons`
  - `components/mot/policy-content`
  - `components/mot/policy-header`
  - `components/mot/policy-sidebar`
  - `components/shared/layout`

---

### `/mot/policy-update`

**File:** `src/app/mot/(authenticated)/(policies)/policy-update/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/confirmation-modals`
  - `components/mot/layout`
  - `components/mot/pagination`
  - `components/mot/policies-table`
  - `components/mot/policy-search-filters`
  - `components/mot/policy-stats-cards`
  - `components/shared/layout`

---

### `/mot/upload-policy`

**File:** `src/app/mot/(authenticated)/(policies)/upload-policy/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/document-action-buttons`
  - `components/mot/document-information-form`
  - `components/mot/document-metadata-form`
  - `components/mot/file-upload-section`
  - `components/mot/layout`
  - `components/shared/layout`

---

### `/mot/bus-stops/[busStopId]/edit`

**File:** `src/app/mot/(authenticated)/bus-stops/[busStopId]/edit/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/bus-stops/bus-stop-form`
  - `components/shared/layout`

---

### `/mot/bus-stops/[busStopId]`

**File:** `src/app/mot/(authenticated)/bus-stops/[busStopId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/bus-stops/DeleteBusStopModal`
  - `components/shared/layout`

- **Hooks:**
  - `hooks/use-toast`

---

### `/mot/bus-stops/add-new`

**File:** `src/app/mot/(authenticated)/bus-stops/add-new/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/bus-stops/bus-stop-form`
  - `components/shared/layout`

---

### `/mot/bus-stops/add`

**File:** `src/app/mot/(authenticated)/bus-stops/add/page.tsx`

**Dependencies:** None (no local imports from src)

---

### `/mot/bus-stops/export`

**File:** `src/app/mot/(authenticated)/bus-stops/export/page.tsx`

**Dependencies:**

- **Components:**
  - `components/shared/layout`
  - `components/ui/badge`
  - `components/ui/button`
  - `components/ui/card`
  - `components/ui/checkbox`
  - `components/ui/input`
  - `components/ui/label`
  - `components/ui/select`

- **Hooks:**
  - `hooks/use-toast`

---

### `/mot/bus-stops/import`

**File:** `src/app/mot/(authenticated)/bus-stops/import/page.tsx`

**Dependencies:**

- **Components:**
  - `components/shared/layout`
  - `components/tools/csv-editor`
  - `components/tools/csv-editor/types`

- **Hooks:**
  - `hooks/use-toast`

---

### `/mot/bus-stops`

**File:** `src/app/mot/(authenticated)/bus-stops/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/bus-stops/BusStopActionButtons`
  - `components/mot/bus-stops/BusStopAdvancedFilters`
  - `components/mot/bus-stops/BusStopPagination`
  - `components/mot/bus-stops/BusStopStatsCards`
  - `components/mot/bus-stops/BusStopsMapView`
  - `components/mot/bus-stops/BusStopsTable`
  - `components/mot/bus-stops/ViewTabs`
  - `components/mot/confirmation-modals`
  - `components/shared/layout`

- **Hooks:**
  - `hooks/use-toast`

---

### `/mot/buses/[busId]/edit`

**File:** `src/app/mot/(authenticated)/buses/[busId]/edit/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/buses/bus-form`
  - `components/shared/layout`

---

### `/mot/buses/[busId]`

**File:** `src/app/mot/(authenticated)/buses/[busId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/buses/BusSummary`
  - `components/mot/buses/BusTabsSection`
  - `components/mot/buses/DeleteBusModal`
  - `components/shared/layout`

---

### `/mot/buses/add-new`

**File:** `src/app/mot/(authenticated)/buses/add-new/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/buses/bus-form`
  - `components/shared/layout`

---

### `/mot/buses`

**File:** `src/app/mot/(authenticated)/buses/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/buses/BusActionButtons`
  - `components/mot/buses/BusAdvancedFilters`
  - `components/mot/buses/BusStatsCards`
  - `components/mot/buses/BusesTable`
  - `components/mot/buses/DeleteBusModal`
  - `components/shared/Pagination`
  - `components/shared/layout`

---

### `/mot/dashboard`

**File:** `src/app/mot/(authenticated)/dashboard/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/dashboard/DashboardCharts`
  - `components/admin/dashboard/KPICards`
  - `components/admin/dashboard/LiveStats`
  - `components/admin/dashboard/QuickActions`
  - `components/admin/dashboard/SystemAlerts`
  - `components/shared/layout`

- **Library:**
  - `lib/services/DashboardService`

---

### `/mot/insights-analytics`

**File:** `src/app/mot/(authenticated)/insights-analytics/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/analytics-filters`
  - `components/mot/analytics-key-metrics`
  - `components/mot/analytics-tabs`
  - `components/mot/bus-details`
  - `components/mot/driver-conductor-insights`
  - `components/mot/journey-details`
  - `components/mot/passenger-information`
  - `components/mot/revenue-insights`
  - `components/mot/ticket-information`
  - `components/shared/layout`

---

### `/mot/location-tracking`

**File:** `src/app/mot/(authenticated)/location-tracking/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/location-tracking/LocationFilters`
  - `components/mot/location-tracking/LocationMap`
  - `components/mot/location-tracking/LocationStats`
  - `components/mot/location-tracking/TripsList`
  - `components/shared/layout`

---

### `/mot/notifications/compose`

**File:** `src/app/mot/(authenticated)/notifications/compose/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/broadcast`
  - `components/admin/shared`
  - `components/ui/button`

---

### `/mot/notifications/detail/[id]`

**File:** `src/app/mot/(authenticated)/notifications/detail/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/notifications/notification-detail`
  - `components/admin/shared`

---

### `/mot/notifications`

**File:** `src/app/mot/(authenticated)/notifications/page.tsx`

**Dependencies:** None (no local imports from src)

---

### `/mot/notifications/received`

**File:** `src/app/mot/(authenticated)/notifications/received/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/notifications/notification-panel`

---

### `/mot/notifications/sent/[id]`

**File:** `src/app/mot/(authenticated)/notifications/sent/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/notifications/sent-notification-detail`

---

### `/mot/notifications/sent`

**File:** `src/app/mot/(authenticated)/notifications/sent/page.tsx`

**Dependencies:**

- **Components:**
  - `components/admin/broadcast`

---

### `/mot/passenger-service-permits/[permitId]/edit`

**File:** `src/app/mot/(authenticated)/passenger-service-permits/[permitId]/edit/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/passenger-service-permits/permit-form`
  - `components/shared/layout`

---

### `/mot/passenger-service-permits/[permitId]`

**File:** `src/app/mot/(authenticated)/passenger-service-permits/[permitId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/passenger-service-permits/DeletePermitModal`
  - `components/mot/passenger-service-permits/PermitSummary`
  - `components/mot/passenger-service-permits/PermitTabsSection`
  - `components/shared/layout`

---

### `/mot/passenger-service-permits/add-new`

**File:** `src/app/mot/(authenticated)/passenger-service-permits/add-new/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/passenger-service-permits/permit-form`
  - `components/shared/layout`

---

### `/mot/passenger-service-permits`

**File:** `src/app/mot/(authenticated)/passenger-service-permits/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/pagination`
  - `components/mot/passenger-service-permits/DeletePermitModal`
  - `components/mot/permits/PermitActionButtons`
  - `components/mot/permits/PermitAdvancedFilters`
  - `components/mot/permits/PermitStatsCards`
  - `components/mot/permits/PermitsTable`
  - `components/shared/layout`

---

### `/mot/routes/[routeGroupId]/edit`

**File:** `src/app/mot/(authenticated)/routes/(route-group)/[routeGroupId]/edit/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/routes/route-form/RouteForm`
  - `components/shared/layout`

---

### `/mot/routes/[routeGroupId]`

**File:** `src/app/mot/(authenticated)/routes/(route-group)/[routeGroupId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/routes/DeleteRouteConfirmation`
  - `components/mot/routes/route-group-details`
  - `components/shared/layout`

---

### `/mot/routes/add-new`

**File:** `src/app/mot/(authenticated)/routes/(route-group)/add-new/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/routes/route-form/RouteForm`
  - `components/shared/layout`

---

### `/mot/routes/import`

**File:** `src/app/mot/(authenticated)/routes/import/page.tsx`

**Dependencies:**

- **Components:**
  - `components/shared/layout`
  - `components/tools/csv-editor`
  - `components/tools/csv-editor/types`

- **Hooks:**
  - `hooks/use-toast`

---

### `/mot/routes`

**File:** `src/app/mot/(authenticated)/routes/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/routes/DeleteRouteConfirmation`
  - `components/mot/routes/RouteActionButtons`
  - `components/mot/routes/RouteAdvancedFilters`
  - `components/mot/routes/RouteStatsCards`
  - `components/mot/routes/RoutesTable`
  - `components/shared/Pagination`
  - `components/shared/layout`

---

### `/mot/routes/workspace`

**File:** `src/app/mot/(authenticated)/routes/workspace/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/routes/workspace/RouteSubmissionModal`
  - `components/mot/routes/workspace/ai-studio/RouteAIStudio`
  - `components/mot/routes/workspace/form-mode/RouteFormMode`
  - `components/mot/routes/workspace/textual-mode/RouteTextualMode`
  - `components/shared/layout`
  - `components/ui/toaster`

- **Context:**
  - `context/RouteWorkspace/RouteWorkspaceProvider`
  - `context/RouteWorkspace/useRouteWorkspace`

- **Hooks:**
  - `hooks/use-toast`

---

### `/mot/schedules/[scheduleId]/edit`

**File:** `src/app/mot/(authenticated)/schedules/[scheduleId]/edit/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/schedule-form/ScheduleForm`
  - `components/shared/layout`

---

### `/mot/schedules/[scheduleId]`

**File:** `src/app/mot/(authenticated)/schedules/[scheduleId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/confirmation-modals`
  - `components/mot/schedule-details`
  - `components/shared/layout`

---

### `/mot/schedules/add-new`

**File:** `src/app/mot/(authenticated)/schedules/add-new/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/schedule-form/ScheduleForm`
  - `components/shared/layout`

---

### `/mot/schedules`

**File:** `src/app/mot/(authenticated)/schedules/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/schedules/ScheduleActionButtons`
  - `components/mot/schedules/ScheduleAdvancedFilters`
  - `components/mot/schedules/ScheduleStatsCards`
  - `components/mot/schedules/SchedulesTable`
  - `components/shared/Pagination`
  - `components/shared/layout`

---

### `/mot/schedules/workspace`

**File:** `src/app/mot/(authenticated)/schedules/workspace/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/schedules/workspace/ai-studio`
  - `components/mot/schedules/workspace/form-mode/ScheduleFormMode`
  - `components/mot/schedules/workspace/textual-mode/ScheduleTextualMode`
  - `components/shared/layout`
  - `components/ui/toaster`

- **Context:**
  - `context/ScheduleWorkspace`

- **Hooks:**
  - `hooks/use-toast`

---

### `/mot/staff-management/[id]`

**File:** `src/app/mot/(authenticated)/staff-management/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/shared/layout`

---

### `/mot/staff-management/add-new`

**File:** `src/app/mot/(authenticated)/staff-management/add-new/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/users/timekeeper/timekeeper-form`
  - `components/shared/layout`

---

### `/mot/staff-management`

**File:** `src/app/mot/(authenticated)/staff-management/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/timekeepers/TimekeeperActionButtons/page`
  - `components/mot/timekeepers/TimekeeperAdvancedFilters/page`
  - `components/mot/timekeepers/TimekeeperStatsCards/page`
  - `components/mot/timekeepers/TimekeepersTable/page`
  - `components/shared/Pagination`
  - `components/shared/layout`

---

### `/mot/trip-assignment`

**File:** `src/app/mot/(authenticated)/trip-assignment/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/trip-assignment`
  - `components/shared/layout`

---

### `/mot/trips/[tripId]`

**File:** `src/app/mot/(authenticated)/trips/[tripId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/trip-details/TripOverview`
  - `components/mot/trip-details/TripTabsSection`
  - `components/shared/layout`
  - `components/ui/button`

---

### `/mot/trips`

**File:** `src/app/mot/(authenticated)/trips/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/confirmation-modals`
  - `components/mot/trips/TripActionButtons`
  - `components/mot/trips/TripAdvancedFilters`
  - `components/mot/trips/TripStatsCards`
  - `components/mot/trips/TripsTable`
  - `components/shared/Pagination`
  - `components/shared/layout`

---

### `/mot/users/operators/[operatorId]/edit`

**File:** `src/app/mot/(authenticated)/users/operators/[operatorId]/edit/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/users/operator/operator-form`
  - `components/shared/layout`

---

### `/mot/users/operators/[operatorId]`

**File:** `src/app/mot/(authenticated)/users/operators/[operatorId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/users/operator/DeleteOperatorModal`
  - `components/operator/profile/OperatorSummary`
  - `components/operator/profile/OperatorTabsSection`
  - `components/shared/layout`

---

### `/mot/users/operators/add-new`

**File:** `src/app/mot/(authenticated)/users/operators/add-new/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/users/operator/operator-form`
  - `components/shared/layout`

---

### `/mot/users/operators`

**File:** `src/app/mot/(authenticated)/users/operators/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/operators`
  - `components/mot/users/operator/DeleteOperatorModal`
  - `components/shared/Pagination`
  - `components/shared/layout`

---

## Operator Module

### `/operator/addstaff`

**File:** `src/app/operator/addstaff/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/add-staff-form`

---

### `/operator/busLocation`

**File:** `src/app/operator/busLocation/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/bus-tracking-map`
  - `components/operator/bus-tracking-panel`
  - `components/operator/bus-tracking-sidebar`
  - `components/operator/sidebar`
  - `components/shared/googleMap`

---

### `/operator/busSeatView`

**File:** `src/app/operator/busSeatView/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/bus-details-panel`
  - `components/operator/bus-seating-map`
  - `components/operator/header`

---

### `/operator/busTracking`

**File:** `src/app/operator/busTracking/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/bus-card`
  - `components/operator/header`
  - `components/operator/page-header`
  - `components/operator/sidebar`
  - `components/operator/tabs`

- **Library:**
  - `lib/api/route-management/busDetailsByOperator`

- **Context:**
  - `context/AuthContext`

- **Types:**
  - `types/responsedto/busDetails-by-operator`

---

### `/operator/dashboard`

**File:** `src/app/operator/dashboard/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/dashboard`
  - `components/operator/header`

---

### `/operator/editBusDetails`

**File:** `src/app/operator/editBusDetails/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/edit-bus-details-form`
  - `components/operator/header`
  - `components/operator/sidebar`

---

### `/operator/editSchedule`

**File:** `src/app/operator/editSchedule/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`
  - `components/operator/resource-assignment`
  - `components/operator/route-details-form`
  - `components/operator/route-preview`
  - `components/operator/sidebar`

---

### `/operator/fleet-management/[busId]`

**File:** `src/app/operator/fleet-management/[busId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/fleet`
  - `components/operator/fleet/BusPermitAssignmentModal`
  - `components/operator/header`

- **Context:**
  - `context/AuthContext`

---

### `/operator/fleet-management`

**File:** `src/app/operator/fleet-management/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/fleet/BusPermitAssignmentModal`
  - `components/operator/fleet/FleetActionButtons`
  - `components/operator/fleet/FleetAdvancedFilters`
  - `components/operator/fleet/FleetStatsCards`
  - `components/operator/fleet/FleetTable`
  - `components/operator/header`
  - `components/shared/Pagination`

- **Context:**
  - `context/AuthContext`

---

### `/operator/notifications/detail/[id]`

**File:** `src/app/operator/notifications/detail/[id]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`

---

### `/operator/notifications/received`

**File:** `src/app/operator/notifications/received/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`
  - `components/operator/notifications/notification-panel`

---

### `/operator/passenger-service-permits/[permitId]`

**File:** `src/app/operator/passenger-service-permits/[permitId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`
  - `components/operator/permits/OperatorPermitSummary`
  - `components/operator/permits/OperatorPermitTabsSection`

- **Context:**
  - `context/AuthContext`

---

### `/operator/passenger-service-permits`

**File:** `src/app/operator/passenger-service-permits/page.tsx`

**Dependencies:**

- **Components:**
  - `components/mot/pagination`
  - `components/operator/header`
  - `components/operator/permits/OperatorPermitFilters`
  - `components/operator/permits/OperatorPermitStatsCards`
  - `components/operator/permits/OperatorPermitsTable`

- **Context:**
  - `context/AuthContext`

---

### `/operator/profile`

**File:** `src/app/operator/profile/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`
  - `components/operator/profile`

---

### `/operator/revenueManagement`

**File:** `src/app/operator/revenueManagement/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`
  - `components/operator/revenue`
  - `components/operator/tabs`

---

### `/operator/staff-assignment`

**File:** `src/app/operator/staff-assignment/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`

- **Library:**
  - `lib/services/staff-management-service`
  - `lib/utils/cookieUtils`

- **Context:**
  - `context/AuthContext`

---

### `/operator/staffManagement/[staffId]`

**File:** `src/app/operator/staffManagement/[staffId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`

- **Library:**
  - `lib/services/staff-management-service`
  - `lib/utils/cookieUtils`

---

### `/operator/staffManagement`

**File:** `src/app/operator/staffManagement/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`
  - `components/operator/metric-card`
  - `components/operator/sidebar`
  - `components/operator/staff-table`

- **Library:**
  - `lib/services/staff-management-service`
  - `lib/utils/cookieUtils`

---

### `/operator/trips/[tripId]`

**File:** `src/app/operator/trips/[tripId]/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`

---

### `/operator/trips`

**File:** `src/app/operator/trips/page.tsx`

**Dependencies:**

- **Components:**
  - `components/operator/header`
  - `components/operator/trips/OperatorTripActionButtons`
  - `components/operator/trips/OperatorTripAdvancedFilters`
  - `components/operator/trips/OperatorTripStatsCards`
  - `components/operator/trips/OperatorTripsTable`
  - `components/shared/Pagination`

---

## Root

### `/`

**File:** `src/app/page.tsx`

**Dependencies:**

- **Context:**
  - `context/AuthContext`

---

## TimeKeeper Module

### `/timeKeeper/dashboard`

**File:** `src/app/timeKeeper/(authenticated)/dashboard/page.tsx`

**Dependencies:**

- **Components:**
  - `components/shared/layout`
  - `components/timeKeeper/dashboard/calendar-navigator`
  - `components/timeKeeper/dashboard/real-time-clock`
  - `components/timeKeeper/dashboard/schedule-stats-cards`
  - `components/timeKeeper/dashboard/todays-buses-table`
  - `components/timeKeeper/layout`

- **Library:**
  - `lib/api/client`
  - `lib/utils/cookieUtils`
  - `lib/utils/jwtHandler`

---

### `/timeKeeper/trip-assignment`

**File:** `src/app/timeKeeper/(authenticated)/trip-assignment/page.tsx`

**Dependencies:**

- **Components:**
  - `components/shared/layout`
  - `components/timeKeeper/trip-assignment-workspace`

---

### `/timeKeeper/trip`

**File:** `src/app/timeKeeper/(authenticated)/trip/page.tsx`

**Dependencies:**

- **Components:**
  - `components/shared/Pagination`
  - `components/shared/layout`
  - `components/timeKeeper/trip-assignment-workspace/components/TimeKeeperTripContextMenu`
  - `components/timeKeeper/trips/BusReassignmentModal`
  - `components/timeKeeper/trips/TimeKeeperTripsTable`
  - `components/timeKeeper/trips/TripAdvancedFilters`
  - `components/timeKeeper/trips/TripNotesModal`
  - `components/timeKeeper/trips/TripStatsCards`
  - `components/timeKeeper/trips/TripStatusChangeModal`

- **Library:**
  - `lib/api/client`
  - `lib/utils/cookieUtils`
  - `lib/utils/jwtHandler`

- **Context:**
  - `context/AuthContext`

---

## 📈 Dependency Statistics

### Most Used Components

The following components are used across multiple pages:

- `components/shared/layout` - Used in almost all pages for consistent layout
- `components/shared/Pagination` - Used across list/table pages
- `components/ui/*` - UI components library used throughout
- `components/admin/shared` - Shared admin components
- `components/admin/dashboard/*` - Dashboard visualization components
- `components/mot/*` - MOT-specific feature components
- `components/operator/*` - Operator-specific feature components
- `components/timeKeeper/*` - TimeKeeper-specific feature components

### Most Used Libraries

- `lib/api/client` - API client for backend communication
- `lib/utils/cookieUtils` - Cookie management utilities
- `lib/utils/jwtHandler` - JWT authentication handling
- `lib/services/DashboardService` - Dashboard data service

### Most Used Contexts

- `context/AuthContext` - Authentication state management
- `context/RouteWorkspace/RouteWorkspaceProvider` - Route workspace state
- `context/ScheduleWorkspace` - Schedule workspace state

### Most Used Hooks

- `hooks/use-toast` - Toast notification hook
- `hooks/use-mobile` - Mobile device detection hook

---

## 🎯 Key Insights

### Architectural Patterns

1. **Modular Design**: Each module (Admin, MOT, Operator, TimeKeeper) has its own components and pages
2. **Shared Components**: Common UI elements are centralized in `components/shared` and `components/ui`
3. **Context-Based State**: Complex features use Context API for state management (Route Workspace, Schedule Workspace)
4. **Service Layer**: Business logic is abstracted into services in `lib/services`
5. **Type Safety**: TypeScript types are organized in `types/` directory

### Module Complexity

- **MOT Module**: 52 pages - Most complex with route management, schedules, permits, and analytics
- **Admin Module**: 28 pages - System administration, monitoring, and user management
- **Operator Module**: 20 pages - Fleet operations, staff management, and revenue tracking
- **TimeKeeper Module**: 3 pages - Focused on trip management and assignment

### Feature Areas

1. **Route Management**: Workspace-based route creation with AI assistance
2. **Schedule Management**: Advanced scheduling with multiple editing modes
3. **Trip Management**: Assignment tracking across MOT, Operator, and TimeKeeper roles
4. **Fleet Management**: Bus tracking, maintenance, and permit management
5. **User Management**: Multi-role system with detailed profile management
6. **Analytics**: Comprehensive insights and reporting
7. **Notifications**: System-wide notification infrastructure

---

*This document was automatically generated to provide a comprehensive view of all UI pages and their dependencies in the BusMate Web Frontend application.*
