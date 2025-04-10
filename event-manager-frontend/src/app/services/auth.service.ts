import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
//une seule instance sera créée et partagée dans toute l'application
@Injectable({
  providedIn: 'root'
})

export class AuthService {
 //Url de base de l'api du backend
  private apiUrl='http://127.0.0.1:8000/api';
  //injection du service httpclient dans le constructeur
  constructor(private http:HttpClient) { }



  //methode pour l'inscription d'un nouvel utilisateur
  //user objet contenant les données de l'utilisateur
  //obervable avec la reponse du serveur
  register(user:any):Observable<any>
  {
    //envoi une requete a l'endpoint/register
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  //Methode pour la connexion d'un utilisateur
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }


  //Methode pour la déconnexion d'un utilisateur
  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }



  //Methode pour recuperer les infos de l'utilisateur
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getCurrentUserId(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.id ?? null;
    }
    return null;
  }



}
