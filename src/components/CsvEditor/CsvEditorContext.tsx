import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { 
  CsvEditorState, 
  CsvEditorAction, 
  CsvEditorContextValue, 
  ColumnDef, 
  ValidationError 
} from './types';
import { 
  parseCSVContent, 
  exportToCSV, 
  exportToJSON, 
  validateAllRows, 
  createEmptyRow 
} from './utils';

const initialState: CsvEditorState = {
  data: [],
  originalData: [],
  selectedRows: new Set(),
  selectedCell: null,
  validationErrors: [],
  undoStack: [],
  redoStack: [],
  isLoading: false,
  searchQuery: '',
  columnMapping: {},
  isEditorPaneCollapsed: false,
};

function csvEditorReducer(state: CsvEditorState, action: CsvEditorAction): CsvEditorState {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        originalData: action.payload,
        undoStack: [],
        redoStack: [],
        selectedRows: new Set(),
        selectedCell: null,
      };

    case 'UPDATE_CELL': {
      const { rowIndex, columnKey, value } = action.payload;
      const newData = state.data.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnKey]: value } : row
      );
      return {
        ...state,
        data: newData,
        undoStack: [...state.undoStack, state.data],
        redoStack: [],
      };
    }

    case 'ADD_ROW': {
      const newRow = action.payload || {};
      return {
        ...state,
        data: [...state.data, newRow],
        undoStack: [...state.undoStack, state.data],
        redoStack: [],
      };
    }

    case 'DELETE_ROWS': {
      const indicesToDelete = new Set(action.payload);
      const newData = state.data.filter((_, idx) => !indicesToDelete.has(idx));
      return {
        ...state,
        data: newData,
        selectedRows: new Set(),
        selectedCell: null,
        undoStack: [...state.undoStack, state.data],
        redoStack: [],
      };
    }

    case 'DUPLICATE_ROWS': {
      const rowsToDuplicate = action.payload.map(idx => ({ ...state.data[idx] }));
      return {
        ...state,
        data: [...state.data, ...rowsToDuplicate],
        undoStack: [...state.undoStack, state.data],
        redoStack: [],
      };
    }

    case 'SELECT_ROWS': {
      const { indices, multi } = action.payload;
      const newSelected = new Set(multi ? state.selectedRows : []);
      indices.forEach(idx => {
        if (newSelected.has(idx)) {
          newSelected.delete(idx);
        } else {
          newSelected.add(idx);
        }
      });
      return { ...state, selectedRows: newSelected };
    }

    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload };

    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const previousData = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        data: previousData,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.data],
      };
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      const nextData = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        data: nextData,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, state.data],
      };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'SET_COLUMN_MAPPING':
      return { ...state, columnMapping: action.payload };

    case 'CLEAR_SELECTION':
      return { ...state, selectedRows: new Set(), selectedCell: null };

    case 'TOGGLE_EDITOR_PANE':
      return { ...state, isEditorPaneCollapsed: !state.isEditorPaneCollapsed };

    default:
      return state;
  }
}

const CsvEditorContext = createContext<CsvEditorContextValue | null>(null);

interface CsvEditorProviderProps {
  children: React.ReactNode;
  columns: ColumnDef[];
  initialData?: Record<string, any>[];
  validators?: Record<string, (value: any, row: Record<string, any>) => any>;
  onDataChange?: (data: Record<string, any>[], isValid: boolean) => void;
  onValidation?: (errors: ValidationError[]) => void;
}

export function CsvEditorProvider({ 
  children, 
  columns, 
  initialData,
  validators,
  onDataChange,
  onValidation 
}: CsvEditorProviderProps) {
  const [state, dispatch] = useReducer(csvEditorReducer, {
    ...initialState,
    data: initialData || [],
    originalData: initialData || [],
  });

  const updateCell = useCallback((rowIndex: number, columnKey: string, value: any) => {
    dispatch({ type: 'UPDATE_CELL', payload: { rowIndex, columnKey, value } });
  }, []);

  const addRow = useCallback((data?: Record<string, any>) => {
    const newRow = data || createEmptyRow(columns);
    dispatch({ type: 'ADD_ROW', payload: newRow });
  }, [columns]);

  const deleteRows = useCallback((indices: number[]) => {
    dispatch({ type: 'DELETE_ROWS', payload: indices });
  }, []);

  const duplicateRows = useCallback((indices: number[]) => {
    dispatch({ type: 'DUPLICATE_ROWS', payload: indices });
  }, []);

  const selectRow = useCallback((index: number, multi?: boolean) => {
    dispatch({ type: 'SELECT_ROWS', payload: { indices: [index], multi } });
  }, []);

  const selectCell = useCallback((rowIndex: number, columnKey: string) => {
    dispatch({ type: 'SELECT_CELL', payload: { rowIndex, columnKey } });
    dispatch({ type: 'SELECT_ROWS', payload: { indices: [rowIndex], multi: false } });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const validate = useCallback(() => {
    const errors = validateAllRows(state.data, columns, validators);
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
    onValidation?.(errors);
    return errors;
  }, [state.data, columns, validators, onValidation]);

  const parseCSV = useCallback((content: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = parseCSVContent(content, columns);
      dispatch({ type: 'SET_DATA', payload: data });
      
      // Validate after parsing
      setTimeout(() => {
        const errors = validateAllRows(data, columns, validators);
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
        onDataChange?.(data, errors.filter(e => e.severity === 'error').length === 0);
        onValidation?.(errors);
      }, 0);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [columns, validators, onDataChange, onValidation]);

  const exportCSV = useCallback(() => {
    return exportToCSV(state.data, columns);
  }, [state.data, columns]);

  const exportJSON = useCallback(() => {
    return exportToJSON(state.data);
  }, [state.data]);

  const getSelectedRowData = useCallback(() => {
    if (state.selectedCell) {
      return state.data[state.selectedCell.rowIndex] || null;
    }
    const selectedIndices = Array.from(state.selectedRows);
    if (selectedIndices.length === 1) {
      return state.data[selectedIndices[0]] || null;
    }
    return null;
  }, [state.data, state.selectedRows, state.selectedCell]);

  // Call onDataChange when data changes
  React.useEffect(() => {
    const errors = state.validationErrors.filter(e => e.severity === 'error');
    onDataChange?.(state.data, errors.length === 0);
  }, [state.data, state.validationErrors, onDataChange]);

  const value = useMemo<CsvEditorContextValue>(() => ({
    state,
    columns,
    dispatch,
    updateCell,
    addRow,
    deleteRows,
    duplicateRows,
    selectRow,
    selectCell,
    undo,
    redo,
    validate,
    parseCSV,
    exportCSV,
    exportJSON,
    getSelectedRowData,
    toggleEditorPane: () => dispatch({ type: 'TOGGLE_EDITOR_PANE' }),
  }), [
    state, columns, updateCell, addRow, deleteRows, duplicateRows,
    selectRow, selectCell, undo, redo, validate, parseCSV, exportCSV, exportJSON, getSelectedRowData
  ]);

  return (
    <CsvEditorContext.Provider value={value}>
      {children}
    </CsvEditorContext.Provider>
  );
}

export function useCsvEditor() {
  const context = useContext(CsvEditorContext);
  if (!context) {
    throw new Error('useCsvEditor must be used within a CsvEditorProvider');
  }
  return context;
}
