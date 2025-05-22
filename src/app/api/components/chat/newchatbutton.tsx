'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaPlus, FaSpinner, FaUser, FaUsers, FaTimes, FaSearch } from 'react-icons/fa';

// Initialize Supabase client - use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface NewChatButtonProps {
  currentUserId: string;
  onChatCreated?: () => void;
}

export default function NewChatButton({ currentUserId, onChatCreated }: NewChatButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [chatName, setChatName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Effect to search users when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim() || !currentUserId) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setIsSearching(true);
      try {
        console.log('Searching for users with term:', searchTerm, 'Current user ID:', currentUserId);
        
        // Make sure we don't search for the current user
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .neq('id', currentUserId) // Exclude current user
          .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
          .limit(5);

        if (error) {
          console.error('Error searching users:', error);
          throw error;
        }
        
        console.log('Search results (without current user):', data);
        setSearchResults(data || []);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Failed to search users');
      } finally {
        setIsSearching(false);
      }
    };

    // Add debounce to avoid too many requests
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        searchUsers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentUserId]);

  const selectUser = (user: any) => {
    if (!selectedUsers.some(selected => selected.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const createChat = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    if (isGroup && !chatName.trim()) {
      setError('Please enter a name for the group chat');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Creating chat with:', { 
        currentUserId, 
        selectedUsers: selectedUsers.map(u => ({ id: u.id, name: u.full_name })),
        isGroup
      });
      
      // Check if direct chat already exists between these users
      if (!isGroup && selectedUsers.length === 1) {
        // Get current user's chats
        const { data: currentUserChats, error: currentUserChatsError } = await supabase
          .from('chat_members')
          .select('chat_id')
          .eq('user_id', currentUserId);
          
        if (currentUserChatsError) {
          console.error('Error fetching current user chats:', currentUserChatsError);
          throw currentUserChatsError;
        }
        
        if (currentUserChats && currentUserChats.length > 0) {
          const chatIds = currentUserChats.map(item => item.chat_id);
          
          // Find chats where the selected user is also a member
          const { data: otherUserChats, error: otherUserChatsError } = await supabase
            .from('chat_members')
            .select('chat_id')
            .eq('user_id', selectedUsers[0].id)
            .in('chat_id', chatIds);
            
          if (otherUserChatsError) {
            console.error('Error finding shared chats:', otherUserChatsError);
            throw otherUserChatsError;
          }
            
          if (otherUserChats && otherUserChats.length > 0) {
            const sharedChatIds = otherUserChats.map(item => item.chat_id);
            
            // Check if any of these are direct chats (not groups)
            const { data: directChats, error: directChatsError } = await supabase
              .from('chats')
              .select('id')
              .in('id', sharedChatIds)
              .eq('is_group', false)
              .limit(1);
              
            if (directChatsError) {
              console.error('Error finding direct chats:', directChatsError);
              throw directChatsError;
            }
              
            if (directChats && directChats.length > 0) {
              console.log('Direct chat already exists:', directChats[0].id);
              // Direct chat already exists, just close the modal
              setIsModalOpen(false);
              setSelectedUsers([]);
              setChatName('');
              setIsGroup(false);
              
              // Notify parent to refresh chats
              if (onChatCreated) {
                onChatCreated();
              }
              return;
            }
          }
        }
      }

      // Get current user details for chat name
      const { data: currentUserDetails, error: currentUserError } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', currentUserId)
        .single();
        
      if (currentUserError) {
        console.error('Error fetching current user details:', currentUserError);
        throw currentUserError;
      }

      // Create new chat with proper name
      let actualChatName = chatName;
      if (!isGroup) {
        // For direct messages, use format "User1 & User2"
        const currentUserName = currentUserDetails?.full_name || 'User';
        actualChatName = `${currentUserName} & ${selectedUsers[0].full_name}`;
      }
      
      // Create chat
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .insert([
          {
            name: actualChatName,
            is_group: isGroup,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      if (chatError) {
        console.error('Error creating chat:', chatError);
        throw chatError;
      }
      
      if (!chatData || chatData.length === 0) {
        throw new Error('Failed to create chat');
      }

      const chatId = chatData[0].id;
      console.log('Created chat with ID:', chatId);

      // Add current user as admin
      const { error: currentUserMemberError } = await supabase
        .from('chat_members')
        .insert([
          {
            chat_id: chatId,
            user_id: currentUserId,
            role: 'admin',
            joined_at: new Date().toISOString()
          }
        ]);
        
      if (currentUserMemberError) {
        console.error('Error adding current user to chat:', currentUserMemberError);
        throw currentUserMemberError;
      }

      // Add selected users as members
      for (const user of selectedUsers) {
        const { error: memberError } = await supabase
          .from('chat_members')
          .insert([
            {
              chat_id: chatId,
              user_id: user.id,
              role: 'member',
              joined_at: new Date().toISOString()
            }
          ]);
          
        if (memberError) {
          console.error(`Error adding user ${user.id} to chat:`, memberError);
          // Continue anyway to try to add other users
        }
      }

      // Add welcome message
      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            sender_id: currentUserId,
            content: isGroup 
              ? 'Welcome to the group chat!' 
              : `Hello ${selectedUsers[0].full_name}!`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
        
      if (messageError) {
        console.error('Error adding welcome message:', messageError);
        throw messageError;
      }

      // Close modal and reset state
      setIsModalOpen(false);
      setSelectedUsers([]);
      setChatName('');
      setIsGroup(false);
      
      // Call parent callback to refresh chats
      if (onChatCreated) {
        onChatCreated();
      }
      
    } catch (err: any) {
      console.error('Error creating chat:', err);
      setError(`Failed to create chat: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <FaPlus className="mr-2" />
        New Chat
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Chat</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <div className="flex space-x-2">
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    !isGroup ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setIsGroup(false)}
                >
                  <FaUser className="inline mr-2" />
                  Direct Message
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    isGroup ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setIsGroup(true)}
                >
                  <FaUsers className="inline mr-2" />
                  Group Chat
                </button>
              </div>
            </div>

            {isGroup && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter group name"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isGroup ? 'Add Participants' : 'Select User'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-9 border border-gray-300 rounded-md"
                  placeholder="Search by name or email"
                />
                <div className="absolute left-3 top-2.5">
                  {isSearching ? (
                    <FaSpinner className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <FaSearch className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-md overflow-hidden max-h-60 overflow-y-auto">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center border-b border-gray-100"
                    >
                      <div className="flex-shrink-0 mr-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchTerm && searchResults.length === 0 && !isSearching && (
                <div className="mt-2 p-3 text-sm text-gray-500 bg-gray-50 rounded-md">
                  No users found matching "{searchTerm}"
                </div>
              )}

              {/* Selected users */}
              {selectedUsers.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {isGroup ? 'Participants' : 'Selected User'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div
                        key={user.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {user.full_name}
                        <button
                          type="button"
                          className="ml-1 inline-flex text-blue-400 hover:text-blue-600"
                          onClick={() => removeUser(user.id)}
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={createChat}
                disabled={isLoading || selectedUsers.length === 0 || (isGroup && !chatName.trim())}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="inline animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Chat'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}