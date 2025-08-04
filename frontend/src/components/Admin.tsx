import { useState, useMemo, useEffect } from "react";
import { Trash2, Unlock, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { getUsers, blockUser, unblockUser, deleteUser } from "../services/userService";

interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: "ACTIVE" | "BLOCKED";
}

interface AdminProps {
  currentUser: { id: string; name: string; email: string };
  onLogout: () => void;
}

export const Admin = ({ currentUser, onLogout }: AdminProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const allSelected = selectedUsers.size === users.length && users.length > 0;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersData = await getUsers();
      setUsers(usersData);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleBlock = async () => {
    if (selectedUsers.size === 0) return;
    
    try {
      const userId = selectedUsers.values().next().value;
      if (!userId) return;
      await blockUser(userId);
      setUsers(users.map(user => 
        selectedUsers.has(user.id) ? { ...user, status: "BLOCKED" as const } : user
      ));
      setSelectedUsers(new Set());
      console.log(`${selectedUsers.size} user(s) have been blocked.`);
    } catch (error) {
      console.error("Error blocking users:", error);
    }
  };

  const handleUnblock = async () => {
    if (selectedUsers.size === 0) return;
    
    try {
      const userId = selectedUsers.values().next().value;
      if (!userId) return;
      await unblockUser(userId);
      setUsers(users.map(user => 
        selectedUsers.has(user.id) ? { ...user, status: "ACTIVE" as const } : user
      ));
      setSelectedUsers(new Set());
      console.log(`${selectedUsers.size} user(s) have been unblocked.`);
    } catch (error) {
      console.error("Error unblocking users:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedUsers.size === 0) return;
    
    try {
      const userId = selectedUsers.values().next().value;
      if (!userId) return;
      await deleteUser(userId);
      setUsers(users.filter(user => !selectedUsers.has(user.id)));
      setSelectedUsers(new Set());
      console.log(`${selectedUsers.size} user(s) have been deleted.`);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const selectedCount = selectedUsers.size;
  const hasBlockedUsers = useMemo(() => 
    Array.from(selectedUsers).some(id => 
      users.find(user => user.id === id)?.status === "BLOCKED"
    ), [selectedUsers, users]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground">Manage users and their access</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {currentUser.name}
              </span>
              <Button 
                onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center gap-2 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-muted-foreground">
              {selectedCount > 0 ? `${selectedCount} selected` : "No users selected"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleBlock}
              disabled={selectedCount === 0}
              loading={loading}
            >
              <Lock className="w-4 h-4 mr-2" />
              Block
            </Button>
            
            <Button
              onClick={handleUnblock}
              disabled={selectedCount === 0 || !hasBlockedUsers}
              loading={loading}
            >
              <Unlock className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={selectedCount === 0}
              loading={loading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all users"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-sm">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        user.status === "ACTIVE" 
                        ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" 
                        : "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80" }`}>
                      {user.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users found.</p>
          </div>
        )}
      </main>
    </div>
  );
};