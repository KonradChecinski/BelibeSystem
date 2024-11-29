<?php

use App\Helpers\Helper;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

//Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//    return (int) $user->id === (int) $id;
//});


Broadcast::channel('cart.{clientId}', function ($user, $clientId) {
    return Helper::getClientIdToB2b() === (int)$clientId;
}, ['guards' => ['user', 'client']]);

Broadcast::channel('cart.{clientId}.product.{productId}', function ($user, $clientId, $productId) {
    dd($user, $clientId, $productId, Helper::getClientIdToB2b());
    return Helper::getClientIdToB2b() === (int)$clientId;
}, ['guards' => ['user', 'client']]);

Broadcast::channel('cart.{clientId}.updated', function ($user, $clientId) {
    return Helper::getClientIdToB2b() === (int)$clientId;
}, ['guards' => ['user', 'client']]);

Broadcast::channel('cart.summary.{clientId}', function ($user, $clientId) {
    return Helper::getClientIdToB2b() === (int)$clientId;
}, ['guards' => ['user', 'client']]);


