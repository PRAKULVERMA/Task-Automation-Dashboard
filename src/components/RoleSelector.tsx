import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserRole, useRole } from "@/contexts/RoleContext";
import { Shield, Eye, Crown } from "lucide-react";

export const RoleSelector = () => {
  const { role, setRole } = useRole();

  const roleConfig = {
    Admin: {
      icon: Crown,
      color:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
      description: "Full access to all features",
    },
    Viewer: {
      icon: Eye,
      color:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-800",
      description: "Read-only access",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(roleConfig).map(([roleName, config]) => {
            const Icon = config.icon;
            return (
              <SelectItem key={roleName} value={roleName}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{roleName}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Badge className={roleConfig[role].color} variant="outline">
        {role}
      </Badge>
    </div>
  );
};
