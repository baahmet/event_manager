import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // Correction de la syntaxe des validateurs
  registerForm: FormGroup = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]]
  }, {
    validators: this.passwordsMatch
  });

  // Validateur personnalisé
  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const password_confirmation = form.get('password_confirmation')?.value;

    return password === password_confirmation
      ? null
      : {mismatch: true};
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          alert('Inscription réussie ! Connectez vous maintenant.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log('Erreur d\'inscription', err);
          alert('Erreur lors de l\'inscription');
        }
      });
    }
  }
}
