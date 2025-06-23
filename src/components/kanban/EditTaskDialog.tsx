'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, UpdateTaskInput } from '@/types/kanban';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Trash2 } from 'lucide-react';

interface EditTaskDialogProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (task: UpdateTaskInput) => void;
  onDelete: (taskId: string) => void;
}

export const EditTaskDialog = ({ 
  isOpen, 
  task, 
  onClose, 
  onSubmit, 
  onDelete 
}: EditTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority || 'medium');
      setTags(task.tags || []);
      setTagInput('');
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!task || !validateForm()) return;

    const updateInput: UpdateTaskInput = {
      id: task.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      tags: tags.length > 0 ? tags : undefined
    };

    onSubmit(updateInput);
    handleClose();
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.TODO);
    setPriority('medium');
    setTagInput('');
    setTags([]);
    setErrors({});
    setShowDeleteConfirm(false);
    onClose();
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Task
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-lg font-medium mb-2">Delete Task?</p>
              <p className="text-muted-foreground">
                Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Task
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description..."
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={priority} onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Press Enter or click Add to add tags (max 5)
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Created: {new Intl.DateTimeFormat('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(task.createdAt)}</p>
                <p>Updated: {new Intl.DateTimeFormat('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(task.updatedAt)}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!title.trim()}>
                Update Task
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
