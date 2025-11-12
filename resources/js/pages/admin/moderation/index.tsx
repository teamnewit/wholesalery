import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Admin', href: '/admin/moderation' },
];

type Offer = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  rejection_reason?: string | null;
  user?: { id: number; name: string };
  category?: { id: number; name: string };
  image_url?: string | null;
};

export default function ModerationIndex({ offers = [] }: { offers: Offer[] }) {
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [viewOffer, setViewOffer] = useState<Offer | null>(null);

  const approve = (offerId: number) => {
    router.post(route('admin.offers.approve', { offer: offerId }), {}, { preserveScroll: true });
  };

  const openReject = (offerId: number) => {
    setRejectingId(offerId);
    setReason('');
  };

  const submitReject = () => {
    if (!rejectingId) return;
    router.post(route('admin.offers.reject', { offer: rejectingId }), { reason }, { preserveScroll: true, onSuccess: () => setRejectingId(null) });
  };

  const grouped = useMemo(() => {
    const map: Record<string, Offer[]> = {};
    for (const o of offers) {
      const key = o.user?.name || 'Unknown';
      if (!map[key]) map[key] = [];
      map[key].push(o);
    }
    // sort authors alphabetically
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [offers]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Moderate Offers" />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">Pending Offers</h1>

        {grouped.length === 0 ? (
          <div className="rounded-md border border-muted-foreground/10 p-6 text-center text-muted-foreground">No pending offers.</div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([author, items]) => (
              <div key={author} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{author}</h2>
                  <span className="text-sm text-muted-foreground">{items.length} pending</span>
                </div>
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">{o.title}</TableCell>
                          <TableCell>{o.category?.name ?? '-'}</TableCell>
                          <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={o.status === 'pending' ? 'secondary' : o.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                              {o.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setViewOffer(o)}>View</Button>
                            <Button size="sm" onClick={() => approve(o.id)} disabled={o.status !== 'pending'}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => openReject(o.id)} disabled={o.status !== 'pending'}>
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={rejectingId !== null} onOpenChange={(open) => !open && setRejectingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject offer</DialogTitle>
              <DialogDescription>Please provide a reason. The user will see it on their dashboard.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="reason">Reason</label>
              <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Explain why this offer was rejected..." />
            </div>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setRejectingId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={submitReject} disabled={!reason.trim()}>Reject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Offer Dialog */}
      <Dialog open={!!viewOffer} onOpenChange={(open) => !open && setViewOffer(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewOffer?.title}</DialogTitle>
            <DialogDescription>
              {viewOffer?.category?.name ? `Category: ${viewOffer.category.name}` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {viewOffer?.image_url && (
              <div className="relative w-full overflow-hidden rounded-md">
                <img src={viewOffer.image_url} alt={viewOffer.title} className="w-full object-cover" />
              </div>
            )}
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-4 whitespace-pre-wrap">
                {viewOffer?.description}
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setViewOffer(null)}>Close</Button>
            {viewOffer && (
              <>
                <Button onClick={() => { approve(viewOffer.id); setViewOffer(null); }}>Approve</Button>
                <Button variant="destructive" onClick={() => { setRejectingId(viewOffer.id); setViewOffer(null); }}>Reject</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
