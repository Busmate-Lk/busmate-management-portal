import React from 'react';
import { X, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCsvEditor } from './CsvEditorContext';
import { cn } from '@/lib/utils';

export function CsvEditorPane() {
  const { state, columns, updateCell, dispatch, getSelectedRowData, toggleEditorPane } = useCsvEditor();
  
  const selectedData = getSelectedRowData();
  const selectedRowIndex = state.selectedCell?.rowIndex ?? 
    (state.selectedRows.size === 1 ? Array.from(state.selectedRows)[0] : null);

  if (state.isEditorPaneCollapsed) {
    return (
      <div className="w-12 border-l border-gray-200 bg-white flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleEditorPane}
          className="p-2"
          title="Expand editor pane"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {selectedRowIndex !== null && (
          <div className="mt-4 text-xs text-gray-500 writing-mode-vertical">
            Row {selectedRowIndex + 1}
          </div>
        )}
      </div>
    );
  }

  if (selectedRowIndex === null || !selectedData) {
    return (
      <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
        {/* Header with collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold">Editor</h3>
          <Button variant="ghost" size="sm" onClick={toggleEditorPane}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center flex-1 text-gray-500">
          <div className="text-center p-6">
            <p className="text-sm">Select a row to edit</p>
            <p className="text-xs mt-1">Click on a row or cell to view and edit its details</p>
          </div>
        </div>
      </div>
    );
  }

  const rowErrors = state.validationErrors.filter(e => e.rowIndex === selectedRowIndex);

  const handleClose = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const renderField = (column: typeof columns[0]) => {
    const value = selectedData[column.key];
    const error = rowErrors.find(e => e.columnKey === column.key);
    const isEditable = column.editable !== false;

    const commonProps = {
      id: column.key,
      disabled: !isEditable,
      className: cn(
        error && error.severity === 'error' && 'border-red-500 focus-visible:ring-red-500',
        error && error.severity === 'warning' && 'border-yellow-500 focus-visible:ring-yellow-500'
      ),
    };

    if (column.type === 'boolean') {
      return (
        <div className="flex items-center gap-2">
          <Switch
            id={column.key}
            checked={value === true || value === 'true' || value === '1' || value === 'yes'}
            onCheckedChange={(checked) => updateCell(selectedRowIndex, column.key, checked)}
            disabled={!isEditable}
          />
          <Label htmlFor={column.key} className="text-sm text-muted-foreground">
            {value ? 'Yes' : 'No'}
          </Label>
        </div>
      );
    }

    if (column.type === 'select' && column.options) {
      return (
        <Select
          value={String(value ?? '')}
          onValueChange={(v) => updateCell(selectedRowIndex, column.key, v)}
          disabled={!isEditable}
        >
          <SelectTrigger {...commonProps}>
            <SelectValue placeholder={`Select ${column.header}`} />
          </SelectTrigger>
          <SelectContent>
            {column.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.description || (typeof value === 'string' && value.length > 50)) {
      return (
        <Textarea
          {...commonProps}
          value={value ?? ''}
          onChange={(e) => updateCell(selectedRowIndex, column.key, e.target.value)}
          rows={3}
          className={cn('font-mono text-sm resize-none', commonProps.className)}
        />
      );
    }

    return (
      <Input
        {...commonProps}
        type={column.type === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={(e) => updateCell(selectedRowIndex, column.key, e.target.value)}
        className={cn('font-mono', commonProps.className)}
      />
    );
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold">Row {selectedRowIndex + 1}</h3>
          <p className="text-xs text-muted-foreground">
            {rowErrors.length === 0 ? (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle className="h-3 w-3" />
                All fields valid
              </span>
            ) : (
              <span className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-3 w-3" />
                {rowErrors.length} validation issue{rowErrors.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={toggleEditorPane}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Fields */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {columns.filter(c => !c.hidden).map((column) => {
            const error = rowErrors.find(e => e.columnKey === column.key);
            
            return (
              <div key={column.key} className="space-y-2">
                <Label htmlFor={column.key} className="flex items-center gap-1">
                  {column.header}
                  {column.required && <span className="text-destructive">*</span>}
                </Label>
                
                {column.description && (
                  <p className="text-xs text-muted-foreground">{column.description}</p>
                )}
                
                {renderField(column)}
                
                {error && (
                  <p className={cn(
                    'text-xs flex items-center gap-1',
                    error.severity === 'error' ? 'text-destructive' : 'text-warning'
                  )}>
                    <AlertCircle className="h-3 w-3" />
                    {error.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
