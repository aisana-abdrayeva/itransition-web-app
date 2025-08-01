import { useState, useMemo } from "react";
import { Trash2, Unlock, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";

interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: "active" | "blocked";
  registrationTime: string;
}

interface AdminProps {
  currentUser: { id: string; name: string; email: string };
  onLogout: () => void;
}

// Mock data - you'll replace this with your backend data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    lastLogin: "2024-01-15 14:30:25",
    status: "active",
    registrationTime: "2024-01-01 09:00:00"
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    lastLogin: "2024-01-14 16:45:12",
    status: "blocked",
    registrationTime: "2024-01-02 10:15:00"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com", 
    lastLogin: "2024-01-13 11:20:05",
    status: "active",
    registrationTime: "2024-01-03 14:30:00"
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    lastLogin: "2024-01-12 09:15:30",
    status: "active",
    registrationTime: "2024-01-04 16:45:00"
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    lastLogin: "2024-01-11 13:25:15",
    status: "blocked",
    registrationTime: "2024-01-05 11:20:00"
  }
];

export const Admin = ({ currentUser, onLogout }: AdminProps) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const allSelected = selectedUsers.size === users.length && users.length > 0;
  const someSelected = selectedUsers.size > 0;

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

  const handleBlock = () => {
    if (selectedUsers.size === 0) return;
    
    setUsers(users.map(user => 
      selectedUsers.has(user.id) ? { ...user, status: "blocked" as const } : user
    ));
    setSelectedUsers(new Set());
    console.log(`${selectedUsers.size} user(s) have been blocked.`);
  };

  const handleUnblock = () => {
    if (selectedUsers.size === 0) return;
    
    setUsers(users.map(user => 
      selectedUsers.has(user.id) ? { ...user, status: "active" as const } : user
    ));
    setSelectedUsers(new Set());
    console.log(`${selectedUsers.size} user(s) have been unblocked.`);
  };

  const handleDelete = () => {
    if (selectedUsers.size === 0) return;
    
    setUsers(users.filter(user => !selectedUsers.has(user.id)));
    setSelectedUsers(new Set());
    console.log(`${selectedUsers.size} user(s) have been deleted.`);
  };

  const selectedCount = selectedUsers.size;
  const hasBlockedUsers = useMemo(() => 
    Array.from(selectedUsers).some(id => 
      users.find(user => user.id === id)?.status === "blocked"
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
            >
              <Lock className="w-4 h-4 mr-2" />
              Block
            </Button>
            
            <Button
              onClick={handleUnblock}
              disabled={selectedCount === 0 || !hasBlockedUsers}
            >
              <Unlock className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={selectedCount === 0}
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
                <TableHead className="hidden sm:table-cell">Registration</TableHead>
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
                        user.status === "active" 
                        ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" 
                        : "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80" }`}>
                      {user.status}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {user.registrationTime}
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