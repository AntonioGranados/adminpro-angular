import { Component, OnInit } from '@angular/core';

import { Hospital } from '../../models/hospital.model';

import { HosptialService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = []; // Array de hospitales
  desde: number = 0; // paginacion
  totalRegistros: number = 0; // total del registros
  cargando: boolean = true; // loading

  constructor(public _hospitalService: HosptialService,
              public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe(() => {
      this.cargarHospitales();
    });
  }

  cargarHospitales() {
    this.cargando = true; // Muestra el loading mientras cargan los registros
    this._hospitalService.cargarHospitales(this.desde).subscribe(hospitales => { // llamamos la funcion del servicio
      this.totalRegistros = hospitales.total; // seteamos los resultados
      this.hospitales = hospitales; // seteamos los resultados
      this.cargando = false; // ocultamos el loading
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    console.log(desde);

    if (desde >= this.totalRegistros ) { // si el desde es mayor al numero total de registros, no hacemos nada porque no es posible
      return;
    }

    if (desde < 0) { // si desde es menor al numero total de registros, no se hace nada porque no es posible
      return;
    }

    this.desde += valor; // incrementamos el desde al valor
    this.cargarHospitales();
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital(termino).subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
      this.cargando = false;
    });
  }

  crearHospital() {
    Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital...',
      inputValidator: (value) => {
        if (!value) {
          return 'El campo no debe estar vacío';
        }
      },
      confirmButtonText: 'Guardar',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
    }).then((valor) => {
      if (!valor.value || valor.value.length === 0) {
      return;
    }
      this._hospitalService.crearHospital(valor.value).subscribe(() => {
        this.cargarHospitales();
      });
    });
  }

  actualizarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Estás Seguro?',
      text: 'Estás a punto de eliminar a ' + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
    }).then((eliminar) => {
        if (eliminar.value) {
          this._hospitalService.borrarHospital(hospital._id).subscribe((borrado: any) => { // llamamos la funcion del servicio
            console.log(borrado);
            this.totalRegistros--;
            if (this.desde === this.totalRegistros) {
              this.desde -= 5;
            }
            this.cargarHospitales(); // regresamos nuevamente los usuarios
          });
        }
      });
  }

 actualizarImagen(hospital: Hospital) {
   this._modalUploadService.mostrarModal('hospitales', hospital._id);
 }
}
