import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService } from '../services/event.service';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner
  ],
  templateUrl: './my-registrations.component.html',
  styleUrls: ['./my-registrations.component.css']
})
// my-registrations.component.ts
export class MyRegistrationsComponent implements OnInit {
  registeredEvents: any[] = [];
  isLoading = true;

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMyRegistrations();
  }

  loadMyRegistrations(): void {
    this.eventService.getMyRegistrations().subscribe({
      next: (events) => {
        this.registeredEvents = events.map((event: any) => ({
          id: event.id,
          title: event.title,
          start_date: event.start_date,
          end_date: event.end_date,
          location: event.location,
          organizer_id: event.user_id, // Correspond à user_id dans la réponse
          // Champs optionnels avec valeurs par défaut
          description: event.description || 'Description non disponible',
          capacity: event.capacity || 0,
          organizer: event.organizer || { id: event.user_id, name: 'Organisateur' }
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  unregister(eventId: number): void {
    this.eventService.unregisterFromEvent(eventId).subscribe({
      next: () => {
        this.registeredEvents = this.registeredEvents.filter(e => e.id !== eventId);
        this.snackBar.open('Désinscription réussie', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la désinscription', 'Fermer', { duration: 3000 });
      }
    });
  }




}
