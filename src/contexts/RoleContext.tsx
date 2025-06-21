import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "Admin" | "Viewer";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canRun: boolean;
    canCreate: boolean;
    canViewLogs: boolean;
  };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRole] = useState<UserRole>("Admin");

  const permissions = {
    canEdit: role === "Admin",
    canDelete: role === "Admin",
    canRun: role === "Admin",
    canCreate: role === "Admin",
    canViewLogs: true, // Both roles can view logs
  };

  return (
    <RoleContext.Provider value={{ role, setRole, permissions }}>
      {children}
    </RoleContext.Provider>
  );
};
