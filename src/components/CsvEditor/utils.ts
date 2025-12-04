import Papa from 'papaparse';
import type { ColumnDef, ValidationError, ValidationResult } from './types';

export function parseCSVContent(
  content: string,
  columns: ColumnDef[]
): { data: Record<string, any>[]; detectedDelimiter: string } {
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (header) => header.trim(),
  });

  const detectedDelimiter = result.meta.delimiter || ',';
  const parsedData = result.data as Record<string, any>[];

  // Map CSV headers to column keys
  const mappedData = parsedData.map((row) => {
    const mappedRow: Record<string, any> = {};
    
    columns.forEach((col) => {
      const csvHeaders = Array.isArray(col.csvHeader) 
        ? col.csvHeader 
        : col.csvHeader 
          ? [col.csvHeader] 
          : [col.key, col.header];
      
      let value: any = undefined;
      for (const header of csvHeaders) {
        const normalizedHeader = header.toLowerCase().replace(/[_\s]/g, '');
        const matchingKey = Object.keys(row).find(
          (k) => k.toLowerCase().replace(/[_\s]/g, '') === normalizedHeader
        );
        if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== '') {
          value = row[matchingKey];
          break;
        }
      }
      
      mappedRow[col.key] = value ?? col.defaultValue ?? '';
    });
    
    return mappedRow;
  });

  return { data: mappedData, detectedDelimiter };
}

export function exportToCSV(data: Record<string, any>[], columns: ColumnDef[]): string {
  const headers = columns.filter(c => !c.hidden).map(c => c.header);
  const rows = data.map((row) =>
    columns.filter(c => !c.hidden).map((col) => {
      const value = row[col.key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    })
  );

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportToJSON(data: Record<string, any>[]): string {
  return JSON.stringify(data, null, 2);
}

export function validateRow(
  row: Record<string, any>,
  rowIndex: number,
  columns: ColumnDef[],
  customValidators?: Record<string, (value: any, row: Record<string, any>) => ValidationResult>
): ValidationError[] {
  const errors: ValidationError[] = [];

  columns.forEach((col) => {
    const value = row[col.key];

    // Required validation
    if (col.required && (value === undefined || value === null || value === '')) {
      errors.push({
        rowIndex,
        columnKey: col.key,
        message: `${col.header} is required`,
        severity: 'error',
        value,
      });
      return;
    }

    // Type validation
    if (value !== undefined && value !== null && value !== '') {
      if (col.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push({
            rowIndex,
            columnKey: col.key,
            message: `${col.header} must be a valid number`,
            severity: 'error',
            value,
          });
        }
      }

      if (col.type === 'boolean') {
        const lower = String(value).toLowerCase();
        if (!['true', 'false', '1', '0', 'yes', 'no'].includes(lower)) {
          errors.push({
            rowIndex,
            columnKey: col.key,
            message: `${col.header} must be a boolean value`,
            severity: 'error',
            value,
          });
        }
      }
    }

    // Custom validator
    const validator = col.validator || customValidators?.[col.key];
    if (validator && value !== undefined && value !== null && value !== '') {
      const result = validator(value, row);
      if (!result.isValid) {
        errors.push({
          rowIndex,
          columnKey: col.key,
          message: result.message || `Invalid value for ${col.header}`,
          severity: result.severity || 'error',
          value,
        });
      }
    }
  });

  return errors;
}

export function validateAllRows(
  data: Record<string, any>[],
  columns: ColumnDef[],
  customValidators?: Record<string, (value: any, row: Record<string, any>) => ValidationResult>
): ValidationError[] {
  return data.flatMap((row, index) => validateRow(row, index, columns, customValidators));
}

export function transformRow(
  row: Record<string, any>,
  columns: ColumnDef[],
  customTransformers?: Record<string, (value: any, row: Record<string, any>) => any>
): Record<string, any> {
  const transformed: Record<string, any> = { ...row };

  columns.forEach((col) => {
    const transformer = col.transformer || customTransformers?.[col.key];
    if (transformer) {
      transformed[col.key] = transformer(row[col.key], row);
    } else if (col.type === 'number' && row[col.key] !== '' && row[col.key] !== undefined) {
      transformed[col.key] = Number(row[col.key]);
    } else if (col.type === 'boolean' && row[col.key] !== '' && row[col.key] !== undefined) {
      const lower = String(row[col.key]).toLowerCase();
      transformed[col.key] = ['true', '1', 'yes'].includes(lower);
    }
  });

  return transformed;
}

export function generateTemplateCSV(columns: ColumnDef[], sampleRows = 2): string {
  const headers = columns.filter(c => !c.hidden).map(c => c.header);
  const sampleData: string[][] = [];

  for (let i = 0; i < sampleRows; i++) {
    const row = columns.filter(c => !c.hidden).map((col) => {
      if (col.defaultValue !== undefined) return String(col.defaultValue);
      switch (col.type) {
        case 'number': return '0';
        case 'boolean': return 'false';
        case 'select': return col.options?.[0]?.value ?? '';
        default: return `Sample ${col.header} ${i + 1}`;
      }
    });
    sampleData.push(row);
  }

  return [headers.join(','), ...sampleData.map(r => r.join(','))].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function createEmptyRow(columns: ColumnDef[]): Record<string, any> {
  const row: Record<string, any> = {};
  columns.forEach((col) => {
    row[col.key] = col.defaultValue ?? '';
  });
  return row;
}

export function getValidationClass(
  errors: ValidationError[],
  rowIndex: number,
  columnKey: string
): string {
  const error = errors.find(e => e.rowIndex === rowIndex && e.columnKey === columnKey);
  if (!error) return '';
  
  switch (error.severity) {
    case 'error': return 'bg-red-50 border-red-200 text-red-900';
    case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    default: return '';
  }
}
