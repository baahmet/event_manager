// Importe la fonction bootstrapApplication depuis le module @angular/platform browser
// Cette fonction est utilisée pour démarrer une application Angular en mode standalone (sans NgModule)
import { bootstrapApplication } from '@angular/platform-browser';

// Importe le provider provideHttpClient depuis @angular/common/http
// Ce provider permet de configurer et fournir le service HttpClient pour l'application
import { provideHttpClient } from '@angular/common/http';

// Importe le composant racine de l'application
import { AppComponent } from './app/app.component';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';

// Bootstrap (démarre) l'application Angular
bootstrapApplication(AppComponent, {
  // Configure-les providers globaux de l'application
  providers: [
    provideHttpClient(), // Ajoute le provider HttpClient aux providers globaux
    // Cela rend le service HttpClient disponible dans toute l'application
    provideRouter(routes)
  ]
}).catch(err => console.error(err)); // Gère les erreurs potentielles lors du démarrage
