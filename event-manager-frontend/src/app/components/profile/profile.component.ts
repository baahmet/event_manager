import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user:any;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        console.log('Erreur lors de la recuperation de l\'utilisateur',err);
      }
    });
  }


}
