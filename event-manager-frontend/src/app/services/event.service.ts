import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`, {
      headers: this.getAuthHeaders()
    });

  }



  createEvent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((res: any) => {
        return Array.isArray(res) && res.length > 0 ? res[0] : res;
      })
    );
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete(`${this.apiUrl}/events/${id}`, {
      headers: this.getAuthHeaders(),
      observe: 'response'
    }).pipe(
      map(response => {
        if (response.status !== 204) {
          throw new Error('Réponse inattendue du serveur');
        }
      }),
      catchError(error => {
        let errorMessage = 'Erreur inconnue';

        if (error.status === 403) {
          errorMessage = 'Action non autorisée';
        } else if (error.status === 404) {
          errorMessage = 'Événement non trouvé';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        throw new Error(errorMessage);
      })
    );
  }


  updateEvent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 403) {
          throw new Error('Vous n\'êtes pas autorisé à modifier cet événement');
        }
        throw error;
      })
    );
  }

  registerToEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/${eventId}/register`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  unregisterFromEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${eventId}/unregister`, {
      headers: this.getAuthHeaders()
    });
  }

// Ajoutez une méthode pour vérifier l'inscription
  checkRegistration(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/events/${eventId}/check-registration`, {
      headers: this.getAuthHeaders()
    });
  }

  getMyRegistrations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-registrations`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur API:', error);
        if (error.status === 401) {
          // Gérer l'erreur d'authentification
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return throwError(() => error);
      })
    );
  }


}
