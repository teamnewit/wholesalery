'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, ChangeEvent } from 'react';

type Offer = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  offer_category_id?: number;
  category?: {
    id: number;
    name: string;
    slug?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
};

type Category = {
  id: number;
  name: string;
  slug?: string;
};

interface EditOfferProps {
  offer: Offer;
  categories: Category[];
}

export default function EditOffer({ offer, categories }: EditOfferProps) {
    // Debug: Log the offer data to see what we're receiving
    console.log('Offer data received:', offer);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Edit Offer',
            href: `/offers/${offer.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: offer.title,
        description: offer.description,
        image_url: offer.image_url || '',
        offer_category_id: offer.offer_category_id || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/offers/${offer.id}`, {
            onSuccess: () => {
                toast.success('Offer updated successfully!', {
                    description: 'Your offer has been updated with the new information.',
                    duration: 5000,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Offer" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Offer</h1>
                    <p className="text-gray-500 dark:text-gray-400">Update your offer details</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                                placeholder="Enter offer title"
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                placeholder="Enter offer description"
                                rows={5}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>

                        <FileUpload
                            label="Offer Image"
                            onUploadComplete={(url) => setData('image_url', url)}
                            currentImage={data.image_url}
                            className="space-y-2"
                        />
                        {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url}</p>}

                        <div className="space-y-2">
                            <Label htmlFor="offer_category_id">Offer Category</Label>
                            <Select
                                value={data.offer_category_id ? String(data.offer_category_id) : ''}
                                onValueChange={(value) => setData('offer_category_id', value ? parseInt(value) : '')}
                                name="offer_category_id"
                            >
                                <SelectTrigger aria-label="Offer Category" id="offer_category_id">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.offer_category_id && <p className="text-red-500 text-sm">{errors.offer_category_id}</p>}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => window.location.href = '/dashboard'}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Offer'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
