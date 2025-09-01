<?php

namespace App\Http\Controllers;

use App\Models\Client\Client;
use App\Models\EmailLog;
use App\Http\Requests\StoreEmailLogRequest;
use App\Http\Requests\UpdateEmailLogRequest;
use Inertia\Inertia;

class EmailLogController extends Controller
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
    public function store(StoreEmailLogRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(EmailLog $emailLog)
    {
        $html = str_replace(
            ['<a ', '<form '],
            ['<a style="pointer-events:none;cursor:default;text-decoration:none;color:inherit;" ', '<form style="pointer-events:none;" '],
            $emailLog->body
        );

        return response($html)->header('Content-Type', 'text/html');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmailLog $emailLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmailLogRequest $request, EmailLog $emailLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmailLog $emailLog)
    {
        //
    }

    public function showClintEmails(Client $client)
    {
        return Inertia::render("System/Clients/EmailLog", [
            "client" => $client,
            "emails" => $client->emailLogs()->orderBy("sent_at", "desc")->get(),
        ]);
    }
}
