<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use App\Models\OfferCategory;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class MarketplaceController extends Controller
{
    public function index(Request $request): Response
    {
        $sectors = Sector::orderBy('name')->get(['id', 'name', 'slug']);
        $selected = $request->query('sector');
        $activeSector = $selected ? Sector::where('slug', $selected)->first() : ($sectors->first() ?: null);

        $categories = $activeSector
            ? OfferCategory::where('sector_id', $activeSector->id)
                ->withCount(['offers as approved_offers_count' => function ($q) {
                    $q->where('status', 'approved')->whereNotNull('published_at');
                }])
                ->orderBy('name')
                ->get(['id','name','slug','sector_id','image_url'])
            : collect();

        return Inertia::render('marketplace/index', [
            'sectors' => $sectors,
            'activeSector' => $activeSector,
            'categories' => $categories,
        ]);
    }

    public function category(Request $request, string $sectorSlug, string $categorySlug): Response
    {
        $sector = Sector::where('slug', $sectorSlug)->firstOrFail();
        $category = OfferCategory::where('slug', $categorySlug)->where('sector_id', $sector->id)->firstOrFail();

        $offers = Offer::with(['user','category'])
            ->where('offer_category_id', $category->id)
            ->where('status', 'approved')
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->get();

        return Inertia::render('marketplace/category', [
            'sector' => ['name' => $sector->name, 'slug' => $sector->slug],
            'category' => ['id' => $category->id, 'name' => $category->name, 'slug' => $category->slug],
            'offers' => $offers,
        ]);
    }

    /**
     * Lightweight categories JSON for client-side search
     */
    public function categories(Request $request): JsonResponse
    {
        $categories = OfferCategory::with(['sector:id,slug,name'])
            ->orderBy('name')
            ->get(['id','name','slug','sector_id']);
        return response()->json($categories);
    }

    /**
     * Lightweight sectors JSON for client-side use
     */
    public function sectors(Request $request): JsonResponse
    {
        $sectors = Sector::withCount(['categories'])
            ->orderBy('name')
            ->get(['id','name','slug','image_url']);
        return response()->json($sectors);
    }
}
