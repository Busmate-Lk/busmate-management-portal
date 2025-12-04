export type ValidatorFunction = (value: any, row: Record<string, any>) => ValidationResult;
export type TransformerFunction = (value: any, row: Record<string, any>) => any;
export type CustomRenderer = React.ComponentType<CellRendererProps>;

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface ValidationError {
  rowIndex: number;
  columnKey: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  value: any;
}

export interface CellRendererProps {
  value: any;
  row: Record<string, any>;
  column: ColumnDef;
  isEditing: boolean;
  onChange: (value: any) => void;
}

export interface ColumnDef<T = any> {
  key: string;
  header: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'select';
  required?: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  validator?: ValidatorFunction;
  transformer?: TransformerFunction;
  renderer?: CustomRenderer;
  csvHeader?: string | string[];
  editable?: boolean;
  hidden?: boolean;
}

export interface CsvTemplate {
  id: string;
  name: string;
  description?: string;
  headers: string[];
  sampleData?: string[][];
  delimiter?: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors?: ImportError[];
  importedIds?: string[];
}

export interface ImportError {
  rowIndex: number;
  originalRow: Record<string, any>;
  errors: string[];
}

export interface CsvEditorState {
  data: Record<string, any>[];
  originalData: Record<string, any>[];
  selectedRows: Set<number>;
  selectedCell: { rowIndex: number; columnKey: string } | null;
  validationErrors: ValidationError[];
  undoStack: Record<string, any>[][];
  redoStack: Record<string, any>[][];
  isLoading: boolean;
  searchQuery: string;
  columnMapping: Record<string, string>;
  isEditorPaneCollapsed: boolean;
}

export interface CsvEditorProps<T = any> {
  columns: ColumnDef<T>[];
  initialData?: T[];
  templates?: CsvTemplate[];
  
  validators?: Record<string, ValidatorFunction>;
  transformers?: Record<string, TransformerFunction>;
  renderers?: Record<string, CustomRenderer>;
  
  onDataChange?: (data: T[], isValid: boolean) => void;
  onValidation?: (errors: ValidationError[]) => void;
  onImport?: (data: T[]) => Promise<ImportResult>;
  
  showToolbar?: boolean;
  showEditorPane?: boolean;
  maxRows?: number;
  allowRowOperations?: boolean;
  title?: string;
  description?: string;
}

export interface CsvEditorContextValue {
  state: CsvEditorState;
  columns: ColumnDef[];
  dispatch: React.Dispatch<CsvEditorAction>;
  updateCell: (rowIndex: number, columnKey: string, value: any) => void;
  addRow: (data?: Record<string, any>) => void;
  deleteRows: (indices: number[]) => void;
  duplicateRows: (indices: number[]) => void;
  selectRow: (index: number, multi?: boolean) => void;
  selectCell: (rowIndex: number, columnKey: string) => void;
  undo: () => void;
  redo: () => void;
  validate: () => ValidationError[];
  parseCSV: (content: string) => void;
  exportCSV: () => string;
  exportJSON: () => string;
  getSelectedRowData: () => Record<string, any> | null;
  toggleEditorPane: () => void;
}

export type CsvEditorAction =
  | { type: 'SET_DATA'; payload: Record<string, any>[] }
  | { type: 'UPDATE_CELL'; payload: { rowIndex: number; columnKey: string; value: any } }
  | { type: 'ADD_ROW'; payload?: Record<string, any> }
  | { type: 'DELETE_ROWS'; payload: number[] }
  | { type: 'DUPLICATE_ROWS'; payload: number[] }
  | { type: 'SELECT_ROWS'; payload: { indices: number[]; multi?: boolean } }
  | { type: 'SELECT_CELL'; payload: { rowIndex: number; columnKey: string } | null }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationError[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_COLUMN_MAPPING'; payload: Record<string, string> }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'TOGGLE_EDITOR_PANE' };
