import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    console.log('Token guard');
    let token = this._usuarioService.token; // obtenemos el token del servicio
    let payload = JSON.parse(atob(token.split('.') [1])); // decodificamos el token que es un string usando el atob. Separamos por , y obtenemos solo la primera posicion
    let expirado = this.expirado(payload.exp); // variable donde obtenemos la fecha de expiracion del token

    if (expirado) { // si ya expiró
      this.router.navigate(['/login']); // sacamos a al usuario
      return false;
    }


    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExpiracion: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date(fechaExpiracion * 1000); // pasamos la fecha de expiracion de segundos a milisegundos
      let ahora = new Date(); // fecha actual

      ahora.setTime(ahora.getTime() + (2 * 60 * 60 * 1000)); // a la hora actual le sumamos dos horas que es el tiempo en el que expira el token

      console.log('Fecha en la que expira el token ' + tokenExp);
      console.log('Fecha actual mas dos horas ' + ahora);

      if (tokenExp.getTime() > ahora.getTime()) { // Si la fecha de expiracion es mayor a la fecha actual quiere decir que todavia no esta proximo a expirar el token
        resolve(true);
      } else { // si ya esta por expirar
        this._usuarioService.renuevaToken().subscribe(() => { // renovamos el token
          resolve(true);
        }, () => {
          this.router.navigate(['/login']);
          reject(false);
        });
      }

      resolve(true);

    });

  }

  expirado(fechaExpiracion: number) {
    let ahora = new Date().getTime() / 1000; // Obtenemos la hora actual

    if (fechaExpiracion < ahora) { // si la hora del token es menor a la hora actual
      return true;
    } else {
      return false;
    }
  }
}
