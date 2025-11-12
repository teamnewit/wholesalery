<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class OfferModerationController extends Controller
{
    protected function ensureAdmin(Request $request): void
    {
        if (!($request->user()?->is_admin)) {
            abort(403);
        }
    }

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $offers = Offer::with(['user', 'category'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('admin/moderation/index', [
            'offers' => $offers,
        ]);
    }

    public function approve(Request $request, Offer $offer): RedirectResponse
    {
        $this->ensureAdmin($request);

        $offer->status = 'approved';
        $offer->rejection_reason = null;
        $offer->published_at = now();
        $offer->save();

        return back()->with('success', 'Offer approved and published.');
    }

    public function reject(Request $request, Offer $offer): RedirectResponse
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:2000'],
        ]);

        $offer->status = 'rejected';
        $offer->rejection_reason = $validated['reason'];
        $offer->published_at = null;
        $offer->save();

        return back()->with('success', 'Offer rejected.');
    }
}
