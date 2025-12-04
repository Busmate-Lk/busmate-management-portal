'use client'

import React, { useState, useCallback } from 'react';
import { ArrowLeft, Bus, Download, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/shared/layout';
import { CsvEditor, useCsvEditor } from '@/components/CsvEditor';
import type { ColumnDef, ValidationError, ImportResult, ValidationResult } from '@/components/CsvEditor/types';
import { CsvEditorProvider } from '@/components/CsvEditor/CsvEditorContext';
import { CsvToolbar } from '@/components/CsvEditor/CsvToolbar';
import { CsvTableViewer } from '@/components/CsvEditor/CsvTableViewer';
import { CsvEditorPane } from '@/components/CsvEditor/CsvEditorPane';
import { downloadFile, transformRow } from '@/components/CsvEditor/utils';

// Bus Stop column definitions
const busStopColumns: ColumnDef[] = [
  {
    key: 'name',
    header: 'Name (English)',
    description: 'Required. The primary name of the bus stop in English.',
    required: true,
    csvHeader: ['name', 'stop_name', 'bus_stop_name'],
    minWidth: 150,
  },
  {
    key: 'nameSinhala',
    header: 'Name (Sinhala)',
    description: 'Name of the bus stop in Sinhala.',
    csvHeader: ['name_sinhala', 'nameSinhala', 'sinhala_name'],
    minWidth: 150,
  },
  {
    key: 'nameTamil',
    header: 'Name (Tamil)',
    description: 'Name of the bus stop in Tamil.',
    csvHeader: ['name_tamil', 'nameTamil', 'tamil_name'],
    minWidth: 150,
  },
  {
    key: 'description',
    header: 'Description',
    description: 'Optional description or notes about the bus stop.',
    csvHeader: ['description', 'desc', 'notes'],
    minWidth: 200,
  },
  {
    key: 'latitude',
    header: 'Latitude',
    type: 'number',
    description: 'GPS latitude coordinate (-90 to 90).',
    csvHeader: ['latitude', 'lat', 'location_lat'],
    validator: (value: any): ValidationResult => {
      if (value === '' || value === undefined || value === null) {
        return { isValid: true };
      }
      const num = Number(value);
      if (isNaN(num) || num < -90 || num > 90) {
        return { isValid: false, message: 'Latitude must be between -90 and 90', severity: 'error' };
      }
      return { isValid: true };
    },
    width: 120,
  },
  {
    key: 'longitude',
    header: 'Longitude',
    type: 'number',
    description: 'GPS longitude coordinate (-180 to 180).',
    csvHeader: ['longitude', 'lng', 'lon', 'location_lng'],
    validator: (value: any): ValidationResult => {
      if (value === '' || value === undefined || value === null) {
        return { isValid: true };
      }
      const num = Number(value);
      if (isNaN(num) || num < -180 || num > 180) {
        return { isValid: false, message: 'Longitude must be between -180 and 180', severity: 'error' };
      }
      return { isValid: true };
    },
    width: 120,
  },
  {
    key: 'address',
    header: 'Address',
    csvHeader: ['address', 'street_address', 'location_address'],
    minWidth: 200,
  },
  {
    key: 'city',
    header: 'City',
    csvHeader: ['city', 'town'],
    width: 120,
  },
  {
    key: 'state',
    header: 'State/Province',
    csvHeader: ['state', 'province', 'region'],
    width: 120,
  },
  {
    key: 'zipCode',
    header: 'Zip Code',
    csvHeader: ['zipCode', 'zip_code', 'postal_code', 'zip'],
    width: 100,
  },
  {
    key: 'country',
    header: 'Country',
    csvHeader: ['country'],
    defaultValue: 'Sri Lanka',
    width: 120,
  },
  {
    key: 'isAccessible',
    header: 'Accessible',
    type: 'boolean',
    description: 'Is the stop wheelchair accessible?',
    csvHeader: ['isAccessible', 'is_accessible', 'accessible', 'wheelchair'],
    defaultValue: false,
    width: 100,
  },
];

// Inner component that uses the context
function BusStopImportContent() {
  const { state, validate, exportCSV } = useCsvEditor();
  const { toast } = useToast();
  
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const handleImport = useCallback(async () => {
    // First validate
    const errors = validate();
    const criticalErrors = errors.filter(e => e.severity === 'error');
    
    if (criticalErrors.length > 0) {
      toast({
        title: 'Validation Failed',
        description: `Please fix ${criticalErrors.length} error(s) before importing.`,
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);

    try {
      // Transform data to API format
      const transformedData = state.data.map((row) => {
        const stop: any = {
          name: row.name,
          nameSinhala: row.nameSinhala || undefined,
          nameTamil: row.nameTamil || undefined,
          description: row.description || undefined,
          isAccessible: row.isAccessible === true || row.isAccessible === 'true' || row.isAccessible === '1',
          location: {
            latitude: row.latitude ? Number(row.latitude) : undefined,
            longitude: row.longitude ? Number(row.longitude) : undefined,
            address: row.address || undefined,
            city: row.city || undefined,
            state: row.state || undefined,
            zipCode: row.zipCode || undefined,
            country: row.country || 'Sri Lanka',
          },
        };

        // Remove undefined values from location
        Object.keys(stop.location).forEach(key => {
          if (stop.location[key] === undefined) {
            delete stop.location[key];
          }
        });

        return stop;
      });

      // Create CSV blob for API
      const csvContent = exportCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });

      // Simulate API call (replace with actual API call)
      // const result = await BusStopManagementService.importStops('Sri Lanka', { file: blob });
      
      // Simulated result for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedResult: ImportResult = {
        success: true,
        totalRows: state.data.length,
        importedRows: state.data.length,
        failedRows: 0,
        importedIds: state.data.map((_, i) => `stop_${i + 1}`),
      };

      setImportResult(simulatedResult);
      setShowResultDialog(true);

      toast({
        title: 'Import Successful',
        description: `Successfully imported ${simulatedResult.importedRows} bus stops.`,
      });
    } catch (error: any) {
      const errorResult: ImportResult = {
        success: false,
        totalRows: state.data.length,
        importedRows: 0,
        failedRows: state.data.length,
        errors: [{ rowIndex: -1, originalRow: {}, errors: [error.message || 'Import failed'] }],
      };
      
      setImportResult(errorResult);
      setShowResultDialog(true);

      toast({
        title: 'Import Failed',
        description: error.message || 'An error occurred during import.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  }, [state.data, validate, exportCSV, toast]);

  const handleDownloadErrorReport = () => {
    if (!importResult?.errors) return;
    
    const report = importResult.errors.map((e) => ({
      rowIndex: e.rowIndex + 1,
      errors: e.errors.join('; '),
      ...e.originalRow,
    }));
    
    const content = JSON.stringify(report, null, 2);
    downloadFile(content, 'import-errors.json', 'application/json');
  };

  const errorCount = state.validationErrors.filter(e => e.severity === 'error').length;

  return (
    <Layout
      activeItem="tools"
      pageTitle="CSV Editor - Import Bus Stops"
      pageDescription="Upload CSV data to import multiple bus stops at once"
      role="mot"
      padding={0}
    >
      <div className="flex flex-col h-screen">
        {/* CSV Editor - Full Screen Height */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <CsvToolbar
            allowRowOperations={true}
            onImport={handleImport}
          />
          <div className="flex flex-1 overflow-hidden">
            <CsvTableViewer />
            <CsvEditorPane />
          </div>
        </div>

        {/* Import Action Bar - Fixed at bottom */}
        {state.data.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {state.data.length} row{state.data.length !== 1 ? 's' : ''} ready
              </span>
              {errorCount > 0 && (
                <span className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errorCount} error{errorCount !== 1 ? 's' : ''} to fix
                </span>
              )}
            </div>
            <Button
              onClick={handleImport}
              disabled={isImporting || errorCount > 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {isImporting ? (
                <>
                  <span className="animate-pulse">Importing...</span>
                </>
              ) : (
                <>
                  Import {state.data.length} Bus Stop{state.data.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {importResult?.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Import Successful
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Import Failed
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {importResult?.success
                ? 'Your bus stops have been imported successfully.'
                : 'There were errors during the import process.'}
            </DialogDescription>
          </DialogHeader>

          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <div className="text-2xl font-bold">{importResult.totalRows}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResult.importedRows}</div>
                  <div className="text-xs text-gray-600">Imported</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResult.failedRows}</div>
                  <div className="text-xs text-gray-600">Failed</div>
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 mb-2">
                    {importResult.errors.length} row{importResult.errors.length !== 1 ? 's' : ''} failed to import.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadErrorReport}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Error Report
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowResultDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

// Main page component with provider
export default function BusStopImportPage() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleDataChange = useCallback((newData: Record<string, any>[], isValid: boolean) => {
    setData(newData);
  }, []);

  const handleValidation = useCallback((errors: ValidationError[]) => {
    setValidationErrors(errors);
  }, []);

  return (
    <CsvEditorProvider
      columns={busStopColumns}
      initialData={[]}
      onDataChange={handleDataChange}
      onValidation={handleValidation}
    >
      <BusStopImportContent />
    </CsvEditorProvider>
  );
}
