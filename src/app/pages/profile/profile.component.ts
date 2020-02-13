import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(public _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario;
   }

  ngOnInit() {
  }

  guardar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre; // el nombre de usuario va ser igual al nombre que se esta recibiendo por parametro
    if (!this.usuario.google) { // Si no es un usuario de google
      this.usuario.email = usuario.email; // Se permite actualizar el correo
    }

    this._usuarioService.actualizarUsuario(this.usuario).subscribe();
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

  cambiarImagen() {
     this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id); // enviamos la imgen y el id del usuario
  }
}
