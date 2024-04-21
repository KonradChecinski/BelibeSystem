<?php

namespace App\Http\Controllers\System\Client;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ClientOrderController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Client $client)
    {
        $request->session()->push('client', $client);
        return Redirect::route("b2b.dashboard");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $clientId = Helper::getClientIdToB2b();
        $request->session()->forget('client');
        return Redirect::route("system.clients.client.edit", ["id" => $clientId]);
    }
}
