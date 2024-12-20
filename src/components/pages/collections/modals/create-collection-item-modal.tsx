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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UpdateCollection } from '@/lib/actions/collections/actions';
import {
  CollectionData,
  updateCollectionSchema,
} from '@/lib/types/collections/collections.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface CreateCollectionItemModalProps {
  collection: CollectionData;
}
export default function CreateCollectionItemModal({
  collection,
}: CreateCollectionItemModalProps) {
  const items: any[] = [];
  const [isOpen, setIsOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const form = useForm<z.infer<typeof updateCollectionSchema>>({
    resolver: zodResolver(updateCollectionSchema),
    defaultValues: {
      name: collection.name,
      description: collection.description || '',
      value: collection.value,
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof updateCollectionSchema>) {
    const { data, message, succeed } = await UpdateCollection(
      collection.id,
      values
    );

    if (data && succeed) {
      toast.success(message);
      form.reset({
        description: data.description! ?? collection.description,
        name: data?.name ?? collection.name,
        value: data?.value ?? collection.value,
      });
    } else {
      toast.error(message);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='w-full' variant='secondary'>
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] w-[90vw] max-w-4xl overflow-y-auto p-4 sm:p-6'>
        <DialogHeader>
          <DialogTitle>{collection.name}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col space-y-6'>
          <div className='flex flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0'>
            {/* Collection Update Form */}
            <div className='w-full space-y-4 lg:w-1/2'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='value'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    disabled={
                      form.formState.isSubmitting || !form.formState.isValid
                    }
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className='animate-spin' />
                    ) : (
                      'Update Collection'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            {/* Collection Image Update */}
            <div className='w-full space-y-4 lg:w-1/2'>
              <div
                className='relative mx-auto aspect-square max-w-[240px] overflow-hidden rounded-md'
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                <Image
                  src={
                    collection.image_url ||
                    '/placeholder.svg?height=400&width=400'
                  }
                  alt={collection.name}
                  fill
                  className='object-cover'
                />
                {isImageHovered && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <label htmlFor='image-upload' className='cursor-pointer'>
                      <Upload className='h-12 w-12 text-white' />
                    </label>
                    <Input
                      id='image-upload'
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={() => {
                        /* Handle file upload */
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Items Table */}
          <div className='space-y-4'>
            <div className='mb-4 flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0'>
              <h3 className='text-lg font-semibold'>Items</h3>
              <Button>
                <Plus className='mr-2 h-4 w-4' /> Add New Item
              </Button>
            </div>
            <div className='overflow-x-auto'>
              <div className='overflow-hidden rounded-lg border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Year Made</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className='relative h-10 w-10'>
                            <Image
                              src={
                                item.image_url ||
                                '/placeholder.svg?height=40&width=40'
                              }
                              alt={item.name}
                              fill
                              className='rounded-sm object-cover'
                            />
                          </div>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.year_made || 'N/A'}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          ${item.total_price?.toFixed(2) || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
