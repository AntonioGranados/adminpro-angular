import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router) {
    this.cargarStorage();
   }

   estaLogueado() {
     return (this.token.length > 5) ? true : false; // si el token es mayor a 5 regresamos un true si no regresamon un false
   }

   cargarStorage() {
     if (localStorage.getItem('token')) {
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse(localStorage.getItem('usuario'));
     } else {
       this.token = '';
       this.usuario = null;
     }
   }

   guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id); // guardamos la informacion en el local storage
    localStorage.setItem('token', token); // guardamos la informacion en el local storage
    localStorage.setItem('usuario', JSON.stringify(usuario)); // como usuario es un objeto lo convertimos a srting

    this.usuario = usuario;
    this.token = token;
   }

   logout() { // Cerramos sesion
     this.usuario = null; // Decimos que el usuario sea null
     this.token = ''; // y el token este vacio

     localStorage.removeItem('token'); // Eliminamos del localstorage
     localStorage.removeItem('usuario'); // Eliminamos del localstorage

     this.router.navigate(['/login']); // redireccionamos al login
   }

   loginGoogle(token: string) { // llamamos la funcion del backend para inicar sesion con goole, recibimos el token
     let url = URL_SERVICIOS + '/login/google'; // definimos la url del servicio
     return this.http.post(url, {token}).pipe(map((resp: any) => {
       this.guardarStorage(resp.id, resp.token, resp.usuario);
       return true;
     }));
   }

   login(usuario: Usuario, recordarme: boolean = false) { // En la funcion recibimos el usuario, y la variable recordarme del checkbox
     if (recordarme) { // Guardamos en el localStorage el email cuadno se tiene activo el check recordarme
       localStorage.setItem('email', usuario.email);
     } else {
       localStorage.removeItem('email');
     }
    
     let url = URL_SERVICIOS + '/login'; // definimos la url del servicio
     return this.http.post(url, usuario).pipe(map((resp: any) => { // hacemos la peticion
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
     }));
   }

   crearUsuario(usuario: Usuario) {
     let url = URL_SERVICIOS + '/usuario'; // url del servicio para crear usuarios

     return this.http.post(url, usuario).pipe(map((resp: any) => { // llamamos la peticion donde mandamos la url y el usuario que se va a guardar
       Swal.fire('Usuario Creado Correctamente', usuario.email, 'success');
       return resp.usuario;
     }));
  }
}
