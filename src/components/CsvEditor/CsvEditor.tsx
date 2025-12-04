import React from 'react';
import { CsvEditorProvider } from './CsvEditorContext';
import { CsvToolbar } from './CsvToolbar';
import { CsvTableViewer } from './CsvTableViewer';
import { CsvEditorPane } from './CsvEditorPane';
import type { CsvEditorProps } from './types';
import { cn } from '@/lib/utils';

export function CsvEditor<T = any>({
  columns,
  initialData,
  templates,
  validators,
  transformers,
  renderers,
  onDataChange,
  onValidation,
  onImport,
  showToolbar = true,
  showEditorPane = true,
  maxRows,
  allowRowOperations = true,
  title,
  description,
}: CsvEditorProps<T>) {
  const handleImport = onImport
    ? async () => {
        // The import will be handled by the parent component
        // This is just a wrapper to trigger it
      }
    : undefined;

  return (
    <CsvEditorProvider
      columns={columns}
      initialData={initialData as Record<string, any>[]}
      validators={validators}
      onDataChange={onDataChange}
      onValidation={onValidation}
    >
      <div className="flex flex-col h-full bg-white border border-gray-200 overflow-hidden">
        {/* Header */}
        {(title || description) && (
          <div className="px-4 py-3 border-b border-gray-200">
            {title && <h2 className="font-semibold text-lg text-gray-900">{title}</h2>}
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
        )}

        {/* Toolbar */}
        {showToolbar && (
          <CsvToolbar
            templates={templates}
            onImport={handleImport}
            allowRowOperations={allowRowOperations}
          />
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Table Viewer */}
          <CsvTableViewer />

          {/* Editor Pane */}
          {showEditorPane && <CsvEditorPane />}
        </div>
      </div>
    </CsvEditorProvider>
  );
}

// Re-export types and utilities for external use
export * from './types';
export * from './utils';
export { useCsvEditor } from './CsvEditorContext';
