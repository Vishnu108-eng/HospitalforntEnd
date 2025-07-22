import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  userDropdownOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.userDropdownOpen = false;
    this.router.navigate(['/login']);
  }
}