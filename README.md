# 💬 WhatsApp Clone - Real-time Chat Application

A full-featured WhatsApp clone built with Next.js, React, TypeScript, and Supabase. Experience real-time messaging, group chats, user management, and more with a modern, responsive interface.

![WhatsApp Clone Demo](https://via.placeholder.com/800x400/2563eb/ffffff?text=WhatsApp+Clone+Demo)

## ✨ Features

### 🚀 Core Features
- **Real-time Messaging** - Instant message delivery with live updates
- **Group & Direct Chats** - Create and manage both personal and group conversations
- **User Authentication** - Secure login/logout with Supabase Auth
- **Message History** - Persistent chat history across sessions
- **Online Status** - Real-time connection status indicators
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 🎨 Advanced Features
- **Chat Labels** - Organize chats with custom colored labels (Demo, Content, Signup, Internal)
- **Advanced Filtering** - Filter chats by type, labels, and search queries
- **Unread Message Counts** - Visual indicators for unread messages
- **Member Management** - Add/remove members from group chats
- **Avatar System** - Auto-generated avatars with color coding
- **Demo Mode** - Try the app without database connection

### 🔧 Technical Features
- **Real-time Subscriptions** - Powered by Supabase Realtime
- **Database Fallback** - Automatic fallback to demo mode if database is unavailable
- **TypeScript** - Full type safety throughout the application
- **Modern UI** - Clean, intuitive interface with React Icons
- **Optimized Performance** - Efficient state management and rendering

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **State Management**: React Hooks (useState, useEffect, useCallback)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account and project
- Git for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/whatsapp-clone.git
cd whatsapp-clone
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup
Run the following SQL commands in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_labels ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (see Database Schema section for complete policies)
```

### 5. Run the Application
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application running!

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Chats Table
```sql
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR,
  is_group BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Chat Members Table
```sql
CREATE TABLE chat_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id, user_id)
);
```

#### Messages Table
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Labels Table
```sql
CREATE TABLE labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  color VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Chat Labels Table
```sql
CREATE TABLE chat_labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id, label_id)
);
```

### Row Level Security Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Users can view chats they're members of
CREATE POLICY "Users can view their chats" ON chats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_members 
    WHERE chat_members.chat_id = chats.id 
    AND chat_members.user_id = auth.uid()
  )
);

-- Users can view messages in their chats
CREATE POLICY "Users can view messages in their chats" ON messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_members 
    WHERE chat_members.chat_id = messages.chat_id 
    AND chat_members.user_id = auth.uid()
  )
);

-- Users can send messages to their chats
CREATE POLICY "Users can send messages to their chats" ON messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM chat_members 
    WHERE chat_members.chat_id = messages.chat_id 
    AND chat_members.user_id = auth.uid()
  )
);
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── components/
│   │   │       └── chat/
│   │   │           ├── chatlayout.tsx
│   │   │           ├── chatlist.tsx
│   │   │           ├── chatwindow.tsx
│   │   │           ├── chatsidebar.tsx
│   │   │           ├── newchatmodal.tsx
│   │   │           └── labelmanagementmodal.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── supabase/
│           └── client.ts
├── public/
├── .env.local
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project**
2. **Set up the database schema** using the SQL commands above
3. **Configure authentication** in the Supabase dashboard
4. **Enable Realtime** for the messages table
5. **Set up RLS policies** for security

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL for redirects | Yes |

## 🎯 Usage

### Creating a Chat
1. Click the "New Chat" button
2. Choose between Direct or Group chat
3. Select users to add
4. Assign labels (optional)
5. Click "Create Chat"

### Sending Messages
1. Select a chat from the sidebar
2. Type your message in the input field
3. Press Enter or click Send
4. Message appears instantly for all participants

### Managing Labels
1. Click the label management button
2. Create new labels with custom colors
3. Assign labels to chats for organization

### Filtering Chats
1. Use the search bar to find specific chats
2. Apply filters by chat type (Direct/Group)
3. Filter by labels using the dropdown

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
2. **Connect your repo to Vercel**
3. **Set environment variables in Vercel dashboard**
4. **Deploy**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Deploy to Netlify

1. **Build the application**
2. **Deploy the `out` folder to Netlify**
3. **Set environment variables**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
- **Problem**: 406 errors when fetching data
- **Solution**: Check your Supabase URL and keys, ensure RLS policies are set up correctly

#### Real-time Not Working
- **Problem**: Messages don't appear in real-time
- **Solution**: Enable Realtime on the messages table in Supabase dashboard

#### Authentication Issues
- **Problem**: Login/logout not working
- **Solution**: Check authentication settings in Supabase and environment variables

#### Demo Mode
- **Problem**: App stuck in demo mode
- **Solution**: Verify database connection and check console for errors

### Getting Help

- Check the [Issues](https://github.com/yourusername/whatsapp-clone/issues) page
- Create a new issue with detailed information
- Include console errors and steps to reproduce

## 📈 Performance

### Optimization Features
- **Lazy Loading** - Components load only when needed
- **Memoization** - Prevent unnecessary re-renders
- **Efficient Queries** - Optimized database queries
- **Real-time Subscriptions** - Minimal network overhead

### Performance Tips
- Keep chat history reasonable (consider pagination for large chats)
- Regularly clean up old subscriptions
- Monitor Supabase usage in the dashboard

## 🔒 Security

### Security Features
- **Row Level Security** - Database-level access control
- **Authentication** - Secure user authentication
- **Input Validation** - Sanitized user inputs
- **HTTPS** - Secure data transmission

### Security Best Practices
- Regularly update dependencies
- Use environment variables for sensitive data
- Implement proper error handling
- Monitor for suspicious activity

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend-as-a-service platform
- **Next.js** - For the excellent React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **React Icons** - For the beautiful icon library

## 📞 Support

If you like this project, please give it a ⭐️ on GitHub!

For questions or support:
- Create an [Issue](https://github.com/yourusername/whatsapp-clone/issues)
- Email: praneethvvsss@gmail.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

**Built with ❤️ by [praneeth](https://github.com/yourusername)**

## Deployemnt Link
- https://whatsup-application-neaj.vercel.app
