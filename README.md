# 📅 Event Manager - Application Complète

Ce projet est une **application web complète** de gestion d’événements, comprenant :

- 🔙 Un **backend** développé avec **Laravel 12**
- 🔜 Un **frontend** développé avec **Angular 17**

## 👨‍💻 Membres du projet

- **Mouhamet Lamine Ba**
- **Mouhamadou Al Bachir Ba**

---

## 🧠 Objectif du projet

Créer une plateforme permettant :

- La gestion sécurisée des utilisateurs
- La création et la publication d’événements
- L’inscription des utilisateurs aux événements
- L’envoi d’emails de confirmation
- La génération de fichiers PDF des participants
- L’affichage des événements dans un calendrier interactif

---

## 📂 Structure du dépôt

```bash
gestionnaire_evenements/
│
├── event-manager-backend/     # Backend Laravel
│
└── event-manager-frontend/    # Frontend Angular
```

---

## 🔧 Technologies principales

### Backend (Laravel)
- Laravel 12
- PHP 8.2
- Laravel Sanctum (authentification)
- Laravel Mail / Notification
- Laravel DomPDF (PDF)
- MySQL (XAMPP)
- Postman (tests)

### Frontend (Angular)
- Angular 17 (standalone)
- Angular HttpClient
- Angular Reactive Forms
- FullCalendar
- Bootstrap

---

## 🚀 Installation du projet

### 📦 Backend (Laravel)

```bash
cd event-manager-backend
composer install
cp .env.example .env
php artisan key:generate
```

Configurer la base de données MySQL dans `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=event_manager
DB_USERNAME=root
DB_PASSWORD=
```

Puis lancer les migrations :

```bash
php artisan migrate
php artisan serve
```

---

### 🌐 Frontend (Angular)

```bash
cd event-manager-frontend
npm install
ng serve
```

Accessible via : `http://localhost:4200`

---

## 🔐 Fonctionnalités principales

### 🎯 Backend
- API RESTful pour les événements, utilisateurs, inscriptions
- Authentification avec Sanctum
- Notifications Email à l’inscription
- Génération PDF (liste des participants)
- Vérification des rôles utilisateurs (admin / utilisateur)

### 💻 Frontend
- Authentification (login / register / logout)
- Dashboard utilisateur
- Création / édition / suppression d'événements
- Vue calendrier FullCalendar
- Liste des événements
- Inscription et désinscription
- Téléchargement PDF (organisateur uniquement)
- Affichage dynamique des participants
- Séparation des composants + services

---

## 📋 Endpoints API principaux

| Méthode | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/register`               | Inscription |
| POST   | `/api/login`                  | Connexion |
| POST   | `/api/logout`                 | Déconnexion |
| GET    | `/api/user`                   | Récupération utilisateur |
| GET    | `/api/events`                 | Liste événements |
| POST   | `/api/events`                 | Créer un événement |
| PUT    | `/api/events/{id}`            | Modifier un événement |
| DELETE | `/api/events/{id}`            | Supprimer un événement |
| POST   | `/api/events/{id}/register`   | S'inscrire à un événement |
| DELETE | `/api/events/{id}/unregister` | Annuler son inscription |
| GET    | `/api/events/{id}/participants` | Liste des participants |
| GET    | `/api/events/{id}/pdf`        | PDF des participants |

---

## 📜 Licence

Projet académique libre d’utilisation à des fins pédagogiques.