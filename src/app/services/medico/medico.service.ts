import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';

import Swal from 'sweetalert2';

import { map } from 'rxjs/operators';

import { Medico } from '../../models/medico.model';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  totalMedicos: number = 0;

  constructor(public http: HttpClient, public _usuarioService: UsuarioService) { }

  cargarMedicos() {
    let url = URL_SERVICIOS + '/medico'; // Definimos la ruta del servicio

    return this.http.get(url).pipe(map((resp: any) => { // hacemos la peticion
      this.totalMedicos = resp.total;
      return resp.medico; // regresamos los medicos
    }));
  }

  cargarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id; // Definimos la ruta del servicio

    return this.http.get(url).pipe(map((resp: any) => { // hacemos la peticion
      return resp.medico; // regresamos la informacion del medico
    }));
  }

  buscarMedicos(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino; // definimos la ruta del servicio
    return this.http.get(url).pipe(map((resp: any) => { // hacemos la peticion
      return resp.medicos; // regresamos los usuarios
    }));
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id; // definimos la url del servicio
    url += '?token=' + this._usuarioService.token; // tambien el token

    return this.http.delete(url).pipe(map((resp: any) => { // hacemos la peticion
      Swal.fire('Medico Eliminado', 'Medico Eliminado Correctamente', 'success');
      return resp;
    }));
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico'; // Definimos la ruta del servicio

    if (medico._id) { // Si existe ese id quiere decir que estamos actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put(url, medico).pipe(map((resp: any) => {
        Swal.fire('Medico Actualizado Correctamente', medico.nombre, 'success');
        return resp.medico;
      }));

    } else { // si no existe estamos creando un nuevo medico

      url += '?token=' + this._usuarioService.token; // y el token

      return this.http.post(url, medico).pipe(map((resp: any) => { // hacemos la peticion
        Swal.fire('Medico Creado', medico.nombre, 'success');
        return resp.medico; // regresamos el medico creado
      }));
    }
  }
}
