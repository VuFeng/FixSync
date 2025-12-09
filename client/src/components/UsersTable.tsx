import { Edit2, Trash2 } from "lucide-react";
import { Card } from "./ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { useUsers } from "../hooks/useUsers";
import { formatDate } from "../utils/format";
import type { Role } from "../types";
import { useToast } from "./ui/Toaster";
import { ConfirmDialog } from "./ui/Dialog";
import { SkeletonTable } from "./ui/Skeleton";
import { useState } from "react";

const roleColors: Record<Role, string> = {
  ADMIN: "bg-purple-500/20 text-purple-300",
  TECHNICIAN: "bg-blue-500/20 text-blue-300",
  RECEPTIONIST: "bg-emerald-500/20 text-emerald-300",
};

export function UsersTable() {
  const toast = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { data, isLoading, error } = useUsers(0, 100);
  const users = data?.content || [];

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      // TODO: Implement delete user API call
      toast.info("Delete user functionality coming soon");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-surface border-border overflow-hidden">
        <div className="p-8">
          <SkeletonTable rows={5} cols={6} />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border overflow-hidden">
        <div className="p-8 text-center text-danger">
          Error loading users. Please try again.
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-text-secondary">Name</TableHead>
            <TableHead className="text-text-secondary">Email</TableHead>
            <TableHead className="text-text-secondary">Role</TableHead>
            <TableHead className="text-text-secondary">Status</TableHead>
            <TableHead className="text-text-secondary">Join Date</TableHead>
            <TableHead className="text-text-secondary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-text-secondary">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="border-border hover:bg-surface-secondary/50"
              >
                <TableCell className="text-text-primary font-medium">
                  {user.fullName}
                </TableCell>
                <TableCell className="text-text-secondary">{user.email}</TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role]}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-text-tertiary hover:text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-text-tertiary hover:text-danger"
                      onClick={() => setDeleteConfirmId(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
}



