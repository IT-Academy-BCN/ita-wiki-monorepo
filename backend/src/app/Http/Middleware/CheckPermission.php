<?php

declare (strict_types= 1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission, ?string $ownershipField = null): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

      
        if (!$user->can($permission)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        
        if ($ownershipField && str_contains($permission, 'own')) {
            $resourceId = $request->route($ownershipField);
            $model = $this->getModelFromRoute($request);
            
            if ($model && $model->github_id !== $user->github_id) {
                return response()->json(['error' => 'Forbidden - Not your resource'], 403);
            }
        }

        return $next($request);
    }
    
    private function getModelFromRoute(Request $request)
    {
        $resource = $request->route('resource');
        if ($resource) {
            return $resource instanceof \App\Models\Resource
                ? $resource
                : \App\Models\Resource::find($resource);
        }

        $technicalTest = $request->route('technicalTest');
        if ($technicalTest) {
            return $technicalTest instanceof \App\Models\TechnicalTest
                ? $technicalTest
                : \App\Models\TechnicalTest::find($technicalTest);
        }
        
        return null;
    }
}
