import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet,RouterLink,RouterLinkActive, Router } from '@angular/router';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/data-access/auth.service';

@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [RouterLink,RouterOutlet,RouterLinkActive,CommonModule],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent implements OnInit {
  private _aurhState = inject(AuthStateService);
  private _router = inject(Router);
  isLoggedIn = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn(); // Verifica si está logueado al iniciar
  }

  async logout(){
    await this._aurhState.logOut();
    this._router.navigateByUrl('/inicio');
    this.isLoggedIn = false;
  };
}
