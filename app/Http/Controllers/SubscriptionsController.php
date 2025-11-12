<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class SubscriptionsController extends Controller
{
    public function select(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan' => ['required', 'in:free,starter,elite'],
        ]);

        $user = $request->user();
        $user->plan = $validated['plan'];
        $user->save();

        return back()->with('success', 'Plan updated to ' . ucfirst($validated['plan']) . '.');
    }
}
