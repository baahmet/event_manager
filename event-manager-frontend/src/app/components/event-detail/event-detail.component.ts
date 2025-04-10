import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {PdfService} from '../../services/pdf.service';
import {EventService} from '../../services/event.service';
import {AuthService} from '../../services/auth.service';
import {DomSanitizer} from '@angular/platform-browser';



@Component({
  selector: 'app-event-detail',
  standalone: true,
  templateUrl: './event-detail.component.html',
  imports: [
    NgIf,
    DatePipe,
    NgForOf
  ],
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: any;
  isOrganizer = false;
  participants: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private pdfService: PdfService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {


    this.getEventDetails();
    this.loadParticipants()


  }

  getEventDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(event => {
      this.event = event;

      const currentUserId = this.authService.getCurrentUserId(); // ou user.id dans ton service d’auth
      this.isOrganizer = currentUserId === event.user_id;

      if (this.isOrganizer) {
        this.loadParticipants();
      }
    });

  }

  downloadPDF() {
    if (!this.event?.id) return;

    this.pdfService.downloadParticipantsPDF(this.event.id).subscribe((pdfBlob) => {
      const blob = new Blob([pdfBlob], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `participants_${this.event.title}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Erreur lors du téléchargement du PDF :', error);
    });
  }


  loadParticipants(): void {
    const eventId = this.event?.id;

    if (eventId) {
      this.pdfService.getEventParticipants(eventId).subscribe({
        next: (data) => {
          this.participants = data;
        },
        error: (error) => {
          console.error("Erreur lors du chargement des participants :", error);
        }
      });
    }
  }
    goBack(): void {
      this.router.navigate(['/events']);

    }
}

