import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { RegistroErrors, RegistroUser, UsuariosService } from '../../services/usuarios-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-screen',
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro-screen.html',
  styleUrl: './registro-screen.scss',
})
export class RegistroScreen implements OnInit {

  private readonly storageKey = 'usuarioRegistrado';
  private readonly storageListKey = 'usuariosRegistrados';

  public user!: RegistroUser;
  public errors: RegistroErrors = {};
  public isLoading = false;

  /* Visibilidad contraseñas */
  public hide_1 = true;
  public inputType_1: 'password' | 'text' = 'password';

  public hide_2 = true;
  public inputType_2: 'password' | 'text' = 'password';

  public edades: Array<{ value: number }> = [];

  public gradosEstudios = [
    { value: 'preparatoria', label: 'Preparatoria' },
    { value: 'licenciatura', label: 'Licenciatura' },
    { value: 'maestria', label: 'Maestría' },
    { value: 'doctorado', label: 'Doctorado' },
  ];

  public estados: string[] = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
    'Estado de México', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León',
    'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
    'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.usuariosService.esquemaUser();
    this.llenarArrayEdades();
  }

  private llenarArrayEdades(): void {
    this.edades = Array.from({ length: 63 }, (_, i) => ({ value: i + 18 }));
  }

  public showPassword(): void {
    this.hide_1 = !this.hide_1;
    this.inputType_1 = this.hide_1 ? 'password' : 'text';
  }

  public showPassword2(): void {
    this.hide_2 = !this.hide_2;
    this.inputType_2 = this.hide_2 ? 'password' : 'text';
  }

  // Interceptores rápidos directos en UI si deseas conservar las mayúsculas automáticas
  public forzarMayusculas(campo: 'curp' | 'rfc', event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
    this.user[campo] = valor;
  }

  /* =========================================================
     Filtros de Teclado (Keypress Interceptors)
     ========================================================= */

  public soloLetras(event: KeyboardEvent): void {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  public soloAlfanumerico(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  public soloDireccion(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,#/\-]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  /* =========================================================
     Acciones de Formulario
     ========================================================= */

  public registrar(): void {
    if (this.isLoading) return;

    this.errors = this.usuariosService.validarUsuarioConServices(this.user);

    if (Object.keys(this.errors).length > 0) {
      console.log('Errores encontrados:', this.errors);
      return;
    }

    this.isLoading = true;
    localStorage.setItem(this.storageKey, JSON.stringify(this.user));

    const usuariosRegistrados = this.leerUsuariosRegistrados();
    const existente = usuariosRegistrados.findIndex(usuario =>
      usuario.email.trim().toLowerCase() === this.user.email.trim().toLowerCase()
    );

    if (existente >= 0) {
      usuariosRegistrados[existente] = this.user;
    } else {
      usuariosRegistrados.push(this.user);
    }

    localStorage.setItem(this.storageListKey, JSON.stringify(usuariosRegistrados));
    this.router.navigate(['/app/perfil-usuario']);
  }

  public terminosCondiciones(): void {
    alert('Aquí se mostrarán los Términos y Condiciones.');
  }

  public goLogin(): void {
    this.router.navigate(['']);
  }

  private leerUsuariosRegistrados(): RegistroUser[] {
    const datosGuardados = localStorage.getItem(this.storageListKey);

    if (!datosGuardados) {
      return [];
    }

    try {
      return JSON.parse(datosGuardados) as RegistroUser[];
    } catch {
      return [];
    }
  }
}
