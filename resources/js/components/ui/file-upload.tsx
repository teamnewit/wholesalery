'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  label?: string;
  currentImage?: string;
  className?: string;
}

export function FileUpload({ 
  onUploadComplete, 
  label = "Upload Image", 
  currentImage,
  className = "" 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Ensure preview updates if currentImage changes (e.g., when form is loaded with data)
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const processFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    setError(null);
    setIsUploading(true);

    // Create a temporary preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Create form data for upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Send the file to the server
      const response = await axios.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Call the callback with the uploaded image URL
      onUploadComplete(response.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
      // Remove the preview if upload fails
      if (preview !== currentImage) {
        setPreview(currentImage || null);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await processFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="image-upload">{label}</Label>
        
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6
            transition-colors duration-200 ease-in-out
            flex flex-col items-center justify-center gap-3
            cursor-pointer
            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'}
            ${preview ? 'py-4' : 'py-10'}
          `}
          onClick={handleButtonClick}
        >
          {!preview && (
            <>
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragging ? 'Drop image here' : 'Drag and drop image here'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  or click to browse (PNG, JPG, GIF up to 2MB)
                </p>
              </div>
            </>
          )}
          
          {preview && (
            <div className="w-full">
              <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-3">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-48 object-contain w-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-90 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {isUploading ? 'Uploading...' : 'Click to change image'}
              </p>
            </div>
          )}
        </div>
        
        <Input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
