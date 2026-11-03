import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Organization, UserRole, Permission, CustomRole } from '../types';
import { mockStorage } from '../mocks/storage';

interface AuthContextType {
  currentUser: User;
  currentOrganization: Organization | null;
  currentRole: UserRole;
  isPlatformAdmin: boolean;
  isAuthenticated: boolean;
  availableOrganizations: Organization[];
  allUsers: User[];
  customRoles: CustomRole[];
  hasPermission: (permission: Permission) => boolean;
  switchOrganization: (orgId: string) => void;
  switchUser: (userId: string) => void;
  login: (email: string, pass?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (name: string, email: string, orgName: string, pass?: string) => Promise<void>;
  resetPassword: (email: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  createCustomRole: (name: string, description: string, permissions: Permission[]) => Promise<CustomRole>;
  resetDemoData: () => void;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  PLATFORM_OWNER: [
    'dashboard.read',
    'documents.read',
    'documents.create',
    'documents.update',
    'documents.delete',
    'documents.download',
    'documents.share',
    'documents.validate',
    'audio.read',
    'audio.create',
    'audio.transcribe',
    'audio.delete',
    'video.read',
    'video.create',
    'video.generate',
    'generations.read',
    'generations.create',
    'generations.update',
    'generations.delete',
    'generations.export',
    'presentations.read',
    'presentations.create',
    'presentations.update',
    'presentations.export',
    'workflows.read',
    'workflows.create',
    'workflows.update',
    'workflows.delete',
    'workflows.execute',
    'projects.read',
    'projects.create',
    'projects.update',
    'projects.delete',
    'members.read',
    'members.invite',
    'members.update',
    'members.remove',
    'roles.read',
    'roles.create',
    'roles.update',
    'roles.delete',
    'billing.read',
    'billing.manage',
    'subscriptions.read',
    'subscriptions.manage',
    'organization.read',
    'organization.update',
    'usage.read',
    'audit.read'
  ],
  SUPER_ADMIN: [
    'dashboard.read',
    'documents.read',
    'documents.download',
    'audio.read',
    'video.read',
    'generations.read',
    'presentations.read',
    'workflows.read',
    'projects.read',
    'members.read',
    'roles.read',
    'billing.read',
    'subscriptions.read',
    'organization.read',
    'usage.read',
    'audit.read'
  ],
  PLATFORM_SUPPORT: [
    'dashboard.read',
    'usage.read',
    'audit.read'
  ],
  ORG_OWNER: [
    'dashboard.read',
    'documents.read',
    'documents.create',
    'documents.update',
    'documents.delete',
    'documents.download',
    'documents.share',
    'documents.validate',
    'audio.read',
    'audio.create',
    'audio.transcribe',
    'audio.delete',
    'video.read',
    'video.create',
    'video.generate',
    'generations.read',
    'generations.create',
    'generations.update',
    'generations.delete',
    'generations.export',
    'presentations.read',
    'presentations.create',
    'presentations.update',
    'presentations.export',
    'workflows.read',
    'workflows.create',
    'workflows.update',
    'workflows.delete',
    'workflows.execute',
    'projects.read',
    'projects.create',
    'projects.update',
    'projects.delete',
    'members.read',
    'members.invite',
    'members.update',
    'members.remove',
    'roles.read',
    'roles.create',
    'roles.update',
    'roles.delete',
    'billing.read',
    'billing.manage',
    'subscriptions.read',
    'subscriptions.manage',
    'organization.read',
    'organization.update',
    'usage.read',
    'audit.read'
  ],
  ORG_ADMIN: [
    'dashboard.read',
    'documents.read',
    'documents.create',
    'documents.update',
    'documents.delete',
    'documents.download',
    'documents.share',
    'documents.validate',
    'audio.read',
    'audio.create',
    'audio.transcribe',
    'audio.delete',
    'video.read',
    'video.create',
    'video.generate',
    'generations.read',
    'generations.create',
    'generations.update',
    'generations.delete',
    'generations.export',
    'presentations.read',
    'presentations.create',
    'presentations.update',
    'presentations.export',
    'workflows.read',
    'workflows.create',
    'workflows.update',
    'workflows.delete',
    'workflows.execute',
    'projects.read',
    'projects.create',
    'projects.update',
    'projects.delete',
    'members.read',
    'members.invite',
    'members.update',
    'members.remove',
    'roles.read',
    'billing.read',
    'organization.read',
    'organization.update',
    'usage.read',
    'audit.read'
  ],
  MANAGER: [
    'dashboard.read',
    'documents.read',
    'documents.create',
    'documents.update',
    'documents.download',
    'documents.share',
    'documents.validate',
    'audio.read',
    'audio.create',
    'audio.transcribe',
    'video.read',
    'video.create',
    'video.generate',
    'generations.read',
    'generations.create',
    'generations.update',
    'generations.export',
    'presentations.read',
    'presentations.create',
    'presentations.update',
    'presentations.export',
    'workflows.read',
    'workflows.execute',
    'projects.read',
    'projects.create',
    'projects.update',
    'members.read',
    'usage.read'
  ],
  EDITOR: [
    'dashboard.read',
    'documents.read',
    'documents.create',
    'documents.update',
    'documents.download',
    'audio.read',
    'audio.create',
    'audio.transcribe',
    'video.read',
    'video.create',
    'generations.read',
    'generations.create',
    'generations.update',
    'generations.export',
    'presentations.read',
    'presentations.create',
    'presentations.update',
    'presentations.export',
    'workflows.read',
    'projects.read',
    'usage.read'
  ],
  VIEWER: [
    'dashboard.read',
    'documents.read',
    'documents.download',
    'audio.read',
    'video.read',
    'generations.read',
    'presentations.read',
    'workflows.read',
    'projects.read'
  ],
  BILLING_MANAGER: [
    'dashboard.read',
    'billing.read',
    'billing.manage',
    'subscriptions.read',
    'subscriptions.manage',
    'usage.read'
  ],
  CUSTOM: [
    'dashboard.read',
    'documents.read',
    'documents.create'
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => mockStorage.getUsers());
  const [organizations, setOrganizations] = useState<Organization[]>(() => mockStorage.getOrganizations());
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => mockStorage.getCustomRoles());

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('documind_auth_session') !== 'false';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('documind_user_id') || 'user-sarah';
  });

  const [currentOrgId, setCurrentOrgId] = useState<string>(() => {
    return localStorage.getItem('documind_org_id') || 'org-acme';
  });

  useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      setUsers(mockStorage.getUsers());
      setOrganizations(mockStorage.getOrganizations());
      setCustomRoles(mockStorage.getCustomRoles());
    });
    return unsub;
  }, []);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const currentOrganization = useMemo(() => {
    if (currentUser.isPlatformAdmin) {
      return organizations.find((o) => o.id === currentOrgId) || organizations[0] || null;
    }
    const mem = currentUser.organizationMemberships.find((m) => m.organizationId === currentOrgId);
    if (mem) {
      return organizations.find((o) => o.id === mem.organizationId) || null;
    }
    if (currentUser.organizationMemberships.length > 0) {
      const firstOrgId = currentUser.organizationMemberships[0].organizationId;
      return organizations.find((o) => o.id === firstOrgId) || null;
    }
    return null;
  }, [currentUser, currentOrgId, organizations]);

  const currentRole: UserRole = useMemo(() => {
    if (currentUser.isPlatformAdmin) {
      return currentUser.platformRole || 'SUPER_ADMIN';
    }
    if (!currentOrganization) return 'VIEWER';
    const membership = currentUser.organizationMemberships.find((m) => m.organizationId === currentOrganization.id);
    return membership ? membership.role : 'VIEWER';
  }, [currentUser, currentOrganization]);

  // Fix SEC-03, RBAC-01, RBAC-02: Support custom roles and check dynamic permissions
  const hasPermission = (permission: Permission): boolean => {
    if (currentUser.isPlatformAdmin) return true;
    if (!currentOrganization) return false;

    const membership = currentUser.organizationMemberships.find((m) => m.organizationId === currentOrganization.id);
    if (!membership) return false;

    // Check if user is assigned a specific custom role
    if (membership.customRoleId) {
      const crole = customRoles.find((r) => r.id === membership.customRoleId && r.organizationId === currentOrganization.id);
      if (crole) {
        return crole.permissions.includes(permission);
      }
    }

    if (membership.role === 'CUSTOM') {
      const orgCroles = customRoles.filter((r) => r.organizationId === currentOrganization.id);
      if (orgCroles.length > 0) {
        return orgCroles[0].permissions.includes(permission);
      }
    }

    const allowed = ROLE_PERMISSIONS[currentRole] || [];
    return allowed.includes(permission);
  };

  const switchOrganization = (orgId: string) => {
    setCurrentOrgId(orgId);
    localStorage.setItem('documind_org_id', orgId);
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('documind_user_id', userId);
    setIsAuthenticated(true);
    localStorage.setItem('documind_auth_session', 'true');
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser && !targetUser.isPlatformAdmin && targetUser.organizationMemberships.length > 0) {
      switchOrganization(targetUser.organizationMemberships[0].organizationId);
    }
  };

  // Fix SEC-01: True password checking
  const login = async (email: string, pass?: string): Promise<{ success: boolean; error?: string }> => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'Aucun compte associé à cette adresse email.' };
    }
    if (pass !== undefined) {
      const expectedPass = found.password || 'Demo@DocuMind2026!';
      if (pass !== expectedPass) {
        return { success: false, error: "Mot de passe invalide. (Mot de passe de démonstration : 'Demo@DocuMind2026!')" };
      }
    }
    switchUser(found.id);
    setIsAuthenticated(true);
    localStorage.setItem('documind_auth_session', 'true');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('documind_auth_session', 'false');
  };

  const resetPassword = async (email: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    const currentUsers = mockStorage.getUsers();
    const found = currentUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'Adresse email non trouvée dans le système.' };
    }
    found.password = newPass;
    mockStorage.saveUsers(currentUsers);
    return { success: true };
  };

  const createCustomRole = async (name: string, description: string, permissions: Permission[]): Promise<CustomRole> => {
    const currentList = mockStorage.getCustomRoles();
    const newRole: CustomRole = {
      id: 'crole-' + Date.now().toString(36),
      organizationId: currentOrganization?.id || 'org-acme',
      name,
      description,
      permissions,
      createdAt: new Date().toISOString()
    };
    mockStorage.saveCustomRoles([...currentList, newRole]);
    return newRole;
  };

  const register = async (name: string, email: string, orgName: string, pass?: string) => {
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || 'Utilisateur';
    const newOrgId = 'org-' + Date.now().toString(36);
    const newUserId = 'user-' + Date.now().toString(36);

    const newOrg: Organization = {
      id: newOrgId,
      name: orgName,
      slug: orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      country: 'France',
      currency: 'EUR',
      timezone: 'Europe/Paris',
      ownerId: newUserId,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const newUser: User = {
      id: newUserId,
      email,
      password: pass || 'Demo@DocuMind2026!',
      firstName,
      lastName,
      isPlatformAdmin: false,
      organizationMemberships: [{ organizationId: newOrgId, role: 'ORG_OWNER', joinedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };

    const currentOrgs = mockStorage.getOrganizations();
    const currentUsers = mockStorage.getUsers();

    mockStorage.saveOrganizations([newOrg, ...currentOrgs]);
    mockStorage.saveUsers([newUser, ...currentUsers]);

    // Initialize free subscription
    const subs = mockStorage.getSubscriptions();
    subs[newOrgId] = {
      id: 'sub-' + newOrgId,
      organizationId: newOrgId,
      planId: 'free',
      status: 'trialing',
      billingInterval: 'monthly',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 14 * 86400000).toISOString(),
      cancelAtPeriodEnd: false
    };
    mockStorage.saveSubscriptions(subs);

    setCurrentUserId(newUserId);
    setCurrentOrgId(newOrgId);
    setIsAuthenticated(true);
    localStorage.setItem('documind_auth_session', 'true');
  };

  const resetDemoData = () => {
    mockStorage.resetAll();
    setCurrentUserId('user-sarah');
    setCurrentOrgId('org-acme');
    setIsAuthenticated(true);
    localStorage.setItem('documind_auth_session', 'true');
  };

  const availableOrganizations = useMemo(() => {
    if (currentUser.isPlatformAdmin) return organizations;
    return organizations.filter((o) =>
      currentUser.organizationMemberships.some((m) => m.organizationId === o.id)
    );
  }, [currentUser, organizations]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentOrganization,
        currentRole,
        isPlatformAdmin: !!currentUser.isPlatformAdmin,
        isAuthenticated,
        availableOrganizations,
        allUsers: users,
        customRoles,
        hasPermission,
        switchOrganization,
        switchUser,
        login,
        logout,
        register,
        resetPassword,
        createCustomRole,
        resetDemoData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
