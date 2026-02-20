'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, RefreshCw, AlertCircle, Download, ChevronRight } from 'lucide-react';
import { Header } from '@/components/operator/header';
import { PermitSummaryCard } from '@/components/operator/permits/PermitSummaryCard';
import { PermitInfoPanel } from '@/components/operator/permits/PermitInfoPanel';
import { getMockPermitById, type OperatorPermitDetail } from '@/data/operator/permits';

export default function ServicePermitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const permitId = params.permitId as string;

  // ── State ─────────────────────────────────────────────────────────────────
  const [permit, setPermit] = useState<OperatorPermitDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Data loading ──────────────────────────────────────────────────────────
  const loadPermit = useCallback(() => {
    if (!permitId) return;
    setIsLoading(true);
    setError(null);

    // Simulate async delay (replace with real API call)
    const timer = setTimeout(() => {
      try {
        const data = getMockPermitById(permitId);
        if (data) {
          setPermit(data);
        } else {
          setError(`Permit "${permitId}" was not found.`);
        }
      } catch {
        setError('An unexpected error occurred while loading the permit.');
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [permitId]);

  useEffect(() => {
    loadPermit();
  }, [loadPermit]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleBack = () => {
    router.push('/operator/passenger-service-permits');
  };

  const handleRefresh = () => {
    loadPermit();
  };

  const handleExport = () => {
    // Placeholder: implement PDF/print when needed
    window.print();
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header pageTitle="Service Permit Details" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderWidth: 3 }} />
            <p className="text-gray-500 text-sm">Loading permit details…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !permit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header pageTitle="Service Permit Details" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Permit not found</h2>
            <p className="text-sm text-gray-500 mb-6">{error ?? 'The requested permit could not be found.'}</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Permits
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        pageTitle="Service Permit Details"
        pageDescription={permit.permitNumber}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <nav className="flex items-center gap-1 text-sm text-gray-500" aria-label="Breadcrumb">
            <button
              onClick={handleBack}
              className="hover:text-blue-600 transition-colors"
            >
              Service Permits
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900 font-mono">{permit.permitNumber}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Read-only notice */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            This permit is issued and managed by the Ministry of Transport. All information is
            read-only. Contact the MOT to request any modifications.
          </span>
        </div>

        {/* Permit summary card */}
        <PermitSummaryCard permit={permit} />

        {/* Tabbed detail panel */}
        <PermitInfoPanel permit={permit} />
      </main>
    </div>
  );
}
