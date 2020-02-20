import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})

export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0; // la paginacion, por defecto 0
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _usuarioService: UsuarioService,
              public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe(resp => {
      this.cargarUsuarios();
    });
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id); // llamamos la funcion del servicio.
  }

  cargarUsuarios() {
    this.cargando = true; // El loading se va a mostrar cuando se estan cargando los usuarios
    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => { // llamamos la funcion del servicio y le enviamos desde y nos suscribimos
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false; // Cuando ya se cargaron el loading se oculta
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
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) { // si no hay nada que buscar vuelve a mostrar todos los usuarios
      this.cargarUsuarios();
      return;
    }

    this.cargando = true; // Mostramos el loading

    this._usuarioService.buscarUsuario(termino).subscribe((usuarios: Usuario[]) => { // llamamos la funcion del buscarUsuario del usuario service y nos suscribimos
      this.usuarios = usuarios;
      this.cargando = false; // ocultamos el loading
    });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) { // si el usuario es el mismo que esta logueado, no se puede borrar a si mimso
      Swal.fire('Error al eliminar usuario', 'No se puede eliminar a si mismo', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Estás Seguro?',
      text: 'Estás a punto de eliminar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
    }).then((eliminar) => {
        if (eliminar.value) {
          this._usuarioService.borrarUsuario(usuario._id).subscribe((borrado: any) => { // llamamos la funcion del servicio
            console.log(borrado);
            this.totalRegistros--;
            if (this.desde === this.totalRegistros) {
              this.desde -= 5;
            }
            this.cargarUsuarios(); // regresamos nuevamente los usuarios
          });
        }
      });
    }

    guardarUsuario(usuario: Usuario) {
      this._usuarioService.actualizarUsuario(usuario).subscribe();
    }
  }

