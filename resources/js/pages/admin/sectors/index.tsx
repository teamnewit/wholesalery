import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Admin', href: '/admin' },
  { title: 'Sectors', href: '/admin/sectors' },
];

type Sector = { id: number; name: string; slug: string; image_url?: string | null; created_at: string };

export default function SectorsIndex({ sectors = [] }: { sectors: Sector[] }) {
  const { data, setData, post, processing, reset } = useForm({ name: '', slug: '', image_url: '' });
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editFields, setEditFields] = React.useState<{ name: string; slug: string; image_url?: string }>({ name: '', slug: '', image_url: '' });
  const [selected, setSelected] = React.useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = React.useState<null | { id?: number; bulk?: boolean }>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.sectors.store'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const remove = (id: number) => {
    setConfirmOpen({ id });
  };

  const doDelete = (id: number) => {
    router.delete(route('admin.sectors.destroy', { sector: id }), { preserveScroll: true, onSuccess: () => setConfirmOpen(null) });
  };

  const toggleSelect = (id: number, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const bulkDelete = () => {
    if (!selected.length) return;
    setConfirmOpen({ bulk: true });
  };

  const doBulkDelete = async () => {
    for (const id of selected) {
      // fire sequentially to keep UI simple
      // ignore errors for now
      // eslint-disable-next-line no-await-in-loop
      await router.delete(route('admin.sectors.destroy', { sector: id }), { preserveScroll: true, onSuccess: () => {} });
    }
    setSelected([]);
    setConfirmOpen(null);
  };

  const startEdit = (s: Sector) => {
    setEditingId(s.id);
    setEditFields({ name: s.name, slug: s.slug });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFields({ name: '', slug: '' });
  };

  const saveEdit = (id: number) => {
    router.put(route('admin.sectors.update', { sector: id }), editFields, {
      preserveScroll: true,
      onSuccess: () => cancelEdit(),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sectors" />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">Sectors</h1>

        <form onSubmit={onSubmit} className="mb-6 grid gap-3 sm:grid-cols-4 sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" htmlFor="name">Name</label>
            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Agriculture" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" htmlFor="slug">Slug (optional)</label>
            <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="agriculture" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Image (optional)</label>
            <FileUpload label="Upload image" currentImage={data.image_url} onUploadComplete={(url) => setData('image_url', url)} />
          </div>
          <div>
            <Button type="submit" disabled={processing}>Add Sector</Button>
          </div>
        </form>

        <div className="mb-3 flex items-center gap-2">
          <Button variant="destructive" size="sm" disabled={!selected.length} onClick={bulkDelete}>Bulk Delete ({selected.length})</Button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">Select</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectors.length ? sectors.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(s.id)} onCheckedChange={(c) => toggleSelect(s.id, Boolean(c))} />
                  </TableCell>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>
                    {editingId === s.id ? (
                      <Input value={editFields.name} onChange={(e) => setEditFields((prev) => ({ ...prev, name: e.target.value }))} />
                    ) : (
                      s.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === s.id ? (
                      <Input value={editFields.slug} onChange={(e) => setEditFields((prev) => ({ ...prev, slug: e.target.value }))} />
                    ) : (
                      s.slug
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === s.id ? (
                      <FileUpload label="Upload image" currentImage={editFields.image_url} onUploadComplete={(url) => setEditFields((prev) => ({ ...prev, image_url: url }))} />
                    ) : (
                      s.image_url ? <img src={s.image_url} alt="" className="h-8 w-8 rounded object-cover" /> : <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {editingId === s.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => saveEdit(s.id)}>Save</Button>
                        <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(s)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => remove(s.id)}>Delete</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No sectors yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!confirmOpen} onOpenChange={(open) => !open && setConfirmOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm deletion</DialogTitle>
              <DialogDescription>
                {confirmOpen?.bulk ? 'Are you sure you want to delete the selected sectors?' : 'Are you sure you want to delete this sector?'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setConfirmOpen(null)}>Cancel</Button>
              {confirmOpen?.bulk ? (
                <Button variant="destructive" onClick={doBulkDelete}>Delete Selected</Button>
              ) : (
                <Button variant="destructive" onClick={() => doDelete(confirmOpen?.id!)}>Delete</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
