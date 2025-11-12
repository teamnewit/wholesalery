<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sector;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SectorsController extends Controller
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
        $sectors = Sector::orderBy('name')->get(['id','name','slug','image_url','created_at']);
        return Inertia::render('admin/sectors/index', [
            'sectors' => $sectors,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'slug' => ['nullable','string','max:255','unique:sectors,slug'],
            'image_url' => ['nullable','string','max:2048'],
        ]);
        $slug = $validated['slug'] ?? Str::slug($validated['name']);
        // if generated slug exists, append number
        $base = $slug; $i = 1;
        while (Sector::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }
        Sector::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'image_url' => $validated['image_url'] ?? null,
        ]);
        return back()->with('success', 'Sector created');
    }

    public function destroy(Request $request, Sector $sector): RedirectResponse
    {
        $this->ensureAdmin($request);
        $sector->delete();
        return back()->with('success', 'Sector deleted');
    }

    public function update(Request $request, Sector $sector): RedirectResponse
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'slug' => ['nullable','string','max:255'],
            'image_url' => ['nullable','string','max:2048'],
        ]);
        $slug = $validated['slug'] ?? \Illuminate\Support\Str::slug($validated['name']);
        // ensure unique slug excluding current sector
        $base = $slug; $i = 1;
        while (Sector::where('slug', $slug)->where('id', '!=', $sector->id)->exists()) {
            $slug = $base.'-'.$i++;
        }
        $sector->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'image_url' => $validated['image_url'] ?? $sector->image_url,
        ]);
        return back()->with('success', 'Sector updated');
    }
}
