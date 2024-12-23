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
import { UpdateCollectionItem } from '@/lib/actions/items/actions';
import {
  ItemsData,
  updateColletionItemSchema,
} from '@/lib/types/items/items.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface UpdateItemModalProps {
  item: ItemsData;
}

export default function UpdateItemModal({ item }: UpdateItemModalProps) {
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const form = useForm<z.infer<typeof updateColletionItemSchema>>({
    resolver: zodResolver(updateColletionItemSchema),
    defaultValues: {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      year_made: item.year_made ?? 2024,
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof updateColletionItemSchema>) {
    const { data, message, succeed } = await UpdateCollectionItem(
      item.id,
      values
    );

    if (data && succeed) {
      toast.success(message);
      setOpen(false);
    } else {
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[900px]'>
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='year_made'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Made</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  'Update Item'
                )}
              </Button>
            </form>
          </Form>
          <div
            className='relative mx-auto aspect-square max-w-[240px] overflow-hidden rounded-md'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src={item.image_url || 'https://fakeimg.pl/600x400?text=@'}
              alt={item.name}
              layout='fill'
              objectFit='cover'
              className='rounded-md'
            />
            {isHovering && (
              <div className='absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50'>
                <Upload className='h-12 w-12 cursor-pointer text-white' />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
