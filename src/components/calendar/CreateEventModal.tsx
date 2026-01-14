'use client';

import React, { useState, useRef } from 'react';
import { X, Image, Video, Loader2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/hooks/useFileUpload';
import { CreateEventData } from '@/hooks/useCalendarEvents';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventData) => Promise<void>;
  initialDate?: string;
  initialTime?: string;
  initialTitle?: string;
  initialType?: 'post' | 'carousel' | 'reel' | 'story';
  initialCaption?: string;
  initialPlatform?: string;
  initialThumbnail?: string;
  isEditing?: boolean;
}

const CONTENT_TYPES = [
  { value: 'post', label: 'Post', icon: '📷' },
  { value: 'carousel', label: 'Carousel', icon: '🎠' },
  { value: 'reel', label: 'Reel', icon: '🎬' },
  { value: 'story', label: 'Story', icon: '📱' },
] as const;

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X/Twitter' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  initialTime,
  initialTitle,
  initialType,
  initialCaption,
  initialPlatform,
  initialThumbnail,
  isEditing = false,
}) => {
  const { uploadFile, uploading, progress, error: uploadError } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateEventData>({
    title: initialTitle || '',
    content_type: initialType || 'post',
    event_date: initialDate || new Date().toISOString().split('T')[0],
    event_time: initialTime || '09:00',
    description: '',
    status: 'draft',
    platform: initialPlatform || 'instagram',
    caption: initialCaption || '',
    hashtags: [],
    thumbnail_url: initialThumbnail || '',
  });

  const [hashtagInput, setHashtagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialThumbnail || null);

  // Reset form when opening with new initial values
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialTitle || '',
        content_type: initialType || 'post',
        event_date: initialDate || new Date().toISOString().split('T')[0],
        event_time: initialTime || '09:00',
        description: '',
        status: 'draft',
        platform: initialPlatform || 'instagram',
        caption: initialCaption || '',
        hashtags: [],
        thumbnail_url: initialThumbnail || '',
      });
      setPreviewUrl(initialThumbnail || null);
    }
  }, [isOpen, initialTitle, initialType, initialDate, initialTime, initialCaption, initialPlatform, initialThumbnail]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Upload to Supabase
    const result = await uploadFile(file, 'calendar');
    if (result) {
      setFormData(prev => ({ ...prev, thumbnail_url: result.url }));
    } else {
      // Upload failed - clear preview and show error
      setPreviewUrl(null);
      setFormData(prev => ({ ...prev, thumbnail_url: '' }));
    }
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.trim().startsWith('#')
        ? hashtagInput.trim()
        : `#${hashtagInput.trim()}`;

      if (!formData.hashtags?.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          hashtags: [...(prev.hashtags || []), tag],
        }));
      }
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags?.filter(t => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            {isEditing ? 'Editar Conteúdo' : 'Novo Conteúdo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                placeholder="Enter content title..."
                required
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tipo de Conteúdo
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content_type: type.value }))}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                      formData.content_type === type.value
                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    )}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Hora
                </label>
                <input
                  type="time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Plataforma
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all bg-white"
              >
                {PLATFORMS.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Mídia
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
                  previewUrl
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                )}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    <span className="text-sm text-slate-600">Uploading... {progress}%</span>
                  </div>
                ) : previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg object-cover"
                    />
                    <p className="mt-2 text-xs text-slate-500">Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      <Image className="w-6 h-6 text-slate-400" />
                      <Video className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600">
                      Click to upload image or video
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, GIF, WebP, MP4, WebM (max 50MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">
                  Erro no upload: {uploadError}
                </p>
              )}
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Legenda
              </label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all resize-none"
                placeholder="Write your caption..."
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Hashtags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                  placeholder="#hashtag"
                />
                <button
                  type="button"
                  onClick={handleAddHashtag}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.hashtags && formData.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {formData.hashtags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        className="hover:text-amber-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? 'Atualizando...' : 'Salvando...'}
                </>
              ) : (
                isEditing ? 'Atualizar' : 'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
