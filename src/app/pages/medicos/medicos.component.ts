import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  desde: number = 0; // la paginacion, por defecto 0
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _medicoService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos().subscribe(medicos => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    console.log(desde);

    if (desde >= this._medicoService.totalMedicos ) { // si el desde es mayor al numero total de registros, no hacemos nada porque no es posible
      return;
    }

    if (desde < 0) { // si desde es menor al numero total de registros, no se hace nada porque no es posible
      return;
    }

    this.desde += valor; // incrementamos el desde al valor
    this.cargarMedicos();
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) { // si no hay nada que buscar vuelve a mostrar todos los usuarios
      this.cargarMedicos();
      return;
    }

    this.cargando = true; // mostramos el loading

    this._medicoService.buscarMedicos(termino).subscribe(medicos => { // llamamos la funcion del servicio y nos suscribimos
      this.medicos = medicos; // regresamos los medicos
      this.cargando = false; // ocultamos el loading
    });
  }

  borrarMedico(medico: Medico) {
    this._medicoService.borrarMedico(medico._id).subscribe( () => { // llamamos a funcion del servicio
      this.cargarMedicos(); // regresamos los medicos
    });
  }
}
