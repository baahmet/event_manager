import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {ProfileComponent} from './components/profile/profile.component';
import {authGuard} from './components/guards/auth.guard';
import {guestGuard} from './components/guards/guest.guard';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {EventsComponent} from './components/events/events.component';
import {CreateEventComponent} from './components/create-event.component';
import {EventDetailComponent} from './components/event-detail/event-detail.component';
import {EditEventComponent} from './events/edit-event.component';
import {MyRegistrationsComponent} from './components/my-registrations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Routes publiques
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  // Routes protégées
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  // Routes des événements
  { path: 'events', component: EventsComponent },
  { path: 'create-event', component: CreateEventComponent, canActivate: [authGuard] },

  // Route dédiée aux inscriptions utilisateur
  { path: 'my-registrations', component: MyRegistrationsComponent, canActivate: [authGuard] },

  // Routes imbriquées pour les détails/édition
  {
    path: 'events/:id',
    children: [
      { path: '', component: EventDetailComponent }, // /events/1
      { path: 'edit', component: EditEventComponent, canActivate: [authGuard] } // /events/1/edit
    ]
  }
];
