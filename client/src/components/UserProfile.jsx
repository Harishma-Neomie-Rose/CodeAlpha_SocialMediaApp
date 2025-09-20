import FollowButton from './FollowButton';

function UserProfile({ user, currentUserId, setUsers }) {
  return (
    <div className="user-profile">
      <h3>{user.username}</h3>
      <p>{user.bio || 'No bio available'}</p>
      <div className="user-stats">
        <span className="stat-item">
          👥 {user.followers?.length || 0} followers
        </span>
        <span className="stat-item">
          ➡️ {user.following?.length || 0} following
        </span>
      </div>
      <FollowButton 
        userId={currentUserId} 
        targetUserId={user._id} 
        setUsers={setUsers}
        isFollowing={user.followers?.includes(currentUserId)}
      />
    </div>
  );
}

export default UserProfile;