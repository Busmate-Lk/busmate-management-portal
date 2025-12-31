### Detailed Prompt for Developing the Schedule Creation and Editing Workspace in BusMate Web Frontend

#### Overview
Develop a comprehensive schedule workspace for creating and editing bus schedules in the BusMate Web Frontend application. This workspace will be inspired by the existing route workspace implementation but tailored specifically for schedule management. Schedules are created for existing routes built by the route building application.

**Critical Design Principle: Bulk Schedule Management**
The workspace is designed to handle multiple schedules simultaneously in a single session. Users can create new schedules, edit existing ones, or perform both operations together in bulk. This allows for efficient management of schedule variants (weekday, weekend, holiday schedules, etc.) for the same route within one workspace session.

The schedule workspace should provide an intuitive, dual-pane editor interface that allows users to create, edit, and visualize multiple bus schedules through both tabular and graphical representations. It must support both form-based editing and textual (YAML) editing modes, with real-time synchronization between modes.

#### Key Requirements
- **Route Selection**: Users must first select an existing route from the route management service before creating or editing schedules.
- **Bulk Schedule Operations**: The workspace handles multiple schedules simultaneously:
  - Create multiple new schedules in one session
  - Edit multiple existing schedules together
  - Mix of create and edit operations in the same workspace
  - Each schedule identified by unique tags (name, type, effective dates)
- **Schedule Types**: Support different schedule types (e.g., weekday, weekend, holiday) as defined in the backend enums.
- **Dual-Pane Interface with Flexible Axes**: 
  - Left pane: Timetable Grid (Time-Stop Matrix)
  - Right pane: Trip Line Diagram (Stop-Time Lines)
  - **Axis Configuration**: Both views support exchangeable X/Y axes for different perspectives
- **Editing Modes**: Form mode (interactive grid and diagram) and Textual mode (YAML editor) with real-time sync.
- **Validation**: Comprehensive validation for schedule data, including time conflicts, route consistency, and data integrity across all schedules in the workspace.
- **Auto-Generation**: Features to auto-generate schedules based on route data and common patterns.
- **Persistence**: Integration with the route-management-service backend for saving and loading schedules.
- **User Experience**: Responsive design, loading states, error handling, and toast notifications.

#### Architecture and Implementation Structure

##### 1. Page Component (`/app/mot/(authenticated)/schedules/workspace/page.tsx`)
- Similar to `RouteWorkspaceContent` in route workspace.
- Handle URL parameters:
  - `routeId` (required): The route for which schedules are being created/edited
  - `scheduleIds` (optional, comma-separated): List of existing schedule IDs to load for editing
  - Support both create-only, edit-only, and mixed create/edit modes
- Tabs for 'form' and 'textual' modes.
- Modal for bulk schedule submission with progress tracking for each schedule.
- Loading and error states.
- Page title reflects operation: "Create Schedules", "Edit Schedules", or "Manage Schedules" (mixed mode).
- Schedule list/selector component to manage multiple schedules in the workspace.

##### 2. Form Mode Components
- **Main Component** (`ScheduleFormMode.tsx`):
  - Schedule selector/tabs to switch between different schedules in the workspace.
  - Display schedule identification tags (name, type, effective dates) for each schedule.
  - Integration with schedule context for data management across all schedules.
  - Actions: Add new schedule, duplicate schedule, delete schedule from workspace.

- **Timetable Grid Component** (`TimetableGrid.tsx`):
  - Left pane: Interactive grid with **configurable axis orientation**:
    - **Default Mode (Stops × Schedules)**:
      - Rows: Stops in route order
      - Columns: Schedules with identification tags (name, type, dates)
      - Cells: Arrival/departure times for each stop in each schedule
    - **Alternative Mode (Schedules × Stops)** - Axis swapped:
      - Rows: Schedules with identification tags
      - Columns: Stops in route order
      - Cells: Arrival/departure times
    - **Time-based Mode (Stops × Time Slots)**:
      - Rows: Stops
      - Columns: Time slots (configurable intervals)
      - Multiple schedules overlaid or color-coded
  - Toggle button to switch between axis orientations.
  - Editable cells with time picker or input.
  - Visual indicators for schedule types, conflicts, overlaps between schedules.
  - Bulk operations: Apply pattern to multiple schedules, copy times across schedules.

- **Trip Line Diagram Component** (`TripLineDiagram.tsx`):
  - Right pane: Time-space diagram with **configurable axis orientation**:
    - **Default Mode**:
      - Y-axis: Stops (from first to last)
      - X-axis: Time (24-hour format)
      - Each schedule shown as different colored lines/trips
    - **Alternative Mode** - Axis swapped:
      - X-axis: Stops (from first to last)
      - Y-axis: Time (24-hour format)
      - Horizontal perspective of schedule progression
  - Toggle button to switch between axis orientations.
  - Color-coding by schedule identification tags.
  - Legend showing which color represents which schedule.
  - Interactive: Click on lines to select/edit specific schedule.
  - Zoom and pan functionality.
  - Visual representation of schedule density, gaps, and conflicts across all schedules.

- **Schedule Info Component** (`ScheduleInfo.tsx`):
  - Form fields for each schedule's metadata (name, description, type, effective dates, status).
  - Schedule identification tag display and editing.
  - Calendar integration for schedule exceptions per schedule.
  - Quick actions: Duplicate this schedule, delete this schedule.

##### 3. Textual Mode Component (`ScheduleTextualMode.tsx`)
- YAML editor for full schedule data input/output supporting multiple schedules.
- Real-time parsing and validation for all schedules in the workspace.
- Sync with form mode data for all schedules.
- Placeholder with example structure showing multiple schedules.
- Clear visual separation between different schedules in YAML format.

##### 4. Context and State Management (`ScheduleWorkspaceContext.tsx`, `ScheduleWorkspaceProvider.tsx`, `useScheduleWorkspace.ts`)
- **Context Type**:
  - Mode: 'create' | 'edit' | 'mixed' (indicates if creating new, editing existing, or both)
  - Loading states, errors
  - Selected route ID (required, single route per workspace session)
  - **Schedules array**: Multiple schedule data structures in workspace
  - **Active schedule index**: Currently selected schedule for editing
  - Selected trip/stop indices within active schedule
  - **Axis orientation states**: For both grid and diagram (stops×schedules, schedules×stops, etc.)
  - Actions: 
    - loadSchedules (bulk load by IDs)
    - addSchedule, removeSchedule, duplicateSchedule
    - updateSchedule (for specific schedule by index)
    - setActiveSchedule
    - saveAllSchedules (bulk save operation)
    - toggleGridAxisOrientation, toggleDiagramAxisOrientation

- **Data Structure** (inspired by `RouteWorkspaceData.ts`):
  - ScheduleWorkspaceData containing array of Schedule entities
  - Each Schedule with its identification tag (name, type, dates)
  - Schedule entity with trips, stops, times, calendar, exceptions
  - Enums for schedule types, statuses, exception types
  - Helper functions for creating empty schedules, calculating durations, managing bulk operations.

##### 5. Services and Utilities
- **Schedule Auto-Generation** (`scheduleAutoGeneration.ts`):
  - Functions to generate schedules from route data.
  - Pattern-based generation (e.g., regular intervals, peak hours).
  - Generate schedule variants (weekday, weekend) from a base schedule.
  - Validation of generated schedules.
  - Bulk generation: Create multiple schedule variants at once.

- **Schedule Validation** (`scheduleValidation.ts`):
  - Time conflict detection within single schedule and across multiple schedules.
  - Route stop sequence validation for all schedules.
  - Data completeness checks for each schedule.
  - Bulk validation for all schedules in workspace.
  - Cross-schedule validation (e.g., effective date overlaps for same type).

- **Schedule Serialization** (`scheduleSerializer.ts`):
  - YAML serialization/deserialization for multiple schedules.
  - Maintain compatibility with backend API format.
  - Support for bulk import/export of schedule data.

- **Schedule Visualization** (`scheduleVisualization.ts`):
  - Functions for rendering trip lines for multiple schedules with color coding.
  - Calculate positions based on current axis orientation.
  - Use simple SVG or Canvas for drawing space-time diagrams.
  - Handle axis swapping transformations for both grid and diagram views.

##### 6. Types and Entities (`ScheduleWorkspaceData.ts`)
- Define TypeScript interfaces for:
  - **ScheduleWorkspaceData**: Container for multiple schedules
  - **Schedule**: Individual schedule with identification tag
  - **ScheduleIdentificationTag**: Name, type, effective dates for UI display
  - Trip, ScheduleStop, ScheduleCalendar, ScheduleException
  - Enums: ScheduleTypeEnum, ScheduleStatusEnum, ExceptionTypeEnum
  - **AxisOrientation**: Enum for grid and diagram axis configurations
- Factory functions for creating empty objects and schedule arrays.
- Utility functions for calculations (e.g., trip duration, stop times).
- Bulk operation utilities (clone schedule, merge schedules, compare schedules).

##### 7. Backend Integration
- API calls to route-management-service for:
  - Fetching route details (stops, distances) - single route per workspace.
  - **Bulk loading existing schedules** by array of schedule IDs.
  - **Bulk saving**: Create new schedules and update existing schedules in single operation.
  - Validating schedule data against route constraints.
  - Handling partial failures (some schedules save, others fail) with detailed error reporting.

##### 8. UI Components and Interactions
- **Schedule Management**:
  - Schedule list with identification tags visible.
  - Quick actions: Add, duplicate, delete schedules.
  - Active schedule highlighting.
  - Drag-and-drop to reorder schedules in workspace.

- **Grid Editing**:
  - Axis orientation toggle button (stops×schedules, schedules×stops, stops×time).
  - Click to edit time cells for any schedule.
  - Keyboard navigation (arrow keys, tab) across schedules.
  - Copy/paste functionality for time patterns across schedules.
  - Bulk operations: Apply pattern to selected schedules, shift all times in schedule.
  - Color-coding by schedule type in multi-schedule views.

- **Diagram Interactions**:
  - Axis orientation toggle button (Y:stops/X:time or Y:time/X:stops).
  - Hover to show schedule details and trip information.
  - Click on lines to select specific schedule.
  - Zoom controls for time/stop range (adapts to current orientation).
  - Filter: Show/hide specific schedules, filter by type or date range.
  - Visual differentiation of schedules with colors and labels.

- **Validation Feedback**:
  - Real-time validation with error highlighting per schedule.
  - Toast notifications for save operations with bulk results.
  - Modal progress showing status for each schedule during bulk save.
  - Warning indicators for schedule conflicts or overlaps.

##### 9. Additional Features
- **Schedule Templates**: Pre-defined templates for common schedule patterns (can generate multiple schedules at once).
- **Bulk Import/Export**: CSV/Excel import for creating multiple schedules or bulk time entry.
- **Schedule Comparison**: Side-by-side comparison of two or more schedules in the workspace.
- **Schedule Variants Generator**: Auto-create variants (weekend, holiday) from a base weekday schedule.
- **Version History**: Track changes for each schedule independently.
- **Mobile Responsiveness**: Adapt layout for different screen sizes, simplified multi-schedule view on mobile.

##### 10. Implementation Steps
1. Set up basic page structure and routing with support for multiple schedule IDs in URL.
2. Implement context and data types for bulk schedule management.
3. Build schedule selector/manager component.
4. Implement axis orientation state and toggle mechanism.
5. Build form mode components (grid and diagram) with configurable axes.
6. Add textual mode with YAML support for multiple schedules.
7. Integrate backend APIs for bulk operations.
8. Implement validation for single and cross-schedule scenarios.
9. Add bulk save/submission modal with per-schedule progress tracking.
10. Implement schedule auto-generation and variant creation.
11. Add advanced features (templates, bulk import/export, comparison).

#### Dependencies and Libraries
- Existing UI libraries (shadcn/ui, Tailwind CSS).
- Simple SVG or Canvas for diagram rendering.
- Date/time handling (date-fns or dayjs).
- YAML parsing (js-yaml).
- Form validation (react-hook-form or similar).

This prompt provides a comprehensive blueprint for developing the schedule workspace with bulk schedule management capabilities, flexible axis orientations, and efficient multi-schedule operations. It ensures alignment with the existing route workspace architecture while addressing the unique requirements of managing multiple schedules simultaneously.
