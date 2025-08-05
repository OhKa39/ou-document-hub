import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CommentFormProps {
  onSubmit: (data: { rating: number; comment: string; images: File[] }) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variant, setVariant] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImageFiles((prev) => [...prev, ...newFiles].slice(0, 5));
      setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    onSubmit({
      rating,
      comment,
      images: imageFiles,
    });

    setRating(0);
    setComment('');
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">Write a Review</h2>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <svg
                className={`h-8 w-8 ${star <= (hoverRating || rating) ? 'text-blue-500' : 'text-gray-300'} transition-colors`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating > 0 ? ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1] : 'Select a rating'}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Your Review</label>
        <Textarea
          placeholder="Share your experience with this product..."
          className="min-h-[120px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Add Photos (Optional)</label>
        <div className="flex flex-wrap gap-2">
          {imagePreviews.map((image, index) => (
            <div key={index} className="relative h-20 w-20 overflow-hidden rounded border">
              <Image src={image || '/placeholder.svg'} alt={`Upload ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                className="absolute right-0 top-0 rounded-full bg-red-500 p-0.5 text-white"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {imagePreviews.length < 5 && (
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200">
              <Camera className="h-6 w-6 text-gray-500" />
              <span className="mt-1 text-xs text-gray-500">Add Photo</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">You can upload up to 5 images</p>
      </div>
      <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleSubmit}>
        Submit Review
      </Button>
    </div>
  );
}
