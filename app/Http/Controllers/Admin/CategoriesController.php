<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OfferCategory;
use App\Models\Sector;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CategoriesController extends Controller
{
    protected function ensureAdmin(Request $request): void
    {
        if (!($request->user()?->is_admin)) {
            abort(403);
        }
    }

    public function index(Request $request): Response
    {
        $this->ensureAdmin($request);
        $sectors = Sector::orderBy('name')->get(['id','name','slug']);
        $categories = OfferCategory::with('sector:id,name')
            ->orderBy('name')
            ->get(['id','name','slug','sector_id','image_url','created_at']);
        return Inertia::render('admin/categories/index', [
            'sectors' => $sectors,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'slug' => ['nullable','string','max:255'],
            'sector_id' => ['required','exists:sectors,id'],
            'image_url' => ['nullable','string','max:2048'],
        ]);
        $slug = $validated['slug'] ?? Str::slug($validated['name']);
        // ensure slug uniqueness within sector
        $base = $slug; $i = 1;
        while (OfferCategory::where('slug', $slug)->where('sector_id', $validated['sector_id'])->exists()) {
            $slug = $base.'-'.$i++;
        }
        OfferCategory::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'sector_id' => $validated['sector_id'],
            'image_url' => $validated['image_url'] ?? null,
        ]);
        return back()->with('success', 'Category created');
    }

    public function destroy(Request $request, OfferCategory $category): RedirectResponse
    {
        $this->ensureAdmin($request);
        $category->delete();
        return back()->with('success', 'Category deleted');
    }

    public function update(Request $request, OfferCategory $category): RedirectResponse
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'slug' => ['nullable','string','max:255'],
            'sector_id' => ['required','exists:sectors,id'],
            'image_url' => ['nullable','string','max:2048'],
        ]);
        $slug = $validated['slug'] ?? Str::slug($validated['name']);
        $base = $slug; $i = 1;
        while (OfferCategory::where('slug', $slug)
            ->where('sector_id', $validated['sector_id'])
            ->where('id', '!=', $category->id)
            ->exists()) {
            $slug = $base.'-'.$i++;
        }
        $payload = [
            'name' => $validated['name'],
            'slug' => $slug,
            'sector_id' => $validated['sector_id'],
        ];
        if ($request->filled('image_url') && trim((string) $request->input('image_url')) !== '') {
            $payload['image_url'] = $request->input('image_url');
        }
        $category->update($payload);
        return back()->with('success', 'Category updated');
    }

    /**
     * Bulk move categories to another sector.
     */
    public function bulkMove(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'sector_id' => ['required', 'exists:sectors,id'],
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:offer_categories,id'],
        ]);

        $targetSectorId = $validated['sector_id'];
        $ids = $validated['ids'];

        // Ensure slug uniqueness within the target sector when moving
        foreach (OfferCategory::whereIn('id', $ids)->get() as $cat) {
            $slug = $cat->slug;
            $base = $slug; $i = 1;
            while (OfferCategory::where('slug', $slug)
                ->where('sector_id', $targetSectorId)
                ->where('id', '!=', $cat->id)
                ->exists()) {
                $slug = $base.'-'.$i++;
            }
            $cat->update([
                'sector_id' => $targetSectorId,
                'slug' => $slug,
            ]);
        }

        return back()->with('success', 'Selected categories moved');
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:offer_categories,id'],
        ]);

        OfferCategory::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Selected categories deleted');
    }
}
