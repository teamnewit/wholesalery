import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Subscriptions', href: '/subscriptions' },
];

export default function Subscriptions() {
  const { auth, flash } = usePage<SharedData>().props;
  const currentPlan = (auth?.user as any)?.plan ?? 'free';
  const choosePlan = (plan: 'free' | 'starter' | 'elite') => {
    router.post(route('subscriptions.select'), { plan }, { preserveScroll: true });
  };
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Subscriptions" />
      <section className="px-4 py-6">
        <div className="mx-auto w-full md:max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Choose your plan</h1>
            <p className="mt-2 text-sm text-muted-foreground">Flexible plans to get started and grow.</p>
            <div className="mt-3 text-sm">
              <span className="mr-2 text-muted-foreground">Your current plan:</span>
              <Badge variant="secondary" className="capitalize">{currentPlan}</Badge>
            </div>
            {flash?.success && (
              <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
                {flash.success}
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Great to try things out</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <ul className="mb-6 list-disc space-y-2 pl-5 text-sm">
                  <li>Post up to 3 offers</li>
                  <li>Basic support</li>
                </ul>
                <Button variant="default" className="w-full" onClick={() => choosePlan('free')} disabled={currentPlan === 'free'}>
                  {currentPlan === 'free' ? 'Current plan' : 'Choose Free'}
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>For individuals getting serious</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <ul className="mb-6 list-disc space-y-2 pl-5 text-sm">
                  <li>Increased offer limit</li>
                  <li>Priority listing</li>
                  <li>Email support</li>
                </ul>
                <Button className="w-full" onClick={() => choosePlan('starter')} disabled={currentPlan === 'starter'}>
                  {currentPlan === 'starter' ? 'Current plan' : 'Choose Starter'}
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Elite</CardTitle>
                <CardDescription>For teams and power users</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <ul className="mb-6 list-disc space-y-2 pl-5 text-sm">
                  <li>Unlimited offers</li>
                  <li>Featured placement</li>
                  <li>Priority support</li>
                </ul>
                <Button className="w-full" variant="secondary" onClick={() => choosePlan('elite')} disabled={currentPlan === 'elite'}>
                  {currentPlan === 'elite' ? 'Current plan' : 'Choose Elite'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
