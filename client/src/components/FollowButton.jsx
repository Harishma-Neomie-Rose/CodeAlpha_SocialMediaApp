import { useState } from 'react';

function FollowButton({ userId, targetUserId, setUsers, isFollowing: initialFollowState = false, user }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!userId || userId === targetUserId) {
      alert('Cannot follow yourself or invalid user');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate successful response
      console.log('👥 Dummy follow operation:', {
        userId,
        targetUserId,
        currentlyFollowing: isFollowing,
        action: isFollowing ? 'unfollow' : 'follow'
      });

      // Update local state
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);

      // Update the user's followers count in the users list
      if (setUsers && user) {
        setUsers(prevUsers => 
          prevUsers.map(u => {
            if (u._id === targetUserId) {
              const updatedFollowers = newFollowingState 
                ? [...(u.followers || []), userId] // Add follower
                : (u.followers || []).filter(id => id !== userId); // Remove follower
              
              return {
                ...u,
                followers: updatedFollowers
              };
            }
            return u;
          })
        );
      }

      // Show success message
      const action = newFollowingState ? 'followed' : 'unfollowed';
      const username = user?.username || 'User';
      
      // Create a temporary success notification
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00b894, #00cec9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
      `;
      
      notification.textContent = `Successfully ${action} ${username}!`;
      document.body.appendChild(notification);
      
      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.style.animation = 'slideIn 0.3s ease-out reverse';
          setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
          }, 300);
        }
      }, 3000);

    } catch (error) {
      console.error('Error in dummy follow:', error);
      alert('Simulated error occurred. Please try again.');
      // Revert the optimistic update
      setIsFollowing(isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className="follow-button" 
      onClick={handleFollow}
      disabled={isLoading || !userId || userId === targetUserId}
      style={{
        background: isFollowing 
          ? 'linear-gradient(45deg, #6c757d, #495057)' 
          : 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {isLoading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            width: '12px', 
            height: '12px', 
            border: '2px solid #fff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></span>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        isFollowing ? 'Unfollow' : 'Follow'
      )}
    </button>
  );
}

export default FollowButton;