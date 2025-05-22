/**
 * Format a date to a relative time string (e.g., "2h ago", "Yesterday", etc.)
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diffInSeconds < 60 * 60) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 60 * 60 * 24) {
      const hours = Math.floor(diffInSeconds / (60 * 60));
      return `${hours}h ago`;
    }
    
    // Less than a week
    if (diffInSeconds < 60 * 60 * 24 * 7) {
      const days = Math.floor(diffInSeconds / (60 * 60 * 24));
      if (days === 1) return 'Yesterday';
      return `${days}d ago`;
    }
    
    // Format as date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  /**
   * Format a date to a chat message time format (e.g., "10:30 AM")
   */
  export function formatChatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  /**
   * Generate initials from a name
   */
  export function getInitials(name: string): string {
    if (!name) return '';
    
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  
  /**
   * Format a phone number
   */
  export function formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Return original if not a standard format
    return phoneNumber;
  }
  
  /**
   * Truncate text with ellipsis
   */
  export function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Get random color from a predefined set
   */
  export function getRandomColor(): string {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }