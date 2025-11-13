import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  phone: string | null;
  department: string | null;
}

// Map database role names to display names
const roleDisplayMap: Record<string, string> = {
  'top_management': 'Top Management',
  'project_owner': 'Project Owner',
  'project_manager': 'Project Manager',
  'project_officer': 'Project Officer',
  'system_admin': 'System Admin',
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<{ userId: string; currentRole: string } | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, phone, department');

      if (profilesError) throw profilesError;

      // Fetch roles for all users
      const userIds = profilesData?.map(p => p.user_id) || [];
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = profilesData?.map(profile => {
        const userRole = rolesData?.find(r => r.user_id === profile.user_id);
        return {
          ...profile,
          role: userRole?.role || 'No Role',
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.role) {
        toast.error('Please fill in all required fields');
        return;
      }

      setLoading(true);

      // Call edge function to create user
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: newUser.email,
          full_name: newUser.name,
          role: newUser.role,
          phone: newUser.phone || null,
          department: newUser.department || null,
        },
      });

      if (error) throw error;

      toast.success('User created successfully! Login credentials have been sent to their email.');
      setIsDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        role: '',
        phone: '',
        department: '',
      });

      // Refresh users list
      await fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);

      // Delete user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userToDelete.user_id);

      if (roleError) throw roleError;

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userToDelete.user_id);

      if (profileError) throw profileError;

      toast.success('User deleted successfully');
      setUserToDelete(null);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole as any })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Role updated successfully');
      setEditingRole(null);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and their roles
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign their role. Login credentials will be sent to their email.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@gra.gov.gh"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Top Management">Top Management</SelectItem>
                    <SelectItem value="Project Owner">Project Owner</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Project Officer">Project Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+233 24 123 4567"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="IT, Finance, etc."
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={loading}>
                {loading ? 'Creating...' : 'Add User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={(value: string) => setRoleFilter(value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="top_management">Top Management</SelectItem>
              <SelectItem value="project_owner">Project Owner</SelectItem>
              <SelectItem value="project_manager">Project Manager</SelectItem>
              <SelectItem value="project_officer">Project Officer</SelectItem>
              <SelectItem value="system_admin">System Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editingRole?.userId === user.user_id ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={editingRole.currentRole}
                          onValueChange={(value) => {
                            handleRoleChange(user.user_id, value);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top_management">Top Management</SelectItem>
                            <SelectItem value="project_owner">Project Owner</SelectItem>
                            <SelectItem value="project_manager">Project Manager</SelectItem>
                            <SelectItem value="project_officer">Project Officer</SelectItem>
                            <SelectItem value="system_admin">System Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRole(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{roleDisplayMap[user.role] || user.role}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRole({ userId: user.user_id, currentRole: user.role })}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.full_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
