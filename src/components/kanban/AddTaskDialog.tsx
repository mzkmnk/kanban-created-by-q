'use client';

import { useState } from 'react';
import { TaskStatus, CreateTaskInput } from '@/types/kanban';
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
import { X } from 'lucide-react';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: CreateTaskInput) => void;
  defaultStatus?: TaskStatus;
}

export const AddTaskDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  defaultStatus = TaskStatus.TODO 
}: AddTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    if (!validateForm()) return;

    const taskInput: CreateTaskInput = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      tags: tags.length > 0 ? tags : undefined
    };

    onSubmit(taskInput);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus(defaultStatus);
    setPriority('medium');
    setTagInput('');
    setTags([]);
    setErrors({});
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
