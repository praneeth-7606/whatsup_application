import { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaUser, FaUsers, FaPlus, FaTag, FaCrown, FaFilter } from 'react-icons/fa';
import { User } from './chatlayout';
import { supabase } from './supabaseclient';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (
    name: string, 
    isGroup: boolean, 
    memberIds: string[], 
    memberRoles?: { [userId: string]: 'admin' | 'member' },
    labelIds?: string[]
  ) => Promise<void>;
  currentUser: User;
  useRealDatabase: boolean;
  availableLabels: Array<{id: string; name: string; color: string}>;
}

interface AvailableUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface SelectedUserWithRole extends AvailableUser {
  role: 'admin' | 'member';
}

const NewChatModal = ({ 
  isOpen, 
  onClose, 
  onCreateChat, 
  currentUser, 
  useRealDatabase,
  availableLabels = []
}: NewChatModalProps) => {
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUserWithRole[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLabelSelector, setShowLabelSelector] = useState(false);
  const [showRoleManager, setShowRoleManager] = useState(false);

  // Demo users - ensure no duplicates
  const demoUsers: AvailableUser[] = [
    { id: 'demo-user-1', full_name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'demo-user-2', full_name: 'Bob Smith', email: 'bob@example.com' },
    { id: 'demo-user-3', full_name: 'Carol Williams', email: 'carol@example.com' },
    { id: 'demo-user-4', full_name: 'David Brown', email: 'david@example.com' },
    { id: 'demo-user-5', full_name: 'Eva Davis', email: 'eva@example.com' },
    { id: 'demo-user-6', full_name: 'Frank Miller', email: 'frank@example.com' },
    { id: 'demo-user-7', full_name: 'Grace Wilson', email: 'grace@example.com' },
    { id: 'demo-user-8', full_name: 'Henry Moore', email: 'henry@example.com' }
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
      setChatType('direct');
      setGroupName('');
      setSearchQuery('');
      setSelectedUsers([]);
      setSelectedLabels([]);
      setError(null);
      setShowLabelSelector(false);
      setShowRoleManager(false);
    }
  }, [isOpen, useRealDatabase]);

  // FIXED: Enhanced user fetching with proper deduplication
  const fetchAvailableUsers = async () => {
    if (!useRealDatabase) {
      console.log('Using demo users');
      setAvailableUsers(demoUsers);
      return;
    }

    setIsLoadingUsers(true);
    try {
      console.log('Fetching users from database...');
      
      // FIXED: Simple query without DISTINCT ON syntax
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .neq('id', currentUser.id)
        .order('full_name');

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Using demo data instead.');
        setAvailableUsers(demoUsers);
        return;
      }

      console.log('Raw users from database:', data?.length || 0);

      if (!data || data.length === 0) {
        console.log('No users found in database, using demo users');
        setAvailableUsers(demoUsers);
        return;
      }

      // FIXED: Comprehensive client-side deduplication
      const uniqueUsersMap = new Map<string, AvailableUser>();
      
      data.forEach(user => {
        // Use email as primary key for deduplication (most reliable)
        const key = user.email.toLowerCase().trim();
        
        if (!uniqueUsersMap.has(key)) {
          uniqueUsersMap.set(key, {
            id: user.id,
            full_name: user.full_name || 'Unknown User',
            email: user.email,
            avatar_url: user.avatar_url
          });
        } else {
          console.log(`Duplicate user found and skipped: ${user.email}`);
        }
      });

      const uniqueUsers = Array.from(uniqueUsersMap.values());
      
      console.log('Unique users after deduplication:', uniqueUsers.length);
      console.log('Unique users:', uniqueUsers.map(u => ({ name: u.full_name, email: u.email })));
      
      setAvailableUsers(uniqueUsers);

    } catch (error) {
      console.error('Error in fetchAvailableUsers:', error);
      setError('Failed to load users. Using demo data instead.');
      setAvailableUsers(demoUsers);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Enhanced user filtering
  const filteredUsers = availableUsers.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Enhanced user selection with role management
  const toggleUserSelection = (user: AvailableUser) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      
      if (isSelected) {
        // Remove user
        return prev.filter(u => u.id !== user.id);
      } else {
        // Add user
        const userWithRole: SelectedUserWithRole = { 
          ...user, 
          role: 'member' // Default role
        };
        
        // For direct messages, only allow one user
        if (chatType === 'direct') {
          return [userWithRole];
        }
        
        // For groups, add to existing selection
        return [...prev, userWithRole];
      }
    });
  };

  // Update user role
  const updateUserRole = (userId: string, role: 'admin' | 'member') => {
    setSelectedUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role } : user
      )
    );
  };

  // Toggle label selection
  const toggleLabelSelection = (labelId: string) => {
    setSelectedLabels(prev => {
      if (prev.includes(labelId)) {
        return prev.filter(id => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  };

  // Enhanced form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to chat with.');
      return;
    }

    if (chatType === 'group' && !groupName.trim()) {
      setError('Please enter a group name.');
      return;
    }

    if (chatType === 'group' && selectedUsers.length < 1) {
      setError('Group chats require at least 1 other member.');
      return;
    }

    setIsLoading(true);
    try {
      const chatName = chatType === 'group' 
        ? groupName.trim()
        : `${currentUser.full_name} & ${selectedUsers[0].full_name}`;

      const memberIds = selectedUsers.map(user => user.id);
      const memberRoles = selectedUsers.reduce((acc, user) => {
        acc[user.id] = user.role;
        return acc;
      }, {} as { [userId: string]: 'admin' | 'member' });

      console.log('Creating chat with:', {
        chatName,
        isGroup: chatType === 'group',
        memberIds,
        memberRoles,
        selectedLabels
      });

      await onCreateChat(
        chatName, 
        chatType === 'group', 
        memberIds, 
        memberRoles,
        selectedLabels.length > 0 ? selectedLabels : []
      );
      
      onClose();
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get label color
  const getLabelColor = (labelId: string): string => {
    const label = availableLabels.find(l => l.id === labelId);
    const colorMap: { [key: string]: string } = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      yellow: '#f59e0b',
      orange: '#f97316',
      pink: '#ec4899',
      indigo: '#6366f1',
      gray: '#6b7280',
      teal: '#14b8a6',
      cyan: '#06b6d4'
    };
    return colorMap[label?.color || 'gray'] || colorMap.gray;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">New Chat</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isLoading}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Chat Type Selection */}
          <div className="p-4 border-b">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setChatType('direct');
                  setSelectedUsers([]);
                  setGroupName('');
                  setShowRoleManager(false);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  chatType === 'direct'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaUser className="w-4 h-4 mr-2" />
                Direct Message
              </button>
              <button
                type="button"
                onClick={() => {
                  setChatType('group');
                  setSelectedUsers([]);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  chatType === 'group'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaUsers className="w-4 h-4 mr-2" />
                Group Chat
              </button>
            </div>
          </div>

          {/* Group Name Input */}
          {chatType === 'group' && (
            <div className="p-4 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Labels Section */}
          {availableLabels.length > 0 && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Labels (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowLabelSelector(!showLabelSelector)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <FaTag className="w-4 h-4 inline mr-1" />
                  {showLabelSelector ? 'Hide' : 'Show'} Labels
                </button>
              </div>
              
              {showLabelSelector && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {availableLabels.map(label => (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabelSelection(label.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedLabels.includes(label.id)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: selectedLabels.includes(label.id) 
                            ? getLabelColor(label.id)
                            : undefined
                        }}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                  {selectedLabels.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {selectedLabels.length} label{selectedLabels.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Search */}
          <div className="p-4 border-b">
            <div className="flex space-x-2 mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <FaSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {chatType === 'group' && selectedUsers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRoleManager(!showRoleManager)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                >
                  <FaCrown className="w-4 h-4 inline mr-1" />
                  Roles
                </button>
              )}
            </div>
          </div>

          {/* Role Manager */}
          {chatType === 'group' && showRoleManager && selectedUsers.length > 0 && (
            <div className="p-4 border-b bg-gray-50">
              <div className="text-sm font-medium text-gray-700 mb-3">Manage Roles:</div>
              <div className="space-y-2">
                {selectedUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 mr-2">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{user.full_name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => updateUserRole(user.id, 'member')}
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === 'member'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Member
                      </button>
                      <button
                        type="button"
                        onClick={() => updateUserRole(user.id, 'admin')}
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="p-4 border-b">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Selected ({selectedUsers.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                  >
                    {chatType === 'group' && user.role === 'admin' && (
                      <FaCrown className="w-3 h-3 mr-1 text-yellow-600" />
                    )}
                    <span>{user.full_name}</span>
                    <button
                      type="button"
                      onClick={() => toggleUserSelection(user)}
                      className="ml-2 hover:bg-blue-200 rounded"
                      disabled={isLoading}
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">
              {chatType === 'direct' ? 'Select a user:' : 'Select users to add:'}
            </div>
            
            {isLoadingUsers ? (
              <div className="text-center py-4 text-gray-500">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchQuery ? 'No users found matching your search.' : 'No users available.'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map(user => {
                  const isSelected = selectedUsers.some(u => u.id === user.id);
                  const selectedUser = selectedUsers.find(u => u.id === user.id);
                  
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUserSelection(user)}
                      className={`w-full flex items-center p-3 rounded-md border text-left transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      disabled={isLoading}
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      {isSelected && (
                        <div className="flex items-center">
                          {chatType === 'group' && selectedUser?.role === 'admin' && (
                            <FaCrown className="w-4 h-4 text-yellow-600 mr-2" />
                          )}
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaPlus className="w-3 h-3 text-white rotate-45" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 border-t">
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedUsers.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : `Create ${chatType === 'group' ? 'Group' : 'Chat'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;