import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck, CheckSquare, Layers, Tags } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Admin', href: '/admin' },
];

export default function AdminIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin" />
      <div className="p-4">
        <h1 className="mb-6 text-2xl font-semibold">Admin Panel</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" /> Post Moderation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Review and approve or reject pending offers.</p>
              <Link href={route('admin.moderation.index')}>
                <Button>Go to Moderation</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Browse all users, roles, and plans.</p>
              <Link href={route('admin.users.index')}>
                <Button>Go to Users</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" /> Sectors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Manage marketplace sectors (parents of categories).</p>
              <Link href={route('admin.sectors.index')}>
                <Button>Manage Sectors</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" /> Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Manage subcategories under each sector.</p>
              <Link href={route('admin.categories.index')}>
                <Button>Manage Categories</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
