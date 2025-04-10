<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use App\Notifications\EventRegistrationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller
{
    //Methode pour s'inscrire à un evenement
    public function register(Request $request,$eventId)
    {
        //Recuperer les données de l'utilisateur connecté

        $user=Auth::user();
        $event=Event::findOrFail($eventId);

        //verifier si l'utilisateur a déja inscrit
        if(Registration::where('user_id', $user->id)->where('event_id', $eventId)->exists())
        {
            return response()->json([
                'message'=>'Vous etes déja inscrit a cet evenement!!!'
            ],409);
        }


        //creer une inscription
        Registration::create([
            'user_id'=>$user->id,
            'event_id'=>$eventId
        ]);

        //envoyer une notification
        $user->notify(new EventRegistrationNotification($event));

        return response()->json([
            'message'=>'inscription réussie et notification envoyé!!!'
        ],201);
    }


    //method pour déinscrire a un evenement
    public function unregister(Request $request,$eventId)
    {
        $user=Auth::user();
        $Registration=Registration::where('user_id',$user->id)->where('event_id',$eventId)->first();
        if(!$Registration)
        {
            return response()->json([
                'message'=>'inscription non trouvé!'
            ],404);
        }

        $Registration->delete();
        return response()->json([
            'message'=>'désinscription avec succes!!!'
        ],200);
    }

    // RegistrationController.php
public function checkRegistration($eventId)
{
    $user = Auth::user();
    $isRegistered = Registration::where('user_id', $user->id)
                               ->where('event_id', $eventId)
                               ->exists();
    
    return response()->json($isRegistered);
}

public function participants(Request $request, $eventId)
{
    $event = Event::findOrFail($eventId);

    // Vérifie si l'utilisateur connecté est bien l'organisateur de l'événement
    if ($event->user_id !== $request->user()->id) {
        return response()->json(['message' => 'Accès refusé. Vous n\'êtes pas l\'organisateur de cet événement.'], 403);
    }

    // Récupère les participants avec les infos utilisateurs
    $participants = Registration::where('event_id', $eventId)
        ->with('user:id,name,email')
        ->get();

    return response()->json($participants);
}


    // Méthode pour récupérer les événements auxquels l'utilisateur est inscrit
    public function myRegistrations(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Non autorisé'], 401);
        }
    
        $registrations = Registration::where('user_id', $user->id)
                                    ->with(['event' => function($query) {
                                        $query->select('id', 'title', 'start_date', 'end_date', 'location', 'user_id');
                                    }])
                                    ->get()
                                    ->pluck('event');
    
        return response()->json($registrations);
    }
}
