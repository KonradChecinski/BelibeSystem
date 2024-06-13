<?php

namespace App\Http\Controllers\System\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientTaskRequest;
use App\Http\Requests\Client\UpdateClientTaskRequest;
use App\Models\Client\Client;
use App\Models\ClientTask;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Request;

class ClientTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientTaskRequest $request, Client $client)
    {
        $clientTask = new ClientTask([
            'title' => $request->title,
            'text' => $request->text,
            "datetime" => Carbon::parse($request->datetime)->setTimezone('Europe/Warsaw'),
        ]);
        $clientTask->client()->associate($client);

        if (auth()->user()->hasPermissionTo("changeUserInClientRelation", "user")) {
            if ($request->user == null) {
                $userId = auth()->user()->id;
            } else {
                $userId = $request->user["id"];
            }
            $clientTask->user()->associate($userId);
        } else {
            $clientTask->user()->associate(auth()->user());
        }
        $clientTask->save();
    }

    public function done(Request $request, Client $client, ClientTask $clientTask)
    {
        if ($clientTask->client != $client) abort(403);

        if (auth()->user()->id != $clientTask->user->id) abort(403);

        $clientTask->update([
            'done' => Carbon::now(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientTask $clientTask)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientTask $clientTask)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientTaskRequest $request, Client $client, ClientTask $clientTask)
    {
        if ($clientTask->client != $client) abort(403);

        $clientTask->update([
            'title' => $request->title,
            'text' => $request->text,
            "datetime" => Carbon::parse($request->datetime)->setTimezone('Europe/Warsaw'),
        ]);

        if (auth()->user()->hasPermissionTo("changeUserInClientRelation", "user")) {
            if ($request->user == null) {
                $userId = auth()->user()->id;
            } else {
                $userId = $request->user["id"];
            }
            $clientTask->user()->associate($userId);
            $clientTask->save();
        }
//        $clientTask->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client, ClientTask $clientTask)
    {
        if ($clientTask->client != $client) abort(403);
        $clientTask->delete();
    }
}
