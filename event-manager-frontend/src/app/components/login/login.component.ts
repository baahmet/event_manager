import { Component } from '@angular/core';

import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email='';
  password='';
  // injection du service d'authentification
  constructor(private authService:AuthService, private router:Router) { }

  login() {
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response && response.token && response.user) {
          // ✅ Stockage du token et de l'utilisateur
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          // ✅ Redirection vers dashboard
          this.router.navigate(['/dashboard']);
        } else {
          alert('Erreur : réponse invalide du serveur');
        }
      },
      error: (err) => {
        alert('Erreur de connexion : ' + (err.error?.message || 'Vérifiez vos identifiants'));
      }
    });
  }

}
