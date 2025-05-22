// MessagingTest.tsx - Component to test real-time messaging
import { useState, useEffect } from 'react';
// import { supabase, sendMessage, subscribeToMessages } from './supabaseclient';
import {supabase,sendMessage, subscribeToMessages} from '../../lib/supabase/client';

interface MessagingTestProps {
  currentUserId: string;
  testChatId: string;
}

const MessagingTest = ({ currentUserId, testChatId }: MessagingTestProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Add test result
  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  // Subscribe to real-time messages
  useEffect(() => {
    addTestResult('🔄 Setting up real-time subscription...');
    
    const cleanup = subscribeToMessages(
      (payload) => {
        addTestResult(`📨 Received real-time message: ${payload.new.content}`);
        setMessages(prev => [...prev, payload.new]);
      },
      (error) => {
        addTestResult(`❌ Subscription error: ${error.message}`);
        setIsConnected(false);
      }
    );

    setIsConnected(true);
    addTestResult('✅ Real-time subscription active');

    return () => {
      cleanup();
      setIsConnected(false);
      addTestResult('🔌 Subscription cleaned up');
    };
  }, []);

  // Test database connection
  const testConnection = async () => {
    try {
      addTestResult('🔍 Testing database connection...');
      
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .limit(1);
        
      if (error) {
        addTestResult(`❌ Database test failed: ${error.message}`);
      } else {
        addTestResult('✅ Database connection successful');
      }
    } catch (error) {
      addTestResult(`❌ Connection error: ${error}`);
    }
  };

  // Send test message
  const sendTestMessage = async () => {
    if (!newMessage.trim()) {
      addTestResult('⚠️ Please enter a message');
      return;
    }

    try {
      addTestResult(`📤 Sending message: "${newMessage}"`);
      
      const result = await sendMessage(testChatId, currentUserId, newMessage);
      
      addTestResult(`✅ Message sent successfully: ${result.id}`);
      setNewMessage('');
      
      // Add to local messages for immediate feedback
      setMessages(prev => [...prev, result]);
      
    } catch (error) {
      addTestResult(`❌ Send failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Load existing messages
  const loadMessages = async () => {
    try {
      addTestResult('📄 Loading existing messages...');
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          users:sender_id (full_name)
        `)
        .eq('chat_id', testChatId)
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) {
        addTestResult(`❌ Load failed: ${error.message}`);
      } else {
        setMessages(data || []);
        addTestResult(`✅ Loaded ${data?.length || 0} messages`);
      }
    } catch (error) {
      addTestResult(`❌ Load error: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Real-time Messaging Test</h1>
      
      {/* Connection Status */}
      <div className={`p-3 rounded-lg mb-4 ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test DB Connection
        </button>
        
        <button
          onClick={loadMessages}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Load Messages
        </button>
        
        <div className="text-sm text-gray-600">
          <div>User ID: {currentUserId}</div>
          <div>Chat ID: {testChatId}</div>
        </div>
      </div>

      {/* Send Message */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a test message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <button
            onClick={sendTestMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>

      {/* Messages Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Messages */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Messages ({messages.length})</h3>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No messages yet</div>
            ) : (
              messages.map((msg, index) => (
                <div key={msg.id || index} className="mb-3 p-2 bg-white rounded border">
                  <div className="text-sm text-gray-600">
                    {msg.users?.full_name || 'Unknown'} - {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                  <div className="font-medium">{msg.content}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Test Results */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <button
              onClick={() => setTestResults([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <div className="text-gray-500">No test results yet</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">Testing Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>First, click "Test DB Connection" to verify database access</li>
          <li>Click "Load Messages" to see existing messages in the chat</li>
          <li>Send a test message using the input field</li>
          <li>Open another browser tab/window with the same component to test real-time updates</li>
          <li>Send messages from different tabs and watch them appear in real-time</li>
          <li>Check the test results panel for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default MessagingTest;