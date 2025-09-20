import { useState } from 'react';

function PostForm({ setPosts }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Please write something before posting!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to create post');
      }
      
      const newPost = await res.json();
      setPosts(prev => [newPost, ...prev]); // Add new post at the beginning
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="What's on your mind? Share something amazing..." 
        disabled={isSubmitting}
        maxLength={280}
      />
      <button type="submit" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? 'Posting...' : 'Share Post'}
      </button>
      {content.length > 250 && (
        <small style={{color: content.length > 280 ? '#ff6b6b' : '#6c757d'}}>
          {280 - content.length} characters remaining
        </small>
      )}
    </form>
  );
}

export default PostForm;