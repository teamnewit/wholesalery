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
import { FormEvent, ChangeEvent, useMemo, useState } from 'react';

type Category = {
  id: number;
  name: string;
  slug?: string;
  sector_id?: number;
};

type Sector = { id: number; name: string; slug: string };

interface CreateOfferProps {
  sectors: Sector[];
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Create Offer',
        href: '/offers/create',
    },
];

export default function CreateOffer({ sectors = [], categories = [] }: CreateOfferProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image_url: '',
        offer_category_id: null as number | null,
    });

    const [sectorId, setSectorId] = useState<number | ''>('');

    const filteredCategories = useMemo(() => {
        if (!sectorId) return [] as Category[];
        return categories.filter((c) => c.sector_id === sectorId);
    }, [categories, sectorId]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/offers', {
            onSuccess: () => {
                toast.success('Offer created successfully!', {
                    description: 'Your new offer has been added to your collection.',
                    duration: 5000,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Offer" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create New Offer</h1>
                    <p className="text-gray-500 dark:text-gray-400">Add a new offer to your collection</p>
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
                            <Label htmlFor="sector">Sector</Label>
                            <Select
                                value={sectorId ? String(sectorId) : ''}
                                onValueChange={(value) => {
                                    const v = value ? parseInt(value) : ('' as any);
                                    setSectorId(v);
                                    // reset category when sector changes
                                    setData('offer_category_id', null);
                                }}
                                name="sector"
                            >
                                <SelectTrigger aria-label="Sector" id="sector">
                                    <SelectValue placeholder="Select a sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sectors.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="offer_category_id">Category</Label>
                            <Select
                                value={data.offer_category_id ? String(data.offer_category_id) : ''}
                                onValueChange={(value) => setData('offer_category_id', value ? parseInt(value) : null)}
                                name="offer_category_id"
                                disabled={!sectorId}
                            >
                                <SelectTrigger aria-label="Offer Category" id="offer_category_id">
                                    <SelectValue placeholder={sectorId ? 'Select a category' : 'Select a sector first'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredCategories.map((category) => (
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
                                {processing ? 'Creating...' : 'Create Offer'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
