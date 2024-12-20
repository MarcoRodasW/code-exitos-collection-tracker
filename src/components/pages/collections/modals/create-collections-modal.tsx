'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateCollection } from '@/lib/actions/collections/actions';
import { createCollectionSchema } from '@/lib/types/collections/collections.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof createCollectionSchema>;

export default function CreateCollectionsModal() {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: '',
      description: '',
      image_url: undefined,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.image_url) {
      formData.append('image_url', data.image_url);
    }
    const {
      data: collectionData,
      succeed,
      message,
    } = await CreateCollection(formData);
    if (collectionData && succeed) {
      toast.success(message);
      form.reset();
      setOpen(false);
    } else {
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add new collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crete Collection</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Collection name' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Collection description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be under 70 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.jpg,.jpeg,.png,.webp'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Max file size is 5MB. Accepted formats: .jpg, .jpeg, .png,
                    .webp
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className='animate-spin' />
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
