import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Define the Offer type
type Offer = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status?: 'pending' | 'approved' | 'rejected' | string;
  rejection_reason?: string | null;
};

// Delete confirmation dialog component
function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, offerTitle }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  offerTitle: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the offer <strong>"{offerTitle}"</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard({ offers = [], plan, offerCount, limit, remaining, atLimit }: {
  offers: Offer[];
  plan: 'free' | 'starter' | 'elite' | string;
  offerCount: number;
  limit: number;
  remaining: number;
  atLimit: boolean;
}) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
    
    const handleDeleteClick = (offer: Offer) => {
        setOfferToDelete(offer);
        setDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = () => {
        if (offerToDelete) {
            router.delete(`/offers/${offerToDelete.id}`);
            setDeleteDialogOpen(false);
            setOfferToDelete(null);
        }
    };
    
    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setOfferToDelete(null);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">My Offers</h1>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="capitalize">{plan}</Badge>
                          <span>
                            {offerCount}/{limit} used • {remaining} remaining
                          </span>
                        </div>
                    </div>
                    <div className="inline-flex">
                        <Link href={atLimit ? '#' : '/offers/create'} className="inline-flex">
                            <Button disabled={atLimit}>
                                <PlusCircle className="mr-2 h-4 w-4" /> {atLimit ? 'Limit reached' : 'Add New Offer'}
                            </Button>
                        </Link>
                    </div>
                </div>
                {atLimit && (
                  <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:border-yellow-900/40 dark:bg-yellow-950/30 dark:text-yellow-300">
                    You’ve reached your plan limit. Upgrade your plan on the Subscriptions page to create more offers.
                  </div>
                )}
                
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offers.length > 0 ? (
                                offers.map((offer) => (
                                    <TableRow key={offer.id}>
                                        <TableCell className="font-medium">{offer.title}</TableCell>
                                        <TableCell className="max-w-[300px] truncate">{offer.description}</TableCell>
                                        <TableCell>{new Date(offer.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {offer.status ? (
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs capitalize ${
                                                    offer.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                    offer.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                }`} title={offer.rejection_reason || undefined}>
                                                    {offer.status}
                                                </span>
                                            ) : null}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/offers/${offer.id}/edit`} className="inline-flex">
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDeleteClick(offer)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                        No offers found. Click the "Add New Offer" button to create one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            
            {/* Delete Confirmation Dialog */}
            {offerToDelete && (
                <DeleteConfirmationDialog
                    isOpen={deleteDialogOpen}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    offerTitle={offerToDelete.title}
                />
            )}
        </AppLayout>
    );
}
