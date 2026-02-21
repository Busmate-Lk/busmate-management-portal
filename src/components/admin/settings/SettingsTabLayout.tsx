'use client';

import { useState } from 'react';
import {
  Settings,
  Zap,
  Wrench,
  Database,
} from 'lucide-react';
import { GeneralSettingsPanel } from './GeneralSettingsPanel';
import { ApiSettingsPanel } from './ApiSettingsPanel';
import { MaintenanceSettingsPanel } from './MaintenanceSettingsPanel';
import { BackupSettingsPanel } from './BackupSettingsPanel';

// ── Tab definitions ──────────────────────────────────────────────

export type SettingsTab = 'general' | 'api' | 'maintenance' | 'backup';

const TABS: {
  key: SettingsTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    key: 'general',
    label: 'General',
    icon: <Settings className="h-4 w-4" />,
    description: 'Site info, contact, security & notifications',
  },
  {
    key: 'api',
    label: 'API Settings',
    icon: <Zap className="h-4 w-4" />,
    description: 'Rate limits, CORS, caching & API keys',
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    icon: <Wrench className="h-4 w-4" />,
    description: 'Maintenance mode, scheduling & actions',
  },
  {
    key: 'backup',
    label: 'Backup & Restore',
    icon: <Database className="h-4 w-4" />,
    description: 'Backup config, history & recovery',
  },
];

// ── Component ────────────────────────────────────────────────────

interface SettingsTabLayoutProps {
  initialTab?: SettingsTab;
}

export function SettingsTabLayout({ initialTab = 'general' }: SettingsTabLayoutProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={tab.description}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && <GeneralSettingsPanel />}
      {activeTab === 'api' && <ApiSettingsPanel />}
      {activeTab === 'maintenance' && <MaintenanceSettingsPanel />}
      {activeTab === 'backup' && <BackupSettingsPanel />}
    </div>
  );
}
