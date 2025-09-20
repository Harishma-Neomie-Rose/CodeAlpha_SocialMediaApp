import { useEffect, useState } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import UserList from './components/UserList';
import './App.css'; // Import the CSS file

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = '64fa7b1234567890abcdef12'; // replace with actual user ID

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="loading" style={{color: '#ff6b6b'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Mini Social Media App</h1>
      <PostForm setPosts={setPosts} />
      <PostList posts={posts} setPosts={setPosts} currentUserId={currentUserId} />
      <UserList currentUserId={currentUserId} />
    </div>
  );
}

export default App;