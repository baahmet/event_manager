<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Nette\Schema\ValidationException;

class AuthController extends Controller
{
    //recuperer les infos de l'utilisateur
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    //inscription d'un utilisateur
    public function register(Request $request)
    {
        //valider les données entrées
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',

        ]);

        //creation d'un utilisateur
        $user=User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'role'=>'utilisateur'
        ]);

        //generer un token pour l'authentification de l'api avec sanctum
        $token=$user->createToken('Auth_token')->plainTextToken;

        //reponse en json avec le token
        return response()->json([
            'message' => 'Utilisateur inscrit avec succès',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    //Connexion d'un utilisateur avec un compte creer
    public function login(Request $request)
    {
        //valider les données entrées
        $request->validate([
            'email'=>'required|string|email',
            'password'=>'required|string'
        ]);

        //verifier si email entré est correcte
        $user=User::where('email',$request->email)->first();
        if(!$user || !Hash::check($request->password,$user->password)){
            throw ValidationException::withMessage([
                'email' => ['Les informations de connexion sont incorrectes.'],
            ]);
        }

        //generer un token d'authentification
        $token=$user->createToken('Auth_token')->plainTextToken;

        //reponse avec les infos sur l'utilisateur et le token
        return response()->json([
            'message'=>'connexion avec success',
            'user' => $user,
            'token' => $token,
        ]);

    }

    //Déconnexion d'un utilisateur
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'Déconnexion réussie!'
        ]);
    }
}
