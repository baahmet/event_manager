<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function() {
    return response()->json(['message' => 'API fonctionne !']);
});
Route::post('/register',[AuthController::class, 'register']); //inscription
Route::post('/login',[AuthController::class, 'login']); //connexion

Route::middleware('auth:sanctum')->group(function() {

   Route::post('/logout',[AuthController::class, 'logout']); //Déconnexion
   Route::get('/events',[EventController::class,'index']);//affichage de tous les evenements
   Route::post('/events',[EventController::class,'store']);//creation d'un evenement
   Route::get('/events/{event}',[EventController::class,'show']);//affichage d'un evenement
   Route::put('/events/{event}',[EventController::class,'update']);//mise à jour d'un evenement
   Route::delete('/events/{event}',[EventController::class,'destroy']);//suppression d'un evenement
   Route::post('/events/{eventId}/register',[RegistrationController::class,'register']);//s'inscrire à un evenement
   Route::delete('events/{eventId}/unregister',[RegistrationController::class,'unregister']);//annuler une inscription
   Route::get('/my-registrations',[RegistrationController::class,'myRegistrations']);//
   Route::get('/events/{eventId}/check-registration', [RegistrationController::class, 'checkRegistration']);
   Route::get('events/{eventId}/participants',[RegistrationController::class,'participants']);//afficher les participants a un evenement
   Route::get('events/{id}/pdf',[PDFController::class,'generatePDF']);
   Route::get('/user', [AuthController::class, 'user']);//recuperer les infos de l'utilisateur
});
