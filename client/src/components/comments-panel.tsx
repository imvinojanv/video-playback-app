import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Comment } from '@/lib/types';
import { formatTimestamp, cn, formatRelativeTime } from '@/lib/utils';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface CommentsPanelProps {
  comments: Comment[];
  currentTime: number;
  onAddComment: (text: string) => void;
  onEditComment: (id: string, text: string) => void;
  onDeleteComment: (id: string) => void;
  onCommentClick: (timestamp: number) => void;
}

export function CommentsPanel({
  comments,
  currentTime,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onCommentClick
}: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onEditComment(id, editText.trim());
      setEditingId(null);
      setEditText('');
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
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="font-medium text-sm text-primary mb-1">
                  {formatTimestamp(comment.timestamp)}
                </div>
                {editingId === comment.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEdit(comment.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEditing();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">
                      {comment.text}
                      {comment.editedAt && <span className="text-xs text-muted-foreground ml-1">(edited)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(new Date(comment.editedAt || comment.createdAt))}
                    </p>
                  </>
                )}
              </div>
              {editingId !== comment.id && (
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(comment);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComment(comment.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}