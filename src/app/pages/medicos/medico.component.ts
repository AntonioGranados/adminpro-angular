import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HosptialService } from '../../services/service.index';
import { MedicoService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import { Router, ActivatedRoute } from '@angular/router';

import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = []; // importamos el modelo de hospital
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(public _hospitalService: HosptialService,
              public _medicoService: MedicoService,
              public _modalUploadService: ModalUploadService,
              public router: Router,
              public activatedRoute: ActivatedRoute) {

                activatedRoute.params.subscribe(params => { // usamos el activatedroute para leer el id que enviamos por el url
                  let id = params['id']; // definimos el id

                  if (id !== 'nuevo') { // si no se va crear un nuevo medico, mostramos la informacion del medico con ese id
                    this.cargarMedico(id);
                  }
                });
               }

  ngOnInit() {
    this._hospitalService.cargarHospitales(0).subscribe(hospitales => this.hospitales = hospitales); // llamamos la funcion del servicio
    this._modalUploadService.notificacion.subscribe(resp => {
      this.medico.img = resp.medico.img;
    });
  }

  guardarMedico(f: NgForm) {
    console.log(f.valid);
    console.log(f.value);

    if (f.invalid) {
      return;
    }

    this._medicoService.guardarMedico(this.medico).subscribe(medico => {
      this.medico._id = medico._id;
      this.router.navigate(['/medico', medico._id]); // navegamos al perfil del medico para poder editarlo
      console.log(medico);
    });
  }

  cambioHospital(id: string) {
    this._hospitalService.obtenerHospital(id).subscribe(hospital => {
      console.log(hospital);
      this.hospital = hospital;
    });
  }

  cargarMedico(id: string) {
    this._medicoService.cargarMedico(id).subscribe(medico => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital(this.medico.hospital);
    });
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
