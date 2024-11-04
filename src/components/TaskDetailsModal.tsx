import React, { useState } from 'react';
import { X, Calendar, Paperclip, Send, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { mockContacts } from '../data/mockContacts';
import { Task, TaskComment } from '../types';
import { storage } from '../lib/storage';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: () => void;
}

export default function TaskDetailsModal({ isOpen, onClose, task, onUpdate }: TaskDetailsModalProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getContactName = (userId: string) => {
    const contact = mockContacts.find(c => c.id === userId);
    return contact ? contact.name : userId;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'N/A';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await storage.addTaskComment(task.id, {
        text: newComment,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      setNewComment('');
      onUpdate();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900">{task.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Created on {formatDate(task.createdAt)}
                </p>
              </div>
              <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                task.status === 'completada' ? 'bg-green-100 text-green-800' :
                task.status === 'en-progreso' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>

            <div className="space-y-6">
              {/* Task Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{task.description}</p>
              </div>

              {/* Task Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Last updated: {formatDate(task.updatedAt)}</span>
                </div>
              </div>

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                  <ul className="space-y-2">
                    {task.attachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Paperclip className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Comments</h4>
                <div className="space-y-4 mb-4">
                  {task.comments?.map((comment, index) => (
                    <div key={index} className="flex space-x-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${getContactName(comment.userId)}&background=random`}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="bg-gray-50 rounded-lg p-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium text-gray-900">
                            {getContactName(comment.userId)}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleSubmitComment} className="mt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}