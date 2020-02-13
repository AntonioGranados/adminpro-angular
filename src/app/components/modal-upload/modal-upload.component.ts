import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(public _subirArchivoService: SubirArchivoService,
              public _modalUploadService: ModalUploadService) {}

  ngOnInit() {
  }

  seleccionImagen(archivo: File) {
    if (!archivo) { // Si no recibimos ningun archivo
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) { // Si el tipo de archivo no es una imagen
      Swal.fire('Solo Imágenes', 'El archivo seleccionado no es una imágen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader(); // Hacemos un filereader que permite leer el fichero de la img
    let urlImagenTemp = reader.readAsDataURL(archivo); // Leemos el contenido del archivo

    reader.onloadend = () => this.imagenTemp = reader.result;


    console.log(archivo);
  }

  subirImagen() {
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id) // llamamos la funcion del servicio donde le enviamos el archivo que se va a subir, el tipo de archivo, y el id
        .then(resp => { // esa funcion regresa una promesa, por eso el then y el catch
          this._modalUploadService.notificacion.emit(resp); // Llamamos el objeto notificacion y emitimos la respuesta
          this.cerrarModal(); // cerramos el modal
        })
        .catch(err => { // manejamos el error
          console.log('Error en la carga...');
        });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }


}
