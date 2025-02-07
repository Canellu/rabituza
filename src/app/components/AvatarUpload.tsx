'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { User } from '@/types/User';
import type { PutBlobResult } from '@vercel/blob';
import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
import useCreateOrUpdateUser from '../hooks/useCreateOrUpdateUser';
import Spinner from './Spinner'; // Import the Spinner component

const getGradientClass = (userId: string) => {
  const gradients = [
    'from-emerald-300 to-emerald-800',
    'from-blue-400 to-blue-600',
    'from-violet-400 to-violet-600',
    'from-amber-400 to-amber-600',
    'from-rose-300 to-rose-600',
  ];

  const index = parseInt(userId) % gradients.length;
  return gradients[index];
};

interface AvatarUploadProps {
  user: User;
}

const AvatarUpload = ({ user }: AvatarUploadProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { mutate: updateUser } = useCreateOrUpdateUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const isFileTooLarge = fileInfo && fileInfo.size > 5 * 1024 * 1024;

  const handleFileChange = () => {
    if (inputFileRef.current?.files) {
      const file = inputFileRef.current.files[0];
      setFileInfo({ name: file.name, size: file.size });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFileInfo(null);
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];

    // Check file size (limit to 5MB)
    if (isFileTooLarge) {
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      // Store the previous avatar URL for deletion
      const previousAvatarUrl = user.avatar;

      const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const newBlob = (await response.json()) as PutBlobResult;

      // Update user with new avatar URL
      updateUser({ ...user, avatar: newBlob.url });

      // Delete the old avatar from Vercel Blob Store
      if (previousAvatarUrl) {
        await fetch(`/api/avatar/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: previousAvatarUrl }),
        });
      }

      setIsModalOpen(false); // Close modal after successful upload
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false); // Reset loading state
      setFileInfo(null); // Reset file info after upload
    }
  };

  return (
    <div>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={100}
            height={100}
            className="rounded-xl object-cover size-24 ring-1 ring-offset-2 ring-stone-300"
          />
        ) : (
          <div
            className={cn(
              'flex items-center justify-center size-20 rounded-full bg-gradient-to-br',
              user?.id &&
                `from-emerald-300 to-emerald-800 from-blue-400 to-blue-600 from-violet-400 to-violet-600 from-amber-400 to-amber-600 from-rose-300 to-rose-600`,
              getGradientClass(user.id)
            )}
          >
            <span className="text-2xl font-bold text-white inter">
              {(
                user?.username?.[0] ||
                user?.first_name?.[0] ||
                '?'
              ).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md w-[96%] rounded-md">
          <DialogHeader>
            <DialogTitle>Upload Your Avatar</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleUpload}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-sm text-stone-600 text-start w-full">
              Maximum file size: 5MB
            </p>

            <Input
              name="file"
              ref={inputFileRef}
              type="file"
              required
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />

            <div
              className={cn(
                'text-sm w-full text-start',
                isFileTooLarge
                  ? 'text-red-500 bg-red-100 rounded-md py-1 px-3 w-full text-center'
                  : 'text-gray-600'
              )}
            >
              {fileInfo && (
                <p>
                  File size:{' '}
                  {fileInfo.size < 1024 * 1024
                    ? `${(fileInfo.size / 1024).toFixed(2)} KB`
                    : `${(fileInfo.size / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between w-full mt-6">
              <Button onClick={handleCloseModal} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" disabled={!!isFileTooLarge || isLoading}>
                {isLoading ? (
                  <span className="text-stone-800 flex items-center gap-2">
                    <Spinner size="size-4" color="text-stone-800" />{' '}
                    Uploading...
                  </span>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarUpload;
