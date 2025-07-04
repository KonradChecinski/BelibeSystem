<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShopsApiExecuteMMDocumentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopsApiController extends Controller
{
    /**
     * Execute a document in the shops API.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function executeMMDocument(ShopsApiExecuteMMDocumentRequest $request)
    {
        $document = DB::connection("subiekt")->table("dok__Dokument")
            ->where("dok_id", $request->input('document_id'))
            ->where("dok_typ", 9) //typ 9 to MM (magazynowy)
            ->where("dok_Status", 4) //tylko zrealizowane na magazynie źródłowym
            ->get();

        dd($document);

        return response()->json([
            'message' => 'Document executed successfully.',
            'data' => $request->all(),
        ]);
    }
}
