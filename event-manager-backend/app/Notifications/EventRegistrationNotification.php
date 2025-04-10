<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventRegistrationNotification extends Notification
{
    use Queueable; //permet de mettre la notification en en queue de la file d'attente
    protected $event; //stoke les données de l'evenement
    /**
     * Create a new notification instance.
     */
    //constructeur-initialise l'evenement
    //$event objet ou array contenant les infos de l'evenement
    public function __construct($event)
    {
        //
        $this->event = $event;//injection des données de l'evenement
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    //definir les canaux de notification $nofifiable l'entité a notifier(generalement un User)
    //listes des canaux utilisée(email+database)
    public function via($notifiable)
    {
        return ['mail','database']; //envoyer un email et un enrigistrement en base
    }

    /**
     * Get the mail representation of the notification.
     */
    //construire l'email de notification
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Confirmation d\'inscription a '.$this->event->title) //objet
            ->greeting('Bonjour,' .$notifiable->name . ',') //salutation
            ->line('Vous etes inscrit a l\'evenement '.$this->event->title . '.' ) //ligne 1
            ->line('Date : '.$this->event->date) //ligne 2
            ->line('Merci de votre participation !!!') //ligne 3
            ->action('Voir l\'evenement', url('/events/'.$this->event->id))//Bouton
            ->line('A Bientot !!!'); //Signature
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    //formatte les données pour le stockage en base
    //
    public function toArray($notifiable)
    {
        return [
            //
            'event_id' => $this->event->id, //ID pour reference
            'event_title' => $this->event->title, //titre clair
            'message' => 'vous êtes inscrit a l\'evenement '.$this->event->title .'le '
                . $this->event->date,//message lisible
        ];
    }
}
