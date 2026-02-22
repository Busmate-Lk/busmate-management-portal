'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Upload,
  Download,
  CheckSquare,
  MoreHorizontal,
} from 'lucide-react';

interface BusStopActionButtonsProps {
  onAddBusStop: () => void;
  onImportBusStops: () => void;
  onBulkOperations?: () => void;
  isLoading?: boolean;
  selectedCount?: number;
}

// ── Shared button primitive ───────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'ghost' | 'warning';

const VARIANT_CLS: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500',
  secondary:
    'border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 focus-visible:ring-gray-400',
  ghost:
    'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 active:bg-blue-200 focus-visible:ring-blue-400',
  warning:
    'border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-300 active:bg-orange-200 focus-visible:ring-orange-400',
};

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: Variant;
  badge?: number;
}

function ActionButton({
  icon,
  label,
  variant = 'secondary',
  badge,
  className = '',
  disabled,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`
        relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
        transition-all duration-150 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${VARIANT_CLS[variant]}
        ${className}
      `}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-0.5 inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] rounded-full bg-white/30 text-[10px] font-bold px-1">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Overflow dropdown (xs screens only) ──────────────────────────

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'warning';
}

function OverflowMenu({ items }: { items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More actions"
        aria-expanded={open}
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[168px] rounded-xl border border-gray-100 bg-white shadow-lg py-1.5 ring-1 ring-black/5">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`
                w-full flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-left
                transition-colors duration-100
                disabled:opacity-50 disabled:cursor-not-allowed
                ${item.variant === 'warning'
                  ? 'text-orange-700 hover:bg-orange-50'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="shrink-0 opacity-70">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export function BusStopActionButtons({
  onAddBusStop,
  onImportBusStops,
  onBulkOperations,
  isLoading = false,
  selectedCount = 0,
}: BusStopActionButtonsProps) {
  const router = useRouter();
  const handleExport = () => router.push('/mot/bus-stops/export');

  const overflowItems: DropdownItem[] = [
    { icon: <Upload className="h-3.5 w-3.5" />,   label: 'Import Stops',  onClick: onImportBusStops, disabled: isLoading },
    { icon: <Download className="h-3.5 w-3.5" />, label: 'Export Stops',  onClick: handleExport,     disabled: isLoading },
    ...(selectedCount > 0 && onBulkOperations
      ? [{ icon: <CheckSquare className="h-3.5 w-3.5" />, label: `Bulk Actions (${selectedCount})`, onClick: onBulkOperations, disabled: isLoading, variant: 'warning' as const }]
      : []),
  ];

  return (
    <div className="flex items-center gap-2">

      {/* Bulk — sm+ only, when items are selected */}
      {selectedCount > 0 && onBulkOperations && (
        <ActionButton
          icon={<CheckSquare className="h-4 w-4" />}
          label="Bulk Actions"
          badge={selectedCount}
          variant="warning"
          onClick={onBulkOperations}
          disabled={isLoading}
          className="hidden sm:inline-flex"
        />
      )}

      {/* Export — sm+ only */}
      <ActionButton
        icon={<Download className="h-4 w-4" />}
        label="Export"
        variant="secondary"
        onClick={handleExport}
        disabled={isLoading}
        className="hidden sm:inline-flex"
      />

      {/* Import — sm+ only */}
      <ActionButton
        icon={<Upload className="h-4 w-4" />}
        label="Import"
        variant="ghost"
        onClick={onImportBusStops}
        disabled={isLoading}
        className="hidden sm:inline-flex"
      />

      {/* Add Bus Stop — always visible (primary CTA) */}
      <ActionButton
        icon={<Plus className="h-4 w-4" />}
        label="Add Bus Stop"
        variant="primary"
        onClick={onAddBusStop}
        disabled={isLoading}
      />

      {/* Overflow menu — xs screens only */}
      <OverflowMenu items={overflowItems} />
    </div>
  );
}