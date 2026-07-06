import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { RegistroUser } from '../../services/usuarios-service';
import { Router } from '@angular/router';
import { HeaderApp } from '../../partials/header-app/header-app';
import { LeftSidebar } from '../../partials/left-sidebar/left-sidebar';
import { FooterApp } from '../../partials/footer-app/footer-app';

@Component({
  selector: 'app-perfil-usuario-screen',
  imports: [...SHARED_IMPORTS, HeaderApp, LeftSidebar, FooterApp],
  templateUrl: './perfil-usuario-screen.html',
  styleUrl: './perfil-usuario-screen.scss',
})
export class PerfilUsuarioScreen implements OnInit {

  public readonly storageKey = 'usuarioRegistrado';
  public readonly storageListKey = 'usuariosRegistrados';
  public usuarioPerfil: RegistroUser | null = null;
  public fotoInicial = 'U';
  public isLogin = true;
  public drawerOpen = false;

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    const perfil = this.leerPerfil();

    if (!perfil) {
      this.usuarioPerfil = null;
      return;
    }

    this.usuarioPerfil = perfil;
    this.fotoInicial = this.obtenerIniciales(perfil);
  }

  public toggleSidebar(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  public closeSidebar(): void {
    this.drawerOpen = false;
  }

  public irAlRegistro(): void {
    this.router.navigate(['/registro']);
  }

  private leerPerfil(): RegistroUser | null {
    const datosGuardados = localStorage.getItem(this.storageKey);

    if (datosGuardados) {
      try {
        return JSON.parse(datosGuardados) as RegistroUser;
      } catch {
        localStorage.removeItem(this.storageKey);
      }
    }

    const usuariosGuardados = localStorage.getItem(this.storageListKey);

    if (!usuariosGuardados) {
      return null;
    }

    try {
      const usuarios = JSON.parse(usuariosGuardados) as RegistroUser[];
      return usuarios[usuarios.length - 1] ?? null;
    } catch {
      return null;
    }
  }

  private obtenerIniciales(usuario: RegistroUser): string {
    const nombre = usuario.first_name?.trim() || 'U';
    const apellido = usuario.last_name?.trim() || '';
    return `${nombre.charAt(0)}${apellido.charAt(0) || ''}`.toUpperCase();
  }

  public get edadTexto(): string {
    if (!this.usuarioPerfil?.edad) {
      return 'No registrada';
    }

    return `${this.usuarioPerfil.edad} años`;
  }

  public get gradoTexto(): string {
    if (!this.usuarioPerfil?.grado_estudios) {
      return 'No registrado';
    }

    const grados: Record<string, string> = {
      preparatoria: 'Preparatoria',
      licenciatura: 'Licenciatura',
      maestria: 'Maestría',
      doctorado: 'Doctorado',
    };

    return grados[this.usuarioPerfil.grado_estudios] || this.usuarioPerfil.grado_estudios;
  }
}
