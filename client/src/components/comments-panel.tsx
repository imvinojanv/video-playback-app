import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Comment } from '@/lib/types';
import { formatTimestamp, cn } from '@/lib/utils';

interface CommentsPanelProps {
  comments: Comment[];
  currentTime: number;
  onAddComment: (text: string) => void;
  onCommentClick: (timestamp: number) => void;
}

export function CommentsPanel({
  comments,
  currentTime,
  onAddComment,
  onCommentClick
}: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
      </div>

      <ScrollArea className="flex-1 p-4">
        {comments.sort((a, b) => a.timestamp - b.timestamp).map((comment) => (
          <Card
            key={comment.id}
            className={cn(
              "p-4 mb-2 cursor-pointer transition-colors",
              Math.abs(currentTime - comment.timestamp) < 1 
                ? "border-primary" 
                : "hover:bg-accent"
            )}
            onClick={() => onCommentClick(comment.timestamp)}
          >
            <div className="font-medium text-sm text-primary mb-1">
              {formatTimestamp(comment.timestamp)}
            </div>
            <p className="text-sm">{comment.text}</p>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}