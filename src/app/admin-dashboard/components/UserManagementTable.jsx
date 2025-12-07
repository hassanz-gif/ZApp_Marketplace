'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function UserManagementTable({ users, onUserAction }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesRole = filterRole === 'all' || user?.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user?.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700'
    };
    return styles?.[status] || styles?.active;
  };

  const getRoleBadge = (role) => {
    const styles = {
      buyer: 'bg-blue-100 text-blue-700',
      seller: 'bg-purple-100 text-purple-700',
      admin: 'bg-gray-100 text-gray-700'
    };
    return styles?.[role] || styles?.buyer;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            placeholder="Search users by name or email..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
          <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e?.target?.value)}
          className="h-10 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        >
          <option value="all">All Roles</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e?.target?.value)}
          className="h-10 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-muted/50 transition-smooth">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <AppImage
                          src={user?.avatar}
                          alt={user?.avatarAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user?.role)}`}>
                      {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user?.status)}`}>
                      {user?.status?.charAt(0)?.toUpperCase() + user?.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user?.joinedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUserAction('view', user?.id)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-md transition-smooth"
                        aria-label="View user details"
                      >
                        <Icon name="EyeIcon" size={18} />
                      </button>
                      <button
                        onClick={() => onUserAction('edit', user?.id)}
                        className="p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
                        aria-label="Edit user"
                      >
                        <Icon name="PencilIcon" size={18} />
                      </button>
                      <button
                        onClick={() => onUserAction(user?.status === 'suspended' ? 'activate' : 'suspend', user?.id)}
                        className={`p-2 rounded-md transition-smooth ${
                          user?.status === 'suspended' ?'text-success hover:bg-success/10' :'text-error hover:bg-error/10'
                        }`}
                        aria-label={user?.status === 'suspended' ? 'Activate user' : 'Suspend user'}
                      >
                        <Icon name={user?.status === 'suspended' ? 'CheckCircleIcon' : 'XCircleIcon'} size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredUsers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="UserGroupIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

UserManagementTable.propTypes = {
  users: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      email: PropTypes?.string?.isRequired,
      avatar: PropTypes?.string?.isRequired,
      avatarAlt: PropTypes?.string?.isRequired,
      role: PropTypes?.oneOf(['buyer', 'seller', 'admin'])?.isRequired,
      status: PropTypes?.oneOf(['active', 'suspended', 'pending'])?.isRequired,
      joinedDate: PropTypes?.string?.isRequired
    })
  )?.isRequired,
  onUserAction: PropTypes?.func?.isRequired
};