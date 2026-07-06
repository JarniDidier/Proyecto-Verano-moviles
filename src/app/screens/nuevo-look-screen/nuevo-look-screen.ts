import { Component, OnInit } from '@angular/core';
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

/**
 * Modelo de cada lente disponible para probar el "nuevo look"
 */
type LenteItem = {
  id: string;
  nombre: string;
  img: string;
};

@Component({
  selector: 'app-nuevo-look-screen',
  imports: [
    ...SHARED_IMPORTS,
    HeaderApp,
    LeftSidebar,
    FooterApp
  ],
  templateUrl: './nuevo-look-screen.html',
  styleUrl: './nuevo-look-screen.scss',
})
export class NuevoLookScreen implements OnInit {

  /* =========================================================
     ESTADO GENERAL (igual que Home)
     ========================================================= */

  /** Controla opciones del sidebar */
  public isLogin = true;

  /** Controla apertura/cierre del drawer */
  public drawerOpen = false;

  /** Controla franja Licensed del footer (visible en esta pantalla) */
  public showLicensed = true;

  /* =========================================================
     DATOS DE UI
     ========================================================= */

  public isLoading = false;

  /** Lente actualmente seleccionado */
  public lenteSeleccionado: string | null = null;

  /** Catálogo de lentes disponibles para "probar" */
  public lentes: LenteItem[] = [];

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.cargarLentes();
  }

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
     SELECCIÓN DE LENTE
     ========================================================= */

  /** Marca el lente elegido por el usuario */
  public seleccionarLente(id: string): void {
    this.lenteSeleccionado = id;
  }

  /* =========================================================
     ACCIONES PRINCIPALES
     ========================================================= */

  /** Omite la selección de lentes y continúa el flujo */
  public omitir(): void {
    if (this.isLoading) return;
    this.router.navigate(['app', 'juego-simulado']);
  }

  /** Confirma el lente elegido y continúa el flujo */
  public usarLentes(): void {
    if (this.isLoading || !this.lenteSeleccionado) return;

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['app', 'juego-simulado'], {
        state: { lenteSeleccionado: this.lenteSeleccionado ?? undefined },
      });
    }, 400);
  }

  /* =========================================================
     DATOS (MOCK / API)
     ========================================================= */

  private cargarLentes(): void {
    // Ajuste las rutas/nombres si su backend entrega el catálogo dinámicamente
    this.lentes = [
      { id: 'carduc-001', nombre: 'CARDUC 001/S', img: 'assets/images/lentes-ducati-1.png' },
      { id: 'carduc-002', nombre: 'CARDUC 002/S', img: 'assets/images/lentes-ducati-2.png' },
      { id: 'carduc-003', nombre: 'CARDUC 003/S', img: 'assets/images/lentes-ducati-3.png' },
    ];
  }
}
