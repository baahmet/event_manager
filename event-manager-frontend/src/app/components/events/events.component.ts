import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { Router, RouterModule, RouterLink } from '@angular/router'; // Ajout de RouterModule
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon'; // Pour les icônes

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    MatTooltip,
    MatIconModule
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'] // Correction de styleUrl à styleUrls
})
export class EventsComponent implements OnInit {
  events: any[]=[];
  currentUserId: number = 0;
  registeredEvents: Set<number> = new Set(); // Pour stocker les IDs des événements où l'utilisateur est inscrit



  constructor(private eventService:EventService, private snackBar: MatSnackBar,private router: Router) {}

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id;

    this.eventService.getEvents().subscribe({
    next: (res) => {
      console.log('Réponse reçue depuis l\'API :', res);
      this.events=res[0];
      this.checkUserRegistrations();
    },
    error: (err) => {
      console.error('Erreur lors du chargement des evenements',err);
    }
  })

  }

  deleteEvent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== id);
          this.showSnackbar('Événement supprimé avec succès', 'success');
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.showSnackbar(err.message, 'error');
        }
      });
    }
  }

  private showSnackbar(message: string, type: 'success'|'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`${type}-snackbar`]
    });
  }

  checkUserRegistrations(): void {
    if (!this.currentUserId) return;

    this.events.forEach(event => {
      this.eventService.checkRegistration(event.id).subscribe({
        next: (isRegistered) => {
          if (isRegistered) {
            this.registeredEvents.add(event.id);
          }
        }
      });
    });
  }

  registerToEvent(eventId: number): void {
    this.eventService.registerToEvent(eventId).subscribe({
      next: () => {
        this.registeredEvents.add(eventId);
        this.showSnackbar('Inscription réussie!', 'success');
      },
      error: (err) => {
        this.showSnackbar(err.error?.message || 'Erreur lors de l\'inscription', 'error');
      }
    });
  }

  unregisterFromEvent(eventId: number): void {
    this.eventService.unregisterFromEvent(eventId).subscribe({
      next: () => {
        this.registeredEvents.delete(eventId);
        this.showSnackbar('Désinscription réussie!', 'success');
      },
      error: (err) => {
        this.showSnackbar(err.error?.message || 'Erreur lors de la désinscription', 'error');
      }
    });
  }


}
