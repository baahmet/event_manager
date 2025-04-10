import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }


  constructor(private http: HttpClient) {}

  downloadParticipantsPDF(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/pdf`, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }
  getEventParticipants(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/participants`, {
      headers : this.getAuthHeaders()
    });
  }


}
