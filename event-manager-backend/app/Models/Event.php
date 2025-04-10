<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    //
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'location',
        'capacity',
        'user_id'
    ];

    //Plusieur evenement peut appartenier à un utilisateur
    public function organizer()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    //un evenement  ne peut a avoir plusieur inscription
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }
}
