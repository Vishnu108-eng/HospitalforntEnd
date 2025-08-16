import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setToken(token: string, rememberMe: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('username');
    }
  }

  getUserEmail(): string {
    if (isPlatformBrowser(this.platformId)) {
      const email = localStorage.getItem('email') || sessionStorage.getItem('email');
      if (email) {
        return email;
      }

      const token = this.getToken();
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1];
          const payloadJson = atob(payloadBase64);
          const payload = JSON.parse(payloadJson);
          return payload.email || 'User';
        } catch {
          return 'User';
        }
      }
    }
    return 'User';
  }
}
