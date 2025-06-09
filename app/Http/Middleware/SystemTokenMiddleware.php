<?php

namespace App\Http\Middleware;

use App\Models\SystemToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SystemTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response(['Unauthorized'], 401);
        }

        $token = substr($authHeader, 7);
        $hashed = hash('sha256', $token);

        if (!SystemToken::where('token', $hashed)->exists()) {
            return response(['Unauthorized'], 401);
        }

        return $next($request);
    }
}
