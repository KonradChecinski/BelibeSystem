<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectWWW
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (str_starts_with($request->getHost(), 'www.')) {
            $host = substr($request->getHost(), 4);
            $request->headers->set('HOST', $host);

            return redirect()->to($request->getScheme() . '://' . $host . $request->getRequestUri());
        }

        return $next($request);
    }

}
