import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router, public _subirArchivService: SubirArchivoService) {
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

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id; // url del servicio para actualizar usuario
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(map((resp: any) => {
      if (usuario._id === this.usuario._id) { // Si el usuario de la respuesta es igual al usuario que esta logueado actualmente
        // this.usuario = resp.usuario;
        let usuarioDB: Usuario = resp.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB ); // Guardamos el usuario actualizado en el localstorage
      }
      Swal.fire('Usuario Actualizado', usuario.nombre, 'success');
      return true;
    }));
  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivService.subirArchivo(archivo, 'usuarios', id ).then((resp: any) => { // Llamamos la funcion subir archivo del subirarchiv service
      this.usuario.img = resp.usuario.img;
      Swal.fire('Imagen actualizada correctamente', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario); // guardamos en el localstorage
    }).catch(resp => {
      console.log(resp);
    });
  }

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde; // definimos la ruta del servicio

    return this.http.get(url); // hacemos la peticion
  }

  buscarUsuario(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino; // definimos la ruta del servicio
    return this.http.get(url).pipe(map((resp: any) => { // hacemos la peticion
      return resp.usuarios; // regresamos los usuarios
    }));
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id; // definimos la ruta del servicio
    url += '?token=' + this.token; // tambien el token

    return this.http.delete(url).pipe(map((resp: any) => { // hacemos la peticion
      Swal.fire('Usuario Eliminado', 'El usuario ha sido eliminado correctamente', 'success');
      return true;
    }));
  }
}
