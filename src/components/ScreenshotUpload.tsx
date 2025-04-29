'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

const uploadSchema = z.object({
  file: z.instanceof(File).refine((file) => {
    return file.type.startsWith('image/');
  }, 'Please upload an image file'),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export function ScreenshotUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const onSubmit = async (data: UploadFormData) => {
    try {
      setIsUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', data.file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: 'Success',
        description: 'Screenshot uploaded and processed successfully',
      });

      // Handle the extracted data here
      console.log('Extracted data:', result.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload and process the screenshot',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Excel Screenshot</CardTitle>
        <CardDescription>
          Upload a screenshot of your Excel document to extract data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              {...register('file')}
              disabled={isUploading}
            />
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>
          
          {isUploading && (
            <Progress value={progress} className="w-full" />
          )}

          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Processing...' : 'Upload & Process'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 