import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { HeaderApp } from '../../partials/header-app/header-app';
import { LeftSidebar } from '../../partials/left-sidebar/left-sidebar';
import { FooterApp } from '../../partials/footer-app/footer-app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego-simulado-screen',
  imports: [...SHARED_IMPORTS, HeaderApp, LeftSidebar, FooterApp],
  templateUrl: './juego-simulado-screen.html',
  styleUrl: './juego-simulado-screen.scss',
})
export class JuegoSimuladoScreen implements OnInit {
  public isLogin = true;
  public drawerOpen = false;
  public showLicensed = false;
  public lenteSeleccionado: string | null = null;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { lenteSeleccionado?: string } | undefined;
    this.lenteSeleccionado = state?.lenteSeleccionado ?? null;
  }

  public toggleSidebar(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  public closeSidebar(): void {
    this.drawerOpen = false;
  }

  public irAlFinal(): void {
    this.router.navigate(['app', 'juego-terminado']);
  }
}
