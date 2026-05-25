import { getCurrentUser } from '../services/authService';
import { Navigate } from 'react-router-dom';

// Role constants
export const ROLES = {
  ADMIN: 'ADMIN',
  PHARMACIST: 'PHARMACIST',
  CASHIER: 'CASHIER'
};

// Permission mappings
export const PERMISSIONS = {
  // Admin has all permissions
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManageMedicines: true,
    canManageSuppliers: true,
    canManageCustomers: true,
    canViewReports: true,
    canProcessSales: true,
    canManageInventory: true,
    canManagePurchases: true,
    canDeleteData: true,
    canAccessAdminPanel: true
  },

  // Pharmacist permissions
  [ROLES.PHARMACIST]: {
    canManageUsers: false,
    canManageMedicines: true,      // Can add/edit medicines
    canManageSuppliers: true,      // Can view suppliers
    canManageCustomers: true,      // Can view customers
    canViewReports: true,          // Can view reports
    canProcessSales: true,         // Can process sales
    canManageInventory: true,      // Can manage inventory
    canManagePurchases: true,      // Can create purchase orders
    canDeleteData: false,          // Cannot delete anything
    canAccessAdminPanel: false
  },

  // Cashier permissions
  [ROLES.CASHIER]: {
    canManageUsers: false,
    canManageMedicines: false,     // Can only view medicines
    canManageSuppliers: false,
    canManageCustomers: true,      // Can add customers
    canViewReports: false,
    canProcessSales: true,         // Can process sales
    canManageInventory: false,
    canManagePurchases: false,
    canDeleteData: false,
    canAccessAdminPanel: false
  }
};

// Hook to check permissions
export const usePermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;

  const userRole = user.role;
  const rolePermissions = PERMISSIONS[userRole] || PERMISSIONS[ROLES.CASHIER];

  return rolePermissions[permission] || false;
};

// Component to conditionally render based on role
export const HasPermission = ({ permission, children, fallback = null }) => {
  const hasPermission = usePermission(permission);
  return hasPermission ? children : fallback;
};

// Component to render based on specific role
export const HasRole = ({ role, children, fallback = null }) => {
  const user = getCurrentUser();
  return user?.role === role ? children : fallback;
};

// Protected route component for role-based routing
export const RoleBasedRoute = ({ children, allowedRoles, fallbackPath = '/dashboard' }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};