import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  templateUrl: './edit-event.component.html',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;
  eventId!: number;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadEventData();
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.minLength(10)]], //
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      capacity: [1, [Validators.required, Validators.min(1)]]
    }, { validators: this.validateDates });
  }

  validateDates(group: AbstractControl) {
    const start = group.get('start_date')?.value;
    const end = group.get('end_date')?.value;

    if (!start || !end) return null;

    return new Date(start) >= new Date(end) ? { dateInvalid: true } : null;
  }

  private loadEventData(): void {
    this.isLoading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        const formattedEvent = {
          ...event,
          start_date: this.formatDateForInput(event.start_date),
          end_date: this.formatDateForInput(event.end_date)
        };
        this.eventForm.patchValue(formattedEvent);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de l\'événement';
        this.isLoading = false;
      }
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.eventForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe({
      next: () => {
        this.router.navigate(['/events', this.eventId]); // Redirige vers la page de détail
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.errorMessage = 'Vous n\'êtes pas autorisé à modifier cet événement';
        } else {
          this.errorMessage = 'Erreur lors de la mise à jour';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/events', this.eventId]);
  }
}
