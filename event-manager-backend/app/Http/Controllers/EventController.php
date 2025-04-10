<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //recupere et retourne tous les evenements
    public function index()
    {
        //charger tous les evenements avec leurs organisateurs (relation organizer dans Event.php)
        return response()->json([Event::with('organizer')->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    //creation d'un nouvel evenement
    public function store(Request $request)
    {
        //valider les données entrées
       $validatedData=$request->validate([
           'title' => 'required|string|max:255',
           'description' => 'nullable|string',
           'start_date'=>'required|date',
           'end_date'=>'required|date|after_or_equal:start_date',
           'location'=>'required|string|max:255',
           'capacity'=>'required|integer|min:1',

       ]);

       //cretion d'un evenement avec ID de l'utilisateur connecté comme l'organisateur
        $event=Event::create([
            'title'=>$validatedData['title'],
            'description'=>$validatedData['description'],
            'start_date'=>$validatedData['start_date'],
            'end_date'=>$validatedData['end_date'],
            'location'=>$validatedData['location'],
            'capacity'=>$validatedData['capacity'],
            'user_id'=>Auth::id() //l'organisateur est l'utilisateur connecté
        ]);

        // Création de l'événement avec l'ID de l'utilisateur connecté comme organisateur
        return response()->json([$event],201);
    }

    /**
     * Display the specified resource.
     */
    //afficher un evenement specifique
    public function show(Event $event)
    {
        //charger l'organisateur de l'evenement et retourne l'evenement sous format json
        return response()->json([$event->load('organizer')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //verifier si ID de l'utilisateur est identique Id de l'organisateur
        if($event->user_id != Auth::id()){
            return response()->json([
                'message'=>'Unauthorized'
            ],403);
        }

        //validation des données (certains champs sont optionnels grâce à sometimes
        $validatedData=$request->validate([
            'title'=>'sometimes|string|max:255',
            'description'=>'sometimes|nullable|string',
            'start_date'=>'sometimes|date',
            'end_date'=>'sometimes|date|after_or_equal:start_date',
            'location'=>'sometimes|string|max:255',
            'capacity'=>'sometimes|integer|min:1'

        ]);

        //mise à jour de l'evenement
        $event->update($validatedData);

        //charger l'organisateur de l'evenement et retourner l'evenement
        return response()->json([$event->load('organizer')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Charge la relation organizer explicitement
        $event = Event::with('organizer')->find($id);
    
        // Vérifie l'existence de l'événement
        if (!$event) {
            return response()->json([
                'message' => 'Événement non trouvé'
            ], 404);
        }
    
        // Vérifie l'existence de l'organisateur
        if (!$event->organizer) {
            return response()->json([
                'message' => 'Organisateur introuvable pour cet événement'
            ], 500);
        }
    
        // Vérifie les permissions
        if ($event->organizer->id != auth()->id()) {
            return response()->json([
                'message' => 'Action non autorisée : vous n\'êtes pas l\'organisateur'
            ], 403);
        }
    
        // Suppression
        $event->delete();
    
        return response()->noContent(); // HTTP 204
    }
}

