import { useState } from 'react';

function CommentForm({ postId, setPosts }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('Please write a comment before submitting!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: null, text: text.trim() })
      });
      
      if (!res.ok) {
        throw new Error('Failed to add comment');
      }
      
      const updatedPost = await res.json();
      setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
      setText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a thoughtful comment..."
        disabled={isSubmitting}
        maxLength={200}
      />
      <button type="submit" disabled={isSubmitting || !text.trim()}>
        {isSubmitting ? 'Adding...' : 'Comment'}
      </button>
    </form>
  );
}

export default CommentForm;