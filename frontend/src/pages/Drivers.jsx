import { useState, useMemo } from 'react';
import { Plus, Users, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useDrivers } from '../hooks/useDrivers';
import driverService from '../services/driverService';
import DriverTable, { DriverTableSkeleton } from '../components/drivers/DriverTable';
import DriverForm from '../components/drivers/DriverForm';

const STATUS_FILTERS = ['all', 'available', 'on_trip', 'off_duty', 'suspended'];

const CHIP_STYLES = {
  all:       'bg-slate-100 text-slate-700 border-slate-200',
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  on_trip:   'bg-blue-100 text-blue-700 border-blue-200',
  off_duty:  'bg-slate-100 text-slate-500 border-slate-200',
  suspended: 'bg-red-100 text-red-700 border-red-200',
};

export default function Drivers() {
  const { role } = useAuth();
  const canEdit    = role === ROLES.MANAGER;
  const canSuspend = role === ROLES.SAFETY || role === ROLES.MANAGER;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  // Suspend modal state
  const [suspending, setSuspending] = useState(null); // driver object
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendLoading, setSuspendLoading] = useState(false);

  const { drivers, loading, error, refetch } = useDrivers();

  const filtered = useMemo(() => {
    return drivers.filter(d => {
      const matchSearch =
        !search ||
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.license_number?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [drivers, search, statusFilter]);

  const openCreate = () => { setEditingDriver(null); setFormOpen(true); };
  const openEdit   = (d) => { setEditingDriver(d);   setFormOpen(true); };

  const handleSuccess = (message) => {
    toast.success(message);
    refetch();
  };

  // Suspend flow
  const openSuspend = (driver) => {
    setSuspending(driver);
    setSuspendReason('');
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) { toast.error('Please enter a reason'); return; }
    setSuspendLoading(true);
    try {
      await driverService.suspend(suspending.id, suspendReason);
      toast.success(`${suspending.name} has been suspended`);
      setSuspending(null);
      refetch();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to suspend driver';
      toast.error(msg);
    } finally {
      setSuspendLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Driver Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading…' : `${drivers.length} driver${drivers.length !== 1 ? 's' : ''} on roster`}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        )}
      </div>

      {/* Search + Filter Chips */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or license number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all capitalize
                ${statusFilter === s
                  ? `${CHIP_STYLES[s]} ring-2 ring-offset-1 ring-current`
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && <DriverTableSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-red-100">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <RefreshCw className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">Failed to load drivers</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold text-lg mb-1">
            {search || statusFilter !== 'all' ? 'No drivers match your filters' : 'No drivers on roster yet'}
          </p>
          <p className="text-sm text-slate-500 mb-5">
            {search || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Add a driver to get started.'}
          </p>
          {canEdit && !search && statusFilter === 'all' && (
            <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Driver
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <DriverTable
          drivers={filtered}
          canEdit={canEdit}
          canSuspend={canSuspend}
          onEdit={openEdit}
          onSuspend={openSuspend}
        />
      )}

      {/* Driver Form Drawer */}
      <DriverForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        driver={editingDriver}
        onSuccess={handleSuccess}
      />

      {/* Suspend Confirmation Modal */}
      {suspending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSuspending(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Suspend Driver</h3>
            <p className="text-sm text-slate-500 mb-5">
              Enter the reason for suspending <span className="font-semibold text-slate-700">{suspending.name}</span>.
              This will set their status to <span className="text-red-600 font-semibold">Suspended</span>.
            </p>
            <textarea
              value={suspendReason}
              onChange={e => setSuspendReason(e.target.value)}
              placeholder="Reason for suspension…"
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setSuspending(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSuspend} disabled={suspendLoading}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
                {suspendLoading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Suspending…</>
                  : 'Confirm Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
