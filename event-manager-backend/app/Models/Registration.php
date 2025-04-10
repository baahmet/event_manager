<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    //
    protected $fillable = ['user_id', 'event_id'];

    //Un evenement peut avoir plusieurs inscriptions
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    //Un utilisateur peut s'inscrire a plusieurs evenements differents
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

