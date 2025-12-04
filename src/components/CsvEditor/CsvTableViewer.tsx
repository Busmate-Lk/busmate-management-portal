import React, { useCallback, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef as TanstackColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useCsvEditor } from './CsvEditorContext';
import { getValidationClass } from './utils';
import { cn } from '@/lib/utils';

interface EditableCellProps {
  value: any;
  rowIndex: number;
  columnKey: string;
}

function EditableCell({ value, rowIndex, columnKey }: EditableCellProps) {
  const { updateCell, selectCell, state, columns } = useCsvEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value ?? ''));

  const isSelected = state.selectedCell?.rowIndex === rowIndex && 
                     state.selectedCell?.columnKey === columnKey;
  
  const validationClass = getValidationClass(state.validationErrors, rowIndex, columnKey);
  const column = columns.find(c => c.key === columnKey);

  const handleClick = () => {
    selectCell(rowIndex, columnKey);
    if (column?.editable !== false) {
      setIsEditing(true);
      setEditValue(String(value ?? ''));
    }
  };

  const handleDoubleClick = () => {
    // Double-click can still be used as an alternative way to edit
    if (column?.editable !== false && !isEditing) {
      setIsEditing(true);
      setEditValue(String(value ?? ''));
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== String(value ?? '')) {
      updateCell(rowIndex, columnKey, editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(String(value ?? ''));
    }
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="h-8 font-mono text-sm border-0 focus-visible:ring-1 focus-visible:ring-primary"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'px-3 py-2 font-mono text-sm cursor-pointer min-h-[36px] truncate',
        isSelected && 'ring-2 ring-inset ring-blue-500 bg-blue-50',
        validationClass
      )}
      title={String(value ?? '')}
    >
      {value ?? ''}
    </div>
  );
}

export function CsvTableViewer() {
  const { state, columns, selectRow, dispatch } = useCsvEditor();
  const [sorting, setSorting] = useState<SortingState>([]);

  const tableColumns = useMemo<TanstackColumnDef<Record<string, any>>[]>(() => {
    const cols: TanstackColumnDef<Record<string, any>>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <div className="px-2">
            <Checkbox
              checked={state.selectedRows.has(row.index)}
              onCheckedChange={() => selectRow(row.index, true)}
              aria-label="Select row"
            />
          </div>
        ),
        size: 40,
      },
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => (
          <div className="px-2 text-muted-foreground font-mono text-xs">
            {row.index + 1}
          </div>
        ),
        size: 50,
      },
    ];

    columns.filter(c => !c.hidden).forEach((col) => {
      cols.push({
        id: col.key,
        accessorKey: col.key,
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => column.toggleSorting()}
          >
            <span>{col.header}</span>
            {col.required && <span className="text-destructive">*</span>}
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </button>
        ),
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            rowIndex={row.index}
            columnKey={col.key}
          />
        ),
        size: col.width || 150,
        minSize: col.minWidth || 80,
        maxSize: col.maxWidth || 400,
      });
    });

    return cols;
  }, [columns, state.selectedRows, selectRow]);

  const table = useReactTable({
    data: state.data,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (state.data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No data loaded</p>
          <p className="text-sm">Upload a CSV file, paste CSV content, or download a template to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-2 text-left font-medium text-gray-900 border-r border-b border-gray-200 bg-gray-50"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'hover:bg-gray-50 transition-colors',
                state.selectedRows.has(row.index) && 'bg-blue-50'
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-r border-b border-gray-200 p-0"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
