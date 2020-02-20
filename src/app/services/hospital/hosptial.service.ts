import { Injectable } from '@angular/core';

import { Hospital } from '../../models/hospital.model';

import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class HosptialService {
  hospital: Hospital;
  totalHospitales: number = 0;

  constructor(public http: HttpClient,
              public _usuarioService: UsuarioService ) { }

  cargarHospitales(desde: number) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde; // Definimos la ruta del servicio
    return this.http.get(url).pipe(map((resp: any) => {
      this.totalHospitales = resp.total;
      return resp.hospitales;
    }));
  }

  buscarHospital(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get(url).pipe(map((resp: any) => {
      return resp.hospitales;
    }));
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get(url).pipe(map((resp: any) => {
      return resp.hospital;
    }));
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre}).pipe(map((resp: any) => {
      Swal.fire('Hospital Creado Correctamente', nombre, 'success');
      return resp.hospital;
    }));
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital).pipe(map((resp: any) => {
      Swal.fire('Hospital Actualizado', hospital.nombre, 'success');
      return resp.hospital;
    }));
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(map((resp: any) => {
      Swal.fire('Hospital Eliminado', 'El hospital ha sido eliminado correctamente', 'success');
      return resp.hospital;
    }));
  }
}
