import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {
  public tipo: string; // tipo de collecion usuario, hospital, medico
  public id: string; // id del tipo (id del usuario, id del medico, id del hospital)

  public oculto: string = 'oculto'; // Si esta oculto o habilitado el modal

  public notificacion = new EventEmitter<any>(); // Para que los demas componente esten escuchando cuando se sube una imagen

  constructor() {
    console.log('modal upload service listo');
   }

   ocultarModal() {
     this.oculto = 'oculto';
     this.tipo = null; // para que cuando se cierre el modal y se vuelva abrir estas propiedades no existan
     this.id = null; // para que cuando se cierre el modal y se vuelva abrir estas propiedades no existan  

   }

   mostrarModal(tipo: string, id: string) { //  Se encargara de mostrar el modal
    this.oculto = ''; // No tendra la clase oculto, por lo tanto se mostrara
    this.tipo = tipo; // tipo que se recibe por parametro
    this.id = id; // id que se recibe por parametro
   }
}
