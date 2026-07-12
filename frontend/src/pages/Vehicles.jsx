import { useState, useMemo } from 'react';
import { Plus, RefreshCw, Search, Car } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useVehicles } from '../hooks/useVehicles';
import VehicleTable, { VehicleTableSkeleton } from '../components/vehicles/VehicleTable';
import VehicleForm from '../components/vehicles/VehicleForm';

const STATUS_FILTERS = ['all', 'available', 'on_trip', 'in_shop', 'retired'];

const CHIP_STYLES = {
  all:       'bg-slate-100 text-slate-700 border-slate-200',
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  on_trip:   'bg-blue-100 text-blue-700 border-blue-200',
  in_shop:   'bg-orange-100 text-orange-700 border-orange-200',
  retired:   'bg-slate-100 text-slate-500 border-slate-200',
};

export default function VehiclesPage() {
  const { role } = useAuth();
  const canEdit = role === ROLES.MANAGER;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const { vehicles, loading, error, refetch } = useVehicles();

  // Client-side filter (works even while backend is mocked)
  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch =
        !search ||
        v.reg_number?.toLowerCase().includes(search.toLowerCase()) ||
        v.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vehicles, search, statusFilter]);

  const openCreate = () => { setEditingVehicle(null); setFormOpen(true); };
  const openEdit   = (v) => { setEditingVehicle(v);   setFormOpen(true); };

  const handleSuccess = (message) => {
    toast.success(message);
    refetch();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-fraunces font-bold text-text-primary tracking-tight">Vehicle <em style={{ fontStyle: 'italic', fontWeight: 600 }}>Registry</em></h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading…' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        )}
      </div>

      {/* Search + Status filter chips */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or reg number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
          />
        </div>

        {/* Status chips */}
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

      {/* Content states */}
      {loading && <VehicleTableSkeleton />}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-red-100">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <RefreshCw className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">Failed to load vehicles</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold text-lg mb-1">
            {search || statusFilter !== 'all'
              ? 'No vehicles match your filters'
              : 'No vehicles yet — register your first one'}
          </p>
          <p className="text-sm text-slate-500 mb-5">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Add a vehicle to start managing your fleet.'}
          </p>
          {canEdit && !search && statusFilter === 'all' && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Register Vehicle
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <VehicleTable
          vehicles={filtered}
          canEdit={canEdit}
          onEdit={openEdit}
        />
      )}

      {/* Drawer form */}
      <VehicleForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        vehicle={editingVehicle}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
