import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { PERMISSIONS } from '../constants/permissions';
import { ROLES } from '../constants/roles';

// Public pages
import RoleSelection from '../pages/RoleSelection';
import Login from '../pages/Login';

// Core pages (fully built)
import Dashboard from '../pages/Dashboard';
import Vehicles from '../pages/Vehicles';
import Drivers from '../pages/Drivers';
import Trips from '../pages/Trips';
import Maintenance from '../pages/Maintenance';
import Finance from '../pages/Finance';
import Reports from '../pages/Reports';

// Safety-specific pages
import Inspections from '../pages/Inspections';
import SafetyReports from '../pages/SafetyReports';
import InspectionHistory from '../pages/InspectionHistory';

// Driver-specific pages
import MyTrips from '../pages/MyTrips';

// Shared stub pages (coming soon placeholders)
import { VehicleInfo, TripHistory, Profile, Expenses, Analytics, SettingsPage } from '../pages/Stubs';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/:roleId" element={<Login />} />

      {/* All protected routes share the Layout (Sidebar + Header) */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* ── Shared (all roles) ── */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={PERMISSIONS.DASHBOARD}><Dashboard /></ProtectedRoute>} />

        {/* ── Fleet Manager ── */}
        <Route path="/vehicles" element={<ProtectedRoute allowedRoles={PERMISSIONS.VEHICLES}><Vehicles /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute allowedRoles={PERMISSIONS.TRIPS}><Trips /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute allowedRoles={PERMISSIONS.MAINTENANCE}><Maintenance /></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute allowedRoles={PERMISSIONS.FINANCE}><Finance /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={PERMISSIONS.REPORTS}><Reports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]}><SettingsPage /></ProtectedRoute>} />

        {/* ── Manager + Safety Officer (Drivers page) ── */}
        <Route path="/drivers" element={<ProtectedRoute allowedRoles={PERMISSIONS.DRIVERS}><Drivers /></ProtectedRoute>} />

        {/* ── Safety Officer specific ── */}
        <Route path="/inspections" element={<ProtectedRoute allowedRoles={[ROLES.SAFETY, ROLES.MANAGER]}><Inspections /></ProtectedRoute>} />
        <Route path="/safety-reports" element={<ProtectedRoute allowedRoles={[ROLES.SAFETY, ROLES.MANAGER]}><SafetyReports /></ProtectedRoute>} />
        <Route path="/inspection-history" element={<ProtectedRoute allowedRoles={[ROLES.SAFETY, ROLES.MANAGER]}><InspectionHistory /></ProtectedRoute>} />

        {/* ── Driver specific ── */}
        <Route path="/my-trips" element={<ProtectedRoute allowedRoles={[ROLES.DRIVER]}><MyTrips /></ProtectedRoute>} />
        <Route path="/vehicle-info" element={<ProtectedRoute allowedRoles={[ROLES.DRIVER]}><VehicleInfo /></ProtectedRoute>} />
        <Route path="/trip-history" element={<ProtectedRoute allowedRoles={[ROLES.DRIVER]}><TripHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={[ROLES.DRIVER, ROLES.MANAGER]}><Profile /></ProtectedRoute>} />

        {/* ── Analyst specific ── */}
        <Route path="/expenses" element={<ProtectedRoute allowedRoles={[ROLES.ANALYST, ROLES.MANAGER]}><Expenses /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={[ROLES.ANALYST]}><Analytics /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
