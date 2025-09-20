import { useEffect, useState } from 'react';
import UserProfile from './UserProfile';

function UserList({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="user-list">
        <div style={{textAlign: 'center', padding: '2rem'}}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list">
        <div style={{textAlign: 'center', padding: '2rem', color: '#ff6b6b'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Discover People</h2>
      {users.length === 0 ? (
        <div style={{textAlign: 'center', padding: '2rem'}}>
          No users found.
        </div>
      ) : (
        users
          .filter(user => user._id !== currentUserId) // Don't show current user
          .map(user => (
            <UserProfile
              key={user._id}
              user={user}
              currentUserId={currentUserId}
              setUsers={setUsers}
            />
          ))
      )}
    </div>
  );
}

export default UserList;