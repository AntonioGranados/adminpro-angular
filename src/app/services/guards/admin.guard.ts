import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService) {}

  canActivate() {
    if (this._usuarioService.usuario.role === 'ADMIN_ROLE') { // Si es un usuario con el rol admin_role
      return true;
    } else {
      console.log('Bloqueado por el admin guard');
      this._usuarioService.logout(); // si no es admin cerrara sesion
      return false;
    }
  }
}
