<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PDFController extends Controller
{
    /**
     * Génère un PDF des inscriptions pour un événement
     *
     * @param int $id ID de l'événement
     * @return \Illuminate\Http\Response
     */
    public function generatePDF($id)
    {
        // 1. Récupération de l'événement avec gestion d'erreur
        
        $event = Event::findOrFail($id);

        // 2. Récupération des inscriptions avec les utilisateurs associés
        $registrations = Registration::where('event_id', $id)
            ->with('user') // Charge la relation 'user' pour éviter les requêtes N+1
            ->get();

        // 3. Génération du PDF avec les données
        $pdf = Pdf::loadView('pdf.registrations', [
            'event' => $event,
            'registrations' => $registrations
        ]);

        // 4. Téléchargement du PDF avec un nom de fichier dynamique
        return $pdf->download("inscriptions_{$event->title}.pdf");
    }
}
