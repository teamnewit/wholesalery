<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Sector;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $offers = Offer::with('category')->where('user_id', $user->id)->latest()->get();
        $offerCount = $offers->count();
        $plan = $user->plan ?? 'free';
        $limit = match ($plan) {
            'starter' => 5,
            'elite' => 8,
            default => 3,
        };
        $remaining = max(0, $limit - $offerCount);

        return Inertia::render('Dashboard', [
            'offers' => $offers,
            'plan' => $plan,
            'offerCount' => $offerCount,
            'limit' => $limit,
            'remaining' => $remaining,
            'atLimit' => $offerCount >= $limit,
        ]);
    }
    
    public function create()
    {
        // Pass sectors and categories to the create view for dependent selects
        $sectors = Sector::orderBy('name')->get(['id','name','slug']);
        $categories = \App\Models\OfferCategory::orderBy('name')->get(['id', 'name', 'slug', 'sector_id']);
        return Inertia::render('Offers/Create', [
            'sectors' => $sectors,
            'categories' => $categories,
        ]);
    }
    
    public function store(Request $request)
    {
        // Enforce plan limits per plan: free:3, starter:5, elite:8
        $user = $request->user();
        $plan = $user->plan ?? 'free';
        $limit = match ($plan) {
            'starter' => 5,
            'elite' => 8,
            default => 3,
        };
        $offerCount = \App\Models\Offer::where('user_id', $user->id)->count();
        if ($offerCount >= $limit) {
            return back()->withErrors(['plan' => 'You have reached your plan limit. Upgrade your plan to create more offers.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string',
            'offer_category_id' => 'nullable|exists:offer_categories,id',
        ]);
        
        $offer = new Offer();
        $offer->title = $validated['title'];
        $offer->description = $validated['description'];
        $offer->image_url = $validated['image_url'] ?? null;
        $offer->offer_category_id = $validated['offer_category_id'] ?? null;
        $offer->user_id = $user->id;
        $offer->status = 'pending';
        $offer->rejection_reason = null;
        $offer->published_at = null;
        $offer->save();
        
        return redirect()->route('dashboard')->with('success', 'Offer created successfully!');
    }
    
    public function edit(Offer $offer)
    {
        // Check if the user owns this offer
        if ($offer->user_id !== auth()->id()) {
            abort(403);
        }
        
        // Pass categories to the edit view
        $categories = \App\Models\OfferCategory::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Offers/Edit', [
            'offer' => $offer,
            'categories' => $categories
        ]);
    }
    
    public function update(Request $request, Offer $offer)
    {
        // Check if the user owns this offer
        if ($offer->user_id !== auth()->id()) {
            abort(403);
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string',
            'offer_category_id' => 'nullable|exists:offer_categories,id',
        ]);
        
        $offer->title = $validated['title'];
        $offer->description = $validated['description'];
        $offer->image_url = $validated['image_url'] ?? $offer->image_url;
        $offer->offer_category_id = $validated['offer_category_id'] ?? $offer->offer_category_id;
        $offer->save();
        
        return redirect()->route('dashboard')->with('success', 'Offer updated successfully!');
    }
    
    public function destroy(Offer $offer)
    {
        // Check if the user owns this offer
        if ($offer->user_id !== auth()->id()) {
            abort(403);
        }
        
        $offer->delete();
        
        return redirect()->route('dashboard')->with('success', 'Offer deleted successfully!');
    }
}
