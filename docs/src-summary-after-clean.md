# BusMate Web Frontend - Source Code Summary

**Generated on:** February 8, 2026  
**Project Location:** `/media/kavinda/OS/Users/kavin/Desktop/BusMate/Busmate-Web-Frontend/src`

---

## 📊 Overall Statistics

| Metric | Count |
|--------|-------|
| **Total Files** | 469 |
| **Total Lines of Code** | 103,061 |
| **Total Directories** | 208 |

### Lines by File Type
| Type | Lines |
|------|-------|
| TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`) | 103,046 |
| CSS (`.css`) | 15 |

---

## 📁 Lines of Code by Major Directory

| Directory | Lines of Code | Percentage |
|-----------|---------------|------------|
| **components** | 70,510 | 68.4% |
| **app** | 22,437 | 21.8% |
| **services** | 4,354 | 4.2% |
| **context** | 1,781 | 1.7% |
| **lib** | 1,778 | 1.7% |
| **types** | 1,086 | 1.1% |
| **hooks** | 514 | 0.5% |
| **validation-rules** | 476 | 0.5% |
| **middleware** | 106 | 0.1% |

---

## 📂 File Count by Directory

### Root Level
| Directory | Files |
|-----------|-------|
| `.` (root) | 1 |

### App Directory Structure (Total: ~148 files)

#### Admin Module
| Path | Files |
|------|-------|
| `app/` | 3 |
| `app/admin/` | 1 |
| `app/admin/(authenticated)/` | 1 |
| `app/admin/(authenticated)/(dashboard)/` | 2 |
| `app/admin/(authenticated)/analytics/` | 2 |
| `app/admin/(authenticated)/analytics/reports/` | 2 |
| `app/admin/(authenticated)/logs/` | 2 |
| `app/admin/(authenticated)/logs/application/` | 1 |
| `app/admin/(authenticated)/logs/security/` | 1 |
| `app/admin/(authenticated)/logs/user-activity/` | 1 |
| `app/admin/(authenticated)/monitoring/` | 2 |
| `app/admin/(authenticated)/monitoring/api-health/` | 1 |
| `app/admin/(authenticated)/monitoring/microservice-uptime/` | 1 |
| `app/admin/(authenticated)/monitoring/resource-usage/` | 1 |
| `app/admin/(authenticated)/notifications/` | 2 |
| `app/admin/(authenticated)/notifications/compose/` | 1 |
| `app/admin/(authenticated)/notifications/detail/[id]/` | 1 |
| `app/admin/(authenticated)/notifications/received/` | 1 |
| `app/admin/(authenticated)/notifications/sent/` | 1 |
| `app/admin/(authenticated)/notifications/sent/[id]/` | 1 |
| `app/admin/(authenticated)/profile/` | 1 |
| `app/admin/(authenticated)/settings/` | 1 |
| `app/admin/(authenticated)/settings/backup/` | 1 |
| `app/admin/(authenticated)/users/` | 2 |
| `app/admin/(authenticated)/users/add-mot/` | 1 |
| `app/admin/(authenticated)/users/conductor/[id]/` | 1 |
| `app/admin/(authenticated)/users/fleet/[id]/` | 1 |
| `app/admin/(authenticated)/users/fleet/[id]/bus/[busId]/` | 1 |
| `app/admin/(authenticated)/users/mot/[id]/` | 1 |
| `app/admin/(authenticated)/users/passenger/[id]/` | 1 |
| `app/admin/(authenticated)/users/timekeeper/[id]/` | 1 |

#### MOT (Ministry of Transport) Module
| Path | Files |
|------|-------|
| `app/mot/(authenticated)/buses/` | 1 |
| `app/mot/(authenticated)/buses/add-new/` | 1 |
| `app/mot/(authenticated)/buses/[busId]/` | 1 |
| `app/mot/(authenticated)/buses/[busId]/edit/` | 1 |
| `app/mot/(authenticated)/bus-stops/` | 1 |
| `app/mot/(authenticated)/bus-stops/add/` | 1 |
| `app/mot/(authenticated)/bus-stops/add-new/` | 1 |
| `app/mot/(authenticated)/bus-stops/[busStopId]/` | 1 |
| `app/mot/(authenticated)/bus-stops/[busStopId]/edit/` | 1 |
| `app/mot/(authenticated)/bus-stops/export/` | 1 |
| `app/mot/(authenticated)/bus-stops/import/` | 1 |
| `app/mot/(authenticated)/dashboard/` | 2 |
| `app/mot/(authenticated)/(fare)/bus-fare/` | 1 |
| `app/mot/(authenticated)/(fare)/bus-fare-details/` | 2 |
| `app/mot/(authenticated)/(fare)/bus-fare-form/` | 2 |
| `app/mot/(authenticated)/insights-analytics/` | 1 |
| `app/mot/(authenticated)/location-tracking/` | 1 |
| `app/mot/(authenticated)/notifications/` | 2 |
| `app/mot/(authenticated)/notifications/compose/` | 1 |
| `app/mot/(authenticated)/notifications/detail/[id]/` | 1 |
| `app/mot/(authenticated)/notifications/received/` | 1 |
| `app/mot/(authenticated)/notifications/sent/` | 1 |
| `app/mot/(authenticated)/notifications/sent/[id]/` | 1 |
| `app/mot/(authenticated)/passenger-service-permits/` | 1 |
| `app/mot/(authenticated)/passenger-service-permits/add-new/` | 1 |
| `app/mot/(authenticated)/passenger-service-permits/[permitId]/` | 1 |
| `app/mot/(authenticated)/passenger-service-permits/[permitId]/edit/` | 1 |
| `app/mot/(authenticated)/(policies)/edit-policy/[id]/` | 1 |
| `app/mot/(authenticated)/(policies)/policy-details/[id]/` | 1 |
| `app/mot/(authenticated)/(policies)/policy-update/` | 1 |
| `app/mot/(authenticated)/(policies)/upload-policy/` | 1 |
| `app/mot/(authenticated)/routes/` | 1 |
| `app/mot/(authenticated)/routes/import/` | 1 |
| `app/mot/(authenticated)/routes/(route-group)/add-new/` | 1 |
| `app/mot/(authenticated)/routes/(route-group)/[routeGroupId]/` | 1 |
| `app/mot/(authenticated)/routes/(route-group)/[routeGroupId]/edit/` | 1 |
| `app/mot/(authenticated)/routes/workspace/` | 1 |
| `app/mot/(authenticated)/schedules/` | 1 |
| `app/mot/(authenticated)/schedules/add-new/` | 1 |
| `app/mot/(authenticated)/schedules/[scheduleId]/` | 1 |
| `app/mot/(authenticated)/schedules/[scheduleId]/edit/` | 1 |
| `app/mot/(authenticated)/schedules/workspace/` | 1 |
| `app/mot/(authenticated)/staff-management/` | 1 |
| `app/mot/(authenticated)/staff-management/add-new/` | 1 |
| `app/mot/(authenticated)/staff-management/[id]/` | 1 |
| `app/mot/(authenticated)/trip-assignment/` | 1 |
| `app/mot/(authenticated)/trips/` | 1 |
| `app/mot/(authenticated)/trips/[tripId]/` | 1 |
| `app/mot/(authenticated)/users/operators/` | 1 |
| `app/mot/(authenticated)/users/operators/add-new/` | 1 |
| `app/mot/(authenticated)/users/operators/[operatorId]/` | 1 |
| `app/mot/(authenticated)/users/operators/[operatorId]/edit/` | 1 |

#### Operator Module
| Path | Files |
|------|-------|
| `app/operator/` | 1 |
| `app/operator/addstaff/` | 1 |
| `app/operator/busLocation/` | 1 |
| `app/operator/busSeatView/` | 1 |
| `app/operator/busTracking/` | 1 |
| `app/operator/dashboard/` | 2 |
| `app/operator/editBusDetails/` | 1 |
| `app/operator/editSchedule/` | 1 |
| `app/operator/fleet-management/` | 1 |
| `app/operator/fleet-management/[busId]/` | 1 |
| `app/operator/notifications/detail/[id]/` | 1 |
| `app/operator/notifications/received/` | 1 |
| `app/operator/passenger-service-permits/` | 1 |
| `app/operator/passenger-service-permits/[permitId]/` | 1 |
| `app/operator/profile/` | 1 |
| `app/operator/revenueManagement/` | 1 |
| `app/operator/staff-assignment/` | 1 |
| `app/operator/staffManagement/` | 1 |
| `app/operator/staffManagement/[staffId]/` | 1 |
| `app/operator/trips/` | 1 |
| `app/operator/trips/[tripId]/` | 1 |

#### TimeKeeper Module
| Path | Files |
|------|-------|
| `app/timeKeeper/(authenticated)/dashboard/` | 1 |
| `app/timeKeeper/(authenticated)/trip/` | 1 |
| `app/timeKeeper/(authenticated)/trip-assignment/` | 1 |

### Components Directory (Total: ~321 files)

#### Admin Components
| Path | Files |
|------|-------|
| `components/admin/analytics/` | 3 |
| `components/admin/broadcast/` | 3 |
| `components/admin/dashboard/` | 10 |
| `components/admin/logs/` | 4 |
| `components/admin/monitoring/` | 4 |
| `components/admin/notifications/` | 5 |
| `components/admin/profile/` | 7 |
| `components/admin/settings/` | 3 |
| `components/admin/shared/` | 6 |
| `components/admin/users/` | 6 |

#### MOT Components
| Path | Files |
|------|-------|
| `components/mot/` | 38 |
| `components/mot/buses/` | 8 |
| `components/mot/bus-stops/` | 9 |
| `components/mot/location-tracking/` | 5 |
| `components/mot/operators/` | 5 |
| `components/mot/passenger-service-permits/` | 4 |
| `components/mot/permits/` | 4 |
| `components/mot/routes/` | 7 |
| `components/mot/routes/route-form/` | 4 |
| `components/mot/routes/route-group-details/` | 4 |
| `components/mot/routes/workspace/` | 1 |
| `components/mot/routes/workspace/ai-studio/` | 2 |
| `components/mot/routes/workspace/form-mode/` | 5 |
| `components/mot/routes/workspace/textual-mode/` | 1 |
| `components/mot/schedule-details/` | 3 |
| `components/mot/schedule-details/tabs/` | 5 |
| `components/mot/schedule-form/` | 5 |
| `components/mot/schedules/` | 4 |
| `components/mot/schedules/workspace/ai-studio/` | 2 |
| `components/mot/schedules/workspace/form-mode/` | 6 |
| `components/mot/schedules/workspace/textual-mode/` | 2 |
| `components/mot/timekeepers/` | 1 |
| `components/mot/timekeepers/TimekeeperActionButtons/` | 1 |
| `components/mot/timekeepers/TimekeeperAdvancedFilters/` | 1 |
| `components/mot/timekeepers/TimekeepersTable/` | 1 |
| `components/mot/timekeepers/TimekeeperStatsCards/` | 1 |
| `components/mot/trip-assignment/` | 2 |
| `components/mot/trip-assignment/components/` | 7 |
| `components/mot/trip-details/` | 3 |
| `components/mot/trip-details/tabs/` | 6 |
| `components/mot/trips/` | 4 |
| `components/mot/users/operator/` | 2 |
| `components/mot/users/timekeeper/` | 1 |

#### Operator Components
| Path | Files |
|------|-------|
| `components/operator/` | 15 |
| `components/operator/dashboard/` | 8 |
| `components/operator/fleet/` | 9 |
| `components/operator/notifications/` | 2 |
| `components/operator/permits/` | 5 |
| `components/operator/profile/` | 4 |
| `components/operator/revenue/` | 4 |
| `components/operator/trips/` | 4 |

#### TimeKeeper Components
| Path | Files |
|------|-------|
| `components/timeKeeper/dashboard/` | 4 |
| `components/timeKeeper/trip-assignment-workspace/` | 2 |
| `components/timeKeeper/trip-assignment-workspace/components/` | 5 |
| `components/timeKeeper/trips/` | 6 |

#### Shared & UI Components
| Path | Files |
|------|-------|
| `components/shared/` | 7 |
| `components/tools/csv-editor/` | 6 |
| `components/ui/` | 17 |

### Context, Hooks, Lib, Services, Types & Validation

| Path | Files |
|------|-------|
| `context/` | 1 |
| `context/RouteWorkspace/` | 3 |
| `context/ScheduleWorkspace/` | 4 |
| `hooks/` | 3 |
| `lib/` | 2 |
| `lib/api/` | 1 |
| `lib/api/user-management/` | 1 |
| `lib/push/` | 1 |
| `lib/services/` | 4 |
| `lib/utils/` | 2 |
| `services/` | 6 |
| `services/ai/` | 6 |
| `types/` | 2 |
| `types/models/` | 3 |
| `types/requestdto/` | 1 |
| `types/responsedto/` | 1 |
| `validation-rules/` | 3 |

---

## 🔍 Key Insights

### Module Distribution
- **MOT Module**: Largest app module with ~65 route pages
- **Admin Module**: ~40 route pages for system administration
- **Operator Module**: ~25 route pages for fleet operators
- **TimeKeeper Module**: 3 focused route pages

### Component Architecture
- **Components folder** contains 68.4% of all code (70,510 lines)
- **MOT components** are the most extensive with ~200 files
- **Reusable UI components**: 17 base components
- **Workspace components**: Advanced AI-assisted route and schedule planning

### Feature Highlights
1. **Route Management**: AI-studio integration, workspace editors
2. **Schedule Management**: Multiple editing modes (form, textual, AI-assisted)
3. **Trip Management**: Assignment tracking, timekeeper workflows
4. **Fleet Management**: Bus tracking, permit management
5. **User Management**: Multi-role system (Admin, MOT, Operator, TimeKeeper)
6. **Notifications**: Comprehensive notification system across all roles
7. **Analytics**: Dashboard and insights for multiple stakeholders

### Technology Stack Indicators
- **Next.js** with App Router (route groups, dynamic routes)
- **TypeScript/TSX** for type safety
- **Component-based architecture**
- **Context API** for state management
- **Custom hooks** for reusable logic
- **Service layer** for business logic

---

## 📈 Codebase Metrics Summary

| Metric | Value |
|--------|-------|
| Average lines per file | ~220 |
| Largest module (by LOC) | Components (70,510 lines) |
| Second largest module | App Routes (22,437 lines) |
| Most feature-rich module | MOT (Ministry of Transport) |
| Total directories | 208 |
| Directory depth | Up to 7 levels deep |

---

*This summary was automatically generated to provide insights into the BusMate Web Frontend codebase structure and composition.*
