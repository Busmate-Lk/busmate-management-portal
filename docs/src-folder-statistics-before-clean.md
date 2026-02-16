# BusMate Web Frontend - Src Folder Statistics

Generated on: February 9, 2026

## 📊 Overview

- **Total Files**: 596
- **Total Lines of Code**: 121,124 lines
- **TypeScript Files (.ts)**: 84 files (12,328 lines)
- **TypeScript React Files (.tsx)**: 510 files (108,781 lines)
- **CSS Files (.css)**: 1 file (15 lines)
- **Other Files**: 1 file (middleware.ts)

---

## 📁 Top-Level Directory Summary

| Directory | Files | Lines of Code |
|-----------|-------|---------------|
| **app** | 123 | 23,407 |
| **components** | 415 | 85,557 |
| **context** | 8 | 1,781 |
| **hooks** | 3 | 514 |
| **lib** | 15 | 3,529 |
| **services** | 12 | 4,354 |
| **types** | 16 | 1,396 |
| **validation-rules** | 3 | 476 |
| **Root** | 1 | 110 (estimated) |

---

## 🎯 App Directory Breakdown

| Subdirectory | Files | Lines of Code |
|--------------|-------|---------------|
| **app/admin** | 37 | 720 |
| **app/mot** | 57 | 15,441 |
| **app/operator** | 22 | 5,440 |
| **app/timeKeeper** | 3 | 1,528 |
| **app (root)** | 4 | 278 (estimated) |

### App Directory Structure Details

#### Admin Section (37 files)
- **Root**: 1 file (layout.tsx)
- **Analytics**: 4 files (reports: 2, main: 2)
- **Dashboard**: 2 files
- **Logs**: 6 files (application: 1, security: 1, user-activity: 1, main: 3)
- **Monitoring**: 6 files (api-health: 1, microservice-uptime: 1, resource-usage: 1, main: 3)
- **Notifications**: 7 files (compose: 1, detail/[id]: 1, received: 1, sent: 2, main: 2)
- **Profile**: 1 file
- **Settings**: 2 files (backup: 1, main: 1)
- **Users**: 11 files (add-mot: 1, conductor/[id]: 1, fleet/[id]: 2, mot/[id]: 1, passenger/[id]: 1, timekeeper/[id]: 1, main: 4)

#### MOT Section (57 files)
- **Buses**: 4 files (add-new: 1, [busId]: 2)
- **Bus Stops**: 8 files (add: 1, add-new: 1, [busStopId]: 2, export: 1, import: 1, main: 2)
- **Dashboard**: 2 files
- **Fare Management**: 6 files (bus-fare: 1, bus-fare-details: 2, bus-fare-form: 2)
- **Insights & Analytics**: 1 file
- **Location Tracking**: 1 file
- **Notifications**: 7 files (compose: 1, detail/[id]: 1, received: 1, sent: 2, main: 2)
- **Passenger Service Permits**: 4 files (add-new: 1, [permitId]: 2, main: 1)
- **Policies**: 4 files (edit-policy/[id]: 1, policy-details/[id]: 1, policy-update: 1, upload-policy: 1)
- **Routes**: 7 files (import: 1, route-group: 4, workspace: 1, main: 1)
- **Schedules**: 7 files (add-new: 1, [scheduleId]: 2, workspace: 1, main: 2, schedule-details/[id]: 1)
- **Staff Management**: 3 files (add-new: 1, [id]: 1, main: 1)
- **Trip Assignment**: 1 file
- **Trips**: 2 files ([tripId]: 1, main: 1)
- **Users**: 4 files (operators: 4)

#### Operator Section (22 files)
- **Root**: 1 file (layout.tsx)
- **Add Staff**: 1 file
- **Bus Location**: 1 file
- **Bus Permit Assignments**: (nested structure)
- **Bus Seat View**: 1 file
- **Bus Tracking**: 1 file
- **Dashboard**: 2 files
- **Edit Bus Details**: 1 file
- **Edit Schedule**: 1 file
- **Fleet Management**: 2 files ([busId]: 1, main: 1)
- **Notifications**: 3 files (detail/[id]: 1, received: 1)
- **Passenger Service Permits**: 2 files ([permitId]: 1, main: 1)
- **Profile**: 1 file
- **Revenue Management**: 1 file
- **Staff Assignment**: 1 file
- **Staff Management**: 2 files ([staffId]: 1, main: 1)
- **Trips**: 2 files ([tripId]: 1, main: 1)

#### TimeKeeper Section (3 files)
- **Dashboard**: 1 file
- **Trip**: 1 file
- **Trip Assignment**: 1 file

---

## 🧩 Components Directory Breakdown

| Subdirectory | Files | Lines of Code |
|--------------|-------|---------------|
| **components/admin** | 79 | 13,423 |
| **components/mot** | 229 | 49,726 |
| **components/operator** | 70 | 13,354 |
| **components/shared** | 8 | 1,245 |
| **components/timeKeeper** | 19 | 5,605 |
| **components/tools** | 6 | 1,867 |
| **components/ui** | 4 | 337 |

### Components Directory Structure Details

#### Admin Components (79 files, 13,423 lines)
- **analytics**: 3 files
- **broadcast**: 3 files
- **dashboard**: 10 files
- **logs**: 4 files
- **monitoring**: 4 files
- **notifications**: 5 files
- **profile**: 7 files
- **settings**: 3 files
- **shared**: 6 files
- **ui**: 28 files
- **users**: 6 files

#### MOT Components (229 files, 49,726 lines)
- **Root**: 109 files (various MOT-specific components)
- **buses**: 8 files
- **bus-stops**: 9 files
- **location-tracking**: 5 files
- **operators**: 5 files
- **passenger-service-permits**: 8 files
- **permits**: 4 files
- **routes**: 23 files
  - route-form: 4 files
  - route-group-details: 4 files
  - workspace: 8 files (ai-studio: 2, form-mode: 5, textual-mode: 1)
- **schedule-details**: 8 files
  - tabs: 5 files
- **schedule-form**: 5 files
- **schedules**: 12 files
  - workspace: 10 files (ai-studio: 2, form-mode: 6, textual-mode: 2)
- **timekeepers**: 5 files (subdirectories with 1 file each)
- **trip-assignment**: 9 files
  - components: 7 files
- **trip-details**: 9 files
  - tabs: 6 files
- **trips**: 4 files
- **users**: 3 files
  - operator: 2 files
  - timekeeper: 1 file

#### Operator Components (70 files, 13,354 lines)
- **Root**: 27 files
- **dashboard**: 8 files
- **fleet**: 9 files
- **notifications**: 2 files
- **permits**: 5 files
- **profile**: 4 files
- **revenue**: 4 files
- **trips**: 4 files
- **ui**: 7 files

#### TimeKeeper Components (19 files, 5,605 lines)
- **dashboard**: 4 files
- **profile**: 2 files
- **trip-assignment-workspace**: 7 files
  - components: 5 files
- **trips**: 6 files

#### Shared Components (8 files, 1,245 lines)
- Common components used across different modules

#### Tools Components (6 files, 1,867 lines)
- **csv-editor**: 6 files

#### UI Components (4 files, 337 lines)
- Base UI component library

---

## 📚 Other Directories

### Context (8 files, 1,781 lines)
- **Root**: 1 file (AuthContext.tsx)
- **RouteWorkspace**: 3 files
- **ScheduleWorkspace**: 4 files

### Hooks (3 files, 514 lines)
- use-mobile.tsx
- use-toast.ts
- useTimeStopGraph.ts

### Lib (15 files, 3,529 lines)
- **Root**: 2 files (constants.ts, utils.ts)
- **api**: 2 files
  - user-management: 1 file
- **data**: 3 files
- **push**: 1 file
- **services**: 4 files
- **utils**: 3 files

### Services (12 files, 4,354 lines)
- **Root**: 6 files
  - routeAutoGeneration.ts
  - routeWorkspaceMap.ts
  - routeWorkspaceSerializer.ts
  - routeWorkspaceValidation.ts
  - scheduleWorkspaceSerializer.ts
  - timeStopGraph.ts
- **ai**: 6 files

### Types (16 files, 1,396 lines)
- **Root**: 2 files (RouteWorkspaceData.ts, ScheduleWorkspaceData.ts)
- **models**: 4 files
- **requestdto**: 5 files
- **responsedto**: 5 files

### Validation Rules (3 files, 476 lines)
- index.ts
- scheduleValidation.ts
- types.ts

---

## 📈 Key Insights

### Distribution by Module
1. **MOT (Ministry of Transport)**: Largest module
   - Components: 229 files, 49,726 lines (58% of all components)
   - Pages: 57 files, 15,441 lines (66% of all app pages)
   - **Total**: ~65,167 lines (~54% of entire codebase)

2. **Operator**: Second largest module
   - Components: 70 files, 13,354 lines
   - Pages: 22 files, 5,440 lines
   - **Total**: ~18,794 lines (~16% of entire codebase)

3. **Admin**: Third largest module
   - Components: 79 files, 13,423 lines
   - Pages: 37 files, 720 lines
   - **Total**: ~14,143 lines (~12% of entire codebase)

4. **TimeKeeper**: Smallest module
   - Components: 19 files, 5,605 lines
   - Pages: 3 files, 1,528 lines
   - **Total**: ~7,133 lines (~6% of entire codebase)

### Code Distribution
- **Components**: 85,557 lines (70.6% of total)
- **App/Pages**: 23,407 lines (19.3% of total)
- **Services**: 4,354 lines (3.6% of total)
- **Lib**: 3,529 lines (2.9% of total)
- **Context**: 1,781 lines (1.5% of total)
- **Types**: 1,396 lines (1.2% of total)
- **Hooks**: 514 lines (0.4% of total)
- **Validation Rules**: 476 lines (0.4% of total)

### File Type Distribution
- **TypeScript React (.tsx)**: 510 files, 108,781 lines (89.8% of code)
- **TypeScript (.ts)**: 84 files, 12,328 lines (10.2% of code)
- **CSS (.css)**: 1 file, 15 lines (<0.1% of code)

### Average Lines per File
- **Overall Average**: 203 lines/file
- **TSX Files**: 213 lines/file
- **TS Files**: 147 lines/file
- **Components Directory**: 206 lines/file
- **App Directory**: 190 lines/file

---

## 🎯 Project Structure Highlights

1. **Component-First Architecture**: 70.6% of code is in components, indicating a strong component-driven design
2. **MOT-Centric**: Over half the codebase is dedicated to MOT functionality
3. **Type Safety**: Significant use of TypeScript with dedicated types directory
4. **Modular Design**: Clear separation between different user roles (Admin, MOT, Operator, TimeKeeper)
5. **Shared Resources**: Centralized shared components, hooks, and utilities
6. **AI Integration**: Dedicated AI services and workspace AI studios
7. **Workspace Concepts**: Advanced workspace features for routes and schedules with AI assistance

---

## 📝 Notes

- Statistics include `.ts`, `.tsx`, `.js`, `.jsx`, and `.css` files
- Line counts include all code, comments, and blank lines
- File counts include all file types in respective directories
- Some directories may contain additional configuration or data files not counted in line statistics
