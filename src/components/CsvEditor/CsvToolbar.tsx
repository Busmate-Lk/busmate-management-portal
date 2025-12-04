import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Copy, 
  Undo2, 
  Redo2, 
  FileText,
  FileJson,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCsvEditor } from './CsvEditorContext';
import { generateTemplateCSV, downloadFile } from './utils';
import type { CsvTemplate } from './types';

interface CsvToolbarProps {
  templates?: CsvTemplate[];
  onImport?: () => Promise<void>;
  allowRowOperations?: boolean;
}

export function CsvToolbar({ templates, onImport, allowRowOperations = true }: CsvToolbarProps) {
  const { 
    state, 
    columns, 
    parseCSV, 
    exportCSV, 
    exportJSON, 
    addRow, 
    deleteRows, 
    duplicateRows, 
    undo, 
    redo,
    validate
  } = useCsvEditor();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState('');

  const selectedCount = state.selectedRows.size;
  const hasData = state.data.length > 0;
  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;
  const errorCount = state.validationErrors.filter(e => e.severity === 'error').length;
  const warningCount = state.validationErrors.filter(e => e.severity === 'warning').length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCSV(content);
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteSubmit = () => {
    if (pasteContent.trim()) {
      parseCSV(pasteContent);
      setPasteContent('');
      setPasteDialogOpen(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent = generateTemplateCSV(columns);
    downloadFile(templateContent, 'template.csv', 'text/csv');
  };

  const handleExportCSV = () => {
    const content = exportCSV();
    downloadFile(content, 'export.csv', 'text/csv');
  };

  const handleExportJSON = () => {
    const content = exportJSON();
    downloadFile(content, 'export.json', 'application/json');
  };

  const handleDeleteSelected = () => {
    const indices = Array.from(state.selectedRows);
    deleteRows(indices);
  };

  const handleDuplicateSelected = () => {
    const indices = Array.from(state.selectedRows);
    duplicateRows(indices);
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {/* File Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload CSV
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPasteDialogOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Paste CSV
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
        >
          <Download className="h-4 w-4 mr-2" />
          Template
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Row Operations */}
        {allowRowOperations && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addRow()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>

            {selectedCount > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicateSelected}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate ({selectedCount})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedCount})
                </Button>
              </>
            )}

            <div className="w-px h-6 bg-border mx-2" />
          </>
        )}

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Validation Status */}
        {hasData && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              {state.data.length} rows
            </span>
            {errorCount > 0 ? (
              <span className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errorCount} errors
              </span>
            ) : (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle className="h-4 w-4" />
                Valid
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-warning">
                <AlertCircle className="h-4 w-4" />
                {warningCount} warnings
              </span>
            )}
          </div>
        )}

        {/* Export */}
        {hasData && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Import Button */}
        {onImport && hasData && (
          <Button
            onClick={onImport}
            disabled={state.isLoading || errorCount > 0}
          >
            {state.isLoading ? (
              <>
                <span className="animate-pulse-subtle">Importing...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import {state.data.length} Rows
              </>
            )}
          </Button>
        )}
      </div>

      {/* Paste Dialog */}
      <Dialog open={pasteDialogOpen} onOpenChange={setPasteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Paste CSV Data</DialogTitle>
            <DialogDescription>
              Paste your CSV content below. The first row should contain column headers.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder={`name,name_sinhala,latitude,longitude,city\nMain Bus Stop,ප්‍රධාන බස් නැවතුම,6.9271,79.8612,Colombo`}
            className="font-mono min-h-[200px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasteSubmit} disabled={!pasteContent.trim()}>
              Parse CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
