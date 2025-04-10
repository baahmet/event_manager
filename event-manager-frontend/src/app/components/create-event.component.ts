import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {EventService} from '../services/event.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-create-event',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  event_createForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventService: EventService,

  ) {
    this.event_createForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]]
    }, { validators: this.dateValidator });
  }
  dateValidator(group: AbstractControl): { [key: string]: any } | null {
    const start = group.get('start_date')?.value;
    const end = group.get('end_date')?.value;
    if (start && end && new Date(start) >= new Date(end)) {
      return { dateInvalid: true };
    }
    return null;
  }


  onSubmit() {
    if (this.event_createForm.valid) {
      this.eventService.createEvent(this.event_createForm.value).subscribe({
        next: () => {
          alert("Événement créé avec succès !");
          this.router.navigate(['/events']);
        },
        error: err => {
          console.log("Erreur lors de la création", err);
          alert("Erreur lors de la création");
        }
      });
    } else {
      alert("Veuillez remplir correctement tous les champs !");
    }
  }



}
