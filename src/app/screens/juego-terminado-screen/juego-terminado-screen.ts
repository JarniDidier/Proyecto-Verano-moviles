import { Component } from '@angular/core';
/**
 * IMPORTANTE:
 * SHARED_IMPORTS centraliza:
 * - CommonModule
 * - FormsModule / ReactiveFormsModule
 * - RouterModule
 * - Angular Material
 * - ngx-mask
 */
import { SHARED_IMPORTS } from '../../shared/shared.imports';
/* ===== Partials standalone ===== */
import { HeaderApp } from '../../partials/header-app/header-app';
import { LeftSidebar } from '../../partials/left-sidebar/left-sidebar';
import { FooterApp } from '../../partials/footer-app/footer-app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego-terminado-screen',
  imports: [
    ...SHARED_IMPORTS,
    HeaderApp,
    LeftSidebar,
    FooterApp,
  ],
  templateUrl: './juego-terminado-screen.html',
  styleUrl: './juego-terminado-screen.scss',
})
export class JuegoTerminadoScreen {

  /* =========================================================
     ESTADO GENERAL (igual que Home / Instrucciones)
     ========================================================= */

  /** Controla opciones del sidebar */
  public isLogin = true;

  /** Controla apertura/cierre del drawer */
  public drawerOpen = false;

  /** Controla franja Licensed del footer */
  public showLicensed = false;

  /* =========================================================
     DATOS DE UI
     ========================================================= */

  public isLoading = false;

  /** Puntos obtenidos al finalizar la carrera */
  public puntosObtenidos = 1400;

  /** Premio de la promoción */
  public premio = 'Ducati Scrambler';

  constructor(
    private readonly router: Router,
  ) { }

  /* =========================================================
     DRAWER (HEADER / SIDEBAR) - MISMO PATRÓN QUE HOME
     ========================================================= */

  /** Evento emitido por el Header */
  public toggleSidebar(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  /** Evento emitido por el Sidebar */
  public closeSidebar(): void {
    this.drawerOpen = false;
  }

  /* =========================================================
     ACCIÓN PRINCIPAL
     ========================================================= */

  public irAlInicio(): void {
    if (this.isLoading) return;

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['app', 'home']);
    }, 300);
  }
}
