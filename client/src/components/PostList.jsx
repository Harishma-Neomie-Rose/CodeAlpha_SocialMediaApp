import CommentForm from './CommentForm';

function PostList({ posts, setPosts, currentUserId }) {
  const handleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      });
      
      if (!res.ok) {
        throw new Error('Failed to like post');
      }
      
      const updatedPost = await res.json();
      setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  if (posts.length === 0) {
    return (
      <div className="post-list">
        <div style={{textAlign: 'center', color: 'white', padding: '2rem'}}>
          No posts yet. Be the first to share something!
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post._id} className="post-item">
          <div className="post-content">{post.content}</div>
          <div className="post-author">
            by {post.author?.username || 'Anonymous'} 
            {post.createdAt && ` • ${formatDate(post.createdAt)}`}
          </div>

          <div className="post-actions">
            <button 
              className="like-button" 
              onClick={() => handleLike(post._id)}
              aria-label={`Like post (${post.likes?.length || 0} likes)`}
            >
              {post.likes?.length || 0} 👍
            </button>
          </div>

          <div className="comments-section">
            <h4 className="comments-title">
              Comments ({post.comments?.length || 0})
            </h4>
            {post.comments?.map((comment, index) => (
              <div key={index} className="comment-item">
                <span className="comment-author">
                  {comment.user?.username || 'Anonymous'}:
                </span>
                <span className="comment-text">{comment.text}</span>
              </div>
            ))}
          </div>

          <CommentForm postId={post._id} setPosts={setPosts} />
        </article>
      ))}
    </div>
  );
}

export default PostList;