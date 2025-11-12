import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Admin', href: '/admin' },
  { title: 'Categories', href: '/admin/categories' },
];

type Sector = { id: number; name: string; slug: string };
type Category = { id: number; name: string; slug: string; sector_id: number; image_url?: string | null; sector?: { id: number; name: string } };

export default function CategoriesIndex({ sectors = [], categories = [] }: { sectors: Sector[]; categories: Category[] }) {
  const { data, setData, post, processing, reset } = useForm<{ name: string; slug: string; sector_id: string | number; image_url?: string }>(
    { name: '', slug: '', sector_id: '', image_url: '' }
  );
  const [selected, setSelected] = React.useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = React.useState<null | { bulk?: boolean; id?: number }>(null);
  const [moveOpen, setMoveOpen] = React.useState(false);
  const [moveSectorId, setMoveSectorId] = React.useState<string>('');
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editFields, setEditFields] = React.useState<{ name: string; slug: string; sector_id: number | ''; image_url?: string }>(
    { name: '', slug: '', sector_id: '', image_url: '' }
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.sector_id) return;
    post(route('admin.categories.store'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const remove = (id: number) => {
    setConfirmOpen({ id });
  };

  const doDelete = (id: number) => {
    router.delete(route('admin.categories.destroy', { category: id }), { preserveScroll: true, onSuccess: () => setConfirmOpen(null) });
  };

  const toggleSelect = (id: number, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditFields({ name: c.name, slug: c.slug, sector_id: c.sector_id, image_url: c.image_url || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFields({ name: '', slug: '', sector_id: '', image_url: '' });
  };

  const saveEdit = (id: number) => {
    // optimistic: no-op here; Inertia response will rehydrate with fresh props
    router.put(route('admin.categories.update', { category: id }), editFields, {
      preserveScroll: true,
      onSuccess: () => {
        cancelEdit();
      },
    });
  };

  const openBulkMove = () => {
    if (!selected.length) return;
    setMoveSectorId('');
    setMoveOpen(true);
  };

  const doBulkMove = () => {
    if (!moveSectorId) return;
    router.post(route('admin.categories.bulk-move'), { sector_id: parseInt(moveSectorId), ids: selected }, {
      preserveScroll: true,
      onSuccess: () => { setMoveOpen(false); setSelected([]); },
    });
  };

  const doBulkDelete = () => {
    router.post(route('admin.categories.bulk-delete'), { ids: selected }, {
      preserveScroll: true,
      onSuccess: () => { setConfirmOpen(null); setSelected([]); },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories" />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">Categories</h1>

        <form onSubmit={onSubmit} className="mb-6 grid gap-3 sm:grid-cols-4 sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" htmlFor="sector">Sector</label>
            <Select value={String(data.sector_id)} onValueChange={(v) => setData('sector_id', parseInt(v))}>
              <SelectTrigger id="sector"><SelectValue placeholder="Select sector" /></SelectTrigger>
              <SelectContent>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" htmlFor="name">Name</label>
            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Agricultural Equipment" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" htmlFor="slug">Slug (optional)</label>
            <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="agricultural-equipment" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Image (optional)</label>
            <FileUpload label="Upload image" currentImage={data.image_url} onUploadComplete={(url) => setData('image_url', url)} />
          </div>
          <div>
            <Button type="submit" disabled={processing || !data.sector_id}>Add Category</Button>
          </div>
        </form>

        <div className="mb-3 flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={!selected.length} onClick={openBulkMove}>Bulk Move ({selected.length})</Button>
          <Button size="sm" variant="destructive" disabled={!selected.length} onClick={() => setConfirmOpen({ bulk: true })}>Bulk Delete</Button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">Select</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length ? categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(c.id)} onCheckedChange={(chk) => toggleSelect(c.id, Boolean(chk))} />
                  </TableCell>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    {editingId === c.id ? (
                      <Input value={editFields.name} onChange={(e) => setEditFields((p) => ({ ...p, name: e.target.value }))} />
                    ) : (
                      c.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === c.id ? (
                      <Input value={editFields.slug} onChange={(e) => setEditFields((p) => ({ ...p, slug: e.target.value }))} />
                    ) : (
                      c.slug
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === c.id ? (
                      <Select value={String(editFields.sector_id)} onValueChange={(v) => setEditFields((p) => ({ ...p, sector_id: parseInt(v) }))}>
                        <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                        <SelectContent>
                          {sectors.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      c.sector?.name ?? '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === c.id ? (
                      <FileUpload label="Upload image" currentImage={editFields.image_url} onUploadComplete={(url) => setEditFields((p) => ({ ...p, image_url: url }))} />
                    ) : (
                      c.image_url ? (
                        <img src={c.image_url} alt="" className="h-8 w-8 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === c.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => saveEdit(c.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(c)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(c.id)}>Delete</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No categories yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Confirm delete dialog */}
        <Dialog open={!!confirmOpen} onOpenChange={(open) => !open && setConfirmOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm deletion</DialogTitle>
              <DialogDescription>
                {confirmOpen?.bulk ? 'Delete selected categories?' : 'Delete this category?'}
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

        {/* Bulk move dialog */}
        <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move categories</DialogTitle>
              <DialogDescription>Select a target sector</DialogDescription>
            </DialogHeader>
            <div>
              <Select value={moveSectorId} onValueChange={setMoveSectorId}>
                <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setMoveOpen(false)}>Cancel</Button>
              <Button onClick={doBulkMove} disabled={!moveSectorId}>Move</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
