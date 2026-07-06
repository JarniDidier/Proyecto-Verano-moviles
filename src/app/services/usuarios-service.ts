import { Injectable } from '@angular/core';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';

export interface RegistroUser {
  first_name: string;
  last_name: string;
  id_usuario: string;
  email: string;
  password: string;
  confirmar_password: string;
  curp: string;
  rfc: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  estado: string;
  carrera: string;
  grado_estudios: string;
  edad: number | null;
  terminos_condiciones: boolean;
}

export interface PerfilUsuarioUI {
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  estado: string;
  ciudad: string;
  edad: number | null;
  codigo?: string;
  fecha_registro?: string;
  photoUrl?: string;
  rolEtiqueta?: string;
}

export type RegistroErrors = Partial<Record<keyof RegistroUser, string>>;

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  constructor(
    private errors: ErrorsService,
    private validator: ValidatorService
  ) { }

  public esquemaUser(): RegistroUser {
    return {
      first_name: '',
      last_name: '',
      id_usuario: '',
      email: '',
      password: '',
      confirmar_password: '',
      curp: '',
      rfc: '',
      telefono: '',
      ciudad: '',
      direccion: '',
      estado: '',
      carrera: '',
      grado_estudios: '',
      edad: null,
      terminos_condiciones: false,
    };
  }


  /* =========================================================
     2) VALIDACIÓN DE USUARIO MÉTODO SIN USAR EL SERVICIO DE ERRORS Y VALIDATOR
     ========================================================= */
  public validarUsuario(user: RegistroUser): RegistroErrors {
    const errors: RegistroErrors = {};

    if (!user.first_name?.trim()) errors.first_name = 'El nombre es obligatorio.';
    if (!user.last_name?.trim()) errors.last_name = 'Los apellidos son obligatorios.';

    if (!user.id_usuario?.trim()) {
      errors.id_usuario = 'El ID de usuario es obligatorio.';
    } else if (!/^[a-zA-Z0-9]{8}$/.test(user.id_usuario)) {
      errors.id_usuario = 'El ID debe tener exactamente 8 caracteres alfanuméricos.';
    }

    if (!user.email?.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(user.email.trim())) {
      errors.email = 'El correo electrónico no tiene un formato válido.';
    }

    if (!user.password?.trim()) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (user.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!user.confirmar_password?.trim()) {
      errors.confirmar_password = 'Debes confirmar tu contraseña.';
    } else if (user.password !== user.confirmar_password) {
      errors.confirmar_password = 'Las contraseñas no coinciden.';
    }

    if (!user.curp?.trim()) {
      errors.curp = 'La CURP es obligatoria.';
    } else if (!/^[A-Z0-9]{18}$/.test(user.curp)) {
      errors.curp = 'La CURP debe tener exactamente 18 caracteres alfanuméricos.';
    }

    if (!user.rfc?.trim()) {
      errors.rfc = 'El RFC es obligatorio.';
    } else if (!/^[A-Z0-9]{12,13}$/.test(user.rfc)) {
      errors.rfc = 'El RFC debe tener 12 o 13 caracteres alfanuméricos.';
    }

    if (!user.telefono?.trim()) {
      errors.telefono = 'El teléfono es obligatorio.';
    } else if (user.telefono.replace(/\D/g, '').length !== 10) {
      errors.telefono = 'El teléfono debe contener 10 dígitos.';
    }

    if (!user.ciudad?.trim()) errors.ciudad = 'La ciudad es obligatoria.';
    if (!user.direccion?.trim()) errors.direccion = 'La dirección es obligatoria.';
    if (!user.estado) errors.estado = 'Selecciona un estado.';
    if (!user.carrera?.trim()) errors.carrera = 'La carrera es obligatoria.';
    if (!user.grado_estudios) errors.grado_estudios = 'Selecciona tu grado de estudios.';
    if (user.edad === null || user.edad === undefined) errors.edad = 'Seleccione una edad.';
    if (!user.terminos_condiciones) errors.terminos_condiciones = 'Debe aceptar los términos y condiciones.';

    return errors;
  }

  /* =========================================================
     3) VALIDACIÓN DE USUARIO MÉTODO PERO AHORA USANDO EL SERVICIO DE ERRORS Y VALIDATOR
     ========================================================= */
  public validarUsuarioConServices(user: RegistroUser): RegistroErrors {
    const errors: RegistroErrors = {};

    // Nombre y Apellidos
    if (!this.validator.required(user.first_name)) {
      errors.first_name = this.errors.required;
    } else if (!this.validator.wordsES(user.first_name)) {
      errors.first_name = this.errors.msg('pattern', 'Juan');
    }

    if (!this.validator.required(user.last_name)) {
      errors.last_name = this.errors.required;
    } else if (!this.validator.wordsES(user.last_name)) {
      errors.last_name = this.errors.msg('pattern', 'Pérez López');
    }

    // ID de Usuario
    if (!this.validator.required(user.id_usuario)) {
      errors.id_usuario = this.errors.required;
    } else if (!this.validator.idUsuario(user.id_usuario)) {
      errors.id_usuario = this.errors.msg('exact', 8);
    }

    // Email
    if (!this.validator.required(user.email)) {
      errors.email = this.errors.required;
    } else if (!this.validator.email(user.email)) {
      errors.email = this.errors.email;
    }

    // Password
    if (!this.validator.required(user.password)) {
      errors.password = this.errors.required;
    } else if (!this.validator.minLen(user.password, 8)) {
      errors.password = this.errors.msg('min', 8);
    }

    // Confirmar Password
    if (!this.validator.required(user.confirmar_password)) {
      errors.confirmar_password = this.errors.required;
    } else if (user.password !== user.confirmar_password) {
      errors.confirmar_password = 'Las contraseñas no coinciden.';
    }

    // CURP
    if (!this.validator.required(user.curp)) {
      errors.curp = this.errors.required;
    } else if (!this.validator.curp(user.curp)) {
      errors.curp = this.errors.msg('exact', 18);
    }

    // RFC
    if (!this.validator.required(user.rfc)) {
      errors.rfc = this.errors.required;
    } else if (!this.validator.rfc(user.rfc)) {
      errors.rfc = this.errors.msg('range', 12, 13);
    }

    // Teléfono
    if (!this.validator.required(user.telefono)) {
      errors.telefono = this.errors.required;
    } else if (!this.validator.phoneMX(user.telefono)) {
      errors.telefono = this.errors.msg('exact', 10);
    }

    // Simples y Dropdowns
    if (!this.validator.required(user.ciudad)) errors.ciudad = this.errors.required;
    if (!this.validator.required(user.direccion)) errors.direccion = this.errors.required;
    if (!this.validator.required(user.estado)) errors.estado = this.errors.required;
    if (!this.validator.required(user.carrera)) errors.carrera = this.errors.required;
    if (!this.validator.required(user.grado_estudios)) errors.grado_estudios = this.errors.required;

    // Edad
    if (!this.validator.required(user.edad)) {
      errors.edad = this.errors.required;
    } else if (!this.validator.betweenNumber(user.edad, 18, 99)) {
      errors.edad = this.errors.msg('between', 18, 99);
    }

    // Términos
    if (!user.terminos_condiciones) {
      errors.terminos_condiciones = this.errors.generic;
    }

    return errors;
  }
}
