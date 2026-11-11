import React, { useState } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  IndianRupee, 
  User, 
  Sliders 
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface SettingsViewProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onExportData,
  onImportData,
  onResetData
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="font-display text-display-md text-ink-900 dark:text-ink-50">
          Settings &amp; Data Management
        </h3>
        <p className="text-body-md text-ink-600 dark:text-ink-300 mt-1">
          Configure your academic criteria, monthly allowance, UPI handle &amp; local data backups
        </p>
      </div>

      {/* Student Profile Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-ink-200/60 dark:border-ink-700/30">
          <User className="w-5 h-5 text-accent-600 dark:text-accent-400" />
          <h4 className="font-display text-sub-lg text-ink-800 dark:text-ink-100">
            Student Academic Profile
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/50 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/40 focus:border-accent-600 transition-colors"
            />
          </div>

          <div>
            <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
              Roll / Student ID Number
            </label>
            <input
              type="text"
              required
              value={formData.rollNumber}
              onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/50 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/40 focus:border-accent-600 transition-colors"
            />
          </div>

          <div>
            <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
              Department / Major
            </label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3.5 py-2.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/50 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/40 focus:border-accent-600 transition-colors"
            />
          </div>

          <div>
            <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
              Current Semester
            </label>
            <input
              type="number"
              min="1"
              max="10"
              required
              value={formData.semester}
              onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3.5 py-2.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/50 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/40 focus:border-accent-600 transition-colors"
            />
          </div>

          <div>
            <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
              Target Minimum Attendance Threshold (%)
            </label>
            <input
              type="number"
              min="50"
              max="95"
              required
              value={formData.defaultTargetAttendance}
              onChange={e => setFormData({ ...formData, defaultTargetAttendance: parseInt(e.target.value, 10) || 75 })}
              className="w-full px-3.5 py-2.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/50 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/40 focus:border-accent-600 transition-colors"
            />
            <span className="text-body-xs text-ink-400 mt-1.5 block">
              Standard university requirement is usually 75% or 80%.
            </span>
          </div>

          <div>
            <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
              Monthly Pocket Money / Allowance (₹)
            </label>
            <input
              type="number"
              min="1000"
              step="500"
              required
              value={formData.monthlyAllowance}
              onChange={e => setFormData({ ...formData, monthlyAllowance: parseFloat(e.target.value) || 8000 })}
              className="w-full px-3.5 py-2.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/50 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/40 focus:border-accent-600 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
              Your UPI ID (For Auto-Reminders &amp; Group Settlements)
            </label>
            <input
              type="text"
              required
              value={formData.upiId}
              onChange={e => setFormData({ ...formData, upiId: e.target.value })}
              placeholder="e.g. arjun.verma@okhdfcbank"
              className="w-full px-3.5 py-2.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/50 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/40 focus:border-accent-600 transition-colors font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-accent flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4 text-accent-100" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Backup & Persistence Operations */}
      <div className="card p-6 space-y-4">
        <h4 className="font-display text-sub-lg text-ink-800 dark:text-ink-100">
          Data Backup &amp; Factory Reset
        </h4>
        <p className="text-body-sm text-ink-600 dark:text-ink-300">
          All data is persisted privately inside your browser&apos;s local storage. You can backup your ledger, schedule, and attendance stats as a portable JSON file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportData}
            className="btn-accent-outline flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data as JSON</span>
          </button>

          <label className="btn-accent-outline flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import / Restore JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportData}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetData}
            className="flex items-center gap-2 px-4 py-2 text-body-sm font-semibold bg-danger-50 hover:bg-danger-100 text-danger-700 dark:bg-danger-500/10 dark:hover:bg-danger-500/20 dark:text-danger-500 rounded-xl border border-danger-200/70 dark:border-danger-500/20 transition-all ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

