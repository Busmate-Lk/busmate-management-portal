### Detailed Prompt for Developing the Schedule Creation and Editing Workspace in BusMate Web Frontend

#### Overview
Develop a comprehensive schedule workspace for creating and editing bus schedules in the BusMate Web Frontend application. This workspace will be inspired by the existing route workspace implementation but tailored specifically for schedule management. Schedules are created for existing routes built by the route building application.

The schedule workspace should provide an intuitive, dual-pane editor interface that allows users to create, edit, and visualize bus schedules through both tabular and graphical representations. It must support both form-based editing and textual (YAML) editing modes, with real-time synchronization between modes.

#### Key Requirements
- **Route Selection**: Users must first select an existing route from the route management service before creating or editing schedules.
- **Schedule Types**: Support different schedule types (e.g., weekday, weekend, holiday) as defined in the backend enums.
- **Dual-Pane Interface**: 
  - Left pane: Timetable Grid (Time-Stop Matrix)
  - Right pane: Trip Line Diagram (Stop-Time Lines)
- **Editing Modes**: Form mode (interactive grid and diagram) and Textual mode (YAML editor) with real-time sync.
- **Validation**: Comprehensive validation for schedule data, including time conflicts, route consistency, and data integrity.
- **Auto-Generation**: Features to auto-generate schedules based on route data and common patterns.
- **Persistence**: Integration with the route-management-service backend for saving and loading schedules.
- **User Experience**: Responsive design, loading states, error handling, and toast notifications.

#### Architecture and Implementation Structure

##### 1. Page Component (`/app/mot/(authenticated)/schedules/workspace/page.tsx`)
- Similar to `RouteWorkspaceContent` in route workspace.
- Handle URL parameters for schedule ID (for editing) and route ID (required).
- Tabs for 'form' and 'textual' modes.
- Modal for schedule submission with progress tracking.
- Loading and error states.
- Page title and description based on mode (create/edit).

##### 2. Form Mode Components
- **Main Component** (`ScheduleFormMode.tsx`):
  - Tabs for different schedule types or views (e.g., 'timetable', 'diagram').
  - Integration with schedule context for data management.

- **Timetable Grid Component** (`TimetableGrid.tsx`):
  - Left pane: Interactive grid where:
    - Rows represent stops in route order.
    - Columns represent time slots (configurable intervals, e.g., 15-minute increments).
    - Cells contain arrival/departure times or are blank.
    - Editable cells with time picker or input.
    - Drag-and-drop for copying times across cells.
    - Visual indicators for start/end stops, time conflicts.

- **Trip Line Diagram Component** (`TripLineDiagram.tsx`):
  - Right pane: Time-space diagram where:
    - Y-axis: Stops from first to last.
    - X-axis: Time (24-hour format).
    - Each trip represented as a diagonal line showing motion along the route.
    - Interactive: Click on lines to edit trip details.
    - Zoom and pan functionality.
    - Visual representation of schedule density and conflicts.

- **Schedule Info Component** (`ScheduleInfo.tsx`):
  - Form fields for schedule metadata (name, description, type, effective dates, status).
  - Calendar integration for schedule exceptions.

##### 3. Textual Mode Component (`ScheduleTextualMode.tsx`)
- YAML editor for full schedule data input/output.
- Real-time parsing and validation.
- Sync with form mode data.
- Placeholder with example schedule structure.

##### 4. Context and State Management (`ScheduleWorkspaceContext.tsx`, `ScheduleWorkspaceProvider.tsx`, `useScheduleWorkspace.ts`)
- **Context Type**:
  - Mode: 'create' | 'edit'
  - Loading states, errors
  - Selected route ID
  - Schedule data structure
  - Selected trip/stop indices
  - Actions: loadSchedule, saveSchedule, updateSchedule, etc.

- **Data Structure** (inspired by `RouteWorkspaceData.ts`):
  - Schedule entity with trips, stops, times
  - Enums for schedule types, statuses
  - Helper functions for creating empty schedules, calculating durations, etc.

##### 5. Services and Utilities
- **Schedule Auto-Generation** (`scheduleAutoGeneration.ts`):
  - Functions to generate schedules from route data.
  - Pattern-based generation (e.g., regular intervals, peak hours).
  - Validation of generated schedules.

- **Schedule Validation** (`scheduleValidation.ts`):
  - Time conflict detection.
  - Route stop sequence validation.
  - Data completeness checks.
  - Bulk validation for multiple trips.

- **Schedule Serialization** (`scheduleSerializer.ts`):
  - YAML serialization/deserialization.
  - Maintain compatibility with backend API format.

- **Schedule Visualization** (`scheduleVisualization.ts`):
  - Functions for rendering trip lines, calculating positions.
  - Use simple SVG or Canvas for drawing space-time diagrams.

##### 6. Types and Entities (`ScheduleWorkspaceData.ts`)
- Define TypeScript interfaces for:
  - Schedule, Trip, ScheduleStop, ScheduleCalendar, ScheduleException
  - Enums: ScheduleTypeEnum, ScheduleStatusEnum, ExceptionTypeEnum
- Factory functions for creating empty objects.
- Utility functions for calculations (e.g., trip duration, stop times).

##### 7. Backend Integration
- API calls to route-management-service for:
  - Fetching route details (stops, distances).
  - Loading existing schedules.
  - Saving new/updated schedules.
  - Validating schedule data against route constraints.

##### 8. UI Components and Interactions
- **Grid Editing**:
  - Click to edit time cells.
  - Keyboard navigation (arrow keys, tab).
  - Copy/paste functionality for time patterns.
  - Bulk operations (apply to all trips, shift times).

- **Diagram Interactions**:
  - Hover to show trip details.
  - Drag trip lines to adjust times.
  - Zoom controls for time range.
  - Filter by trip type or time period.

- **Validation Feedback**:
  - Real-time validation with error highlighting.
  - Toast notifications for save operations.
  - Modal progress for complex validations.

##### 9. Additional Features
- **Schedule Templates**: Pre-defined templates for common schedule patterns.
- **Import/Export**: CSV/Excel import for bulk time entry.
- **Version History**: Track changes and allow rollback.
- **Collaboration**: Multi-user editing with conflict resolution.
- **Mobile Responsiveness**: Adapt layout for different screen sizes.

##### 10. Implementation Steps
1. Set up basic page structure and routing.
2. Implement context and data types.
3. Build form mode components (grid and diagram).
4. Add textual mode with YAML support.
5. Integrate backend APIs.
6. Implement validation and auto-generation.
7. Add advanced features (templates, import/export).

#### Dependencies and Libraries
- Existing UI libraries (shadcn/ui, Tailwind CSS).
- Simple SVG or Canvas for diagram rendering.
- Date/time handling (date-fns or dayjs).
- YAML parsing (js-yaml).
- Form validation (react-hook-form or similar).

This prompt provides a comprehensive blueprint for developing the schedule workspace, ensuring it aligns with the existing route workspace architecture while addressing the unique requirements of schedule management.
