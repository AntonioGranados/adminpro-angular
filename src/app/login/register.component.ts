import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup; // Propiedad de tipo FormGroup

  constructor(public _usuarioService: UsuarioService, public router: Router) { }

  sonIguales(campo1: string, campo2: string) { // Funcion para validar si las contraseñas son iguales
    return (group: FormGroup) => {
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true
      };
    }
  }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({ // forma es igual a un new form group y en el definimos todos los campos del html que vamos a manipular
      nombre: new FormControl(null, Validators.required), // Agregamos condiciones el primero es el valor que tendra ese campo por defecto, en este caso null, y la validacion que es obligatorio con el required
      correo: new FormControl(null, [Validators.required, Validators.email]), // primer valor null y para añadir varias validaciones las agregamos con []
      password: new FormControl(null, Validators.required),
      confirmarPassword: new FormControl(null, Validators.required),
      terminosYCondiciones: new FormControl(false)
    }, {validators: this.sonIguales('password', 'confirmarPassword') });


  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.terminosYCondiciones) { // si no acepta terminos y condiciones
      Swal.fire('Importante', 'Debes aceptar los términos y condiciones', 'warning');
      return;
    }
    let usuario = new Usuario( // creamos el usuario que se va a guardar usando el modelo de usuario y los campos del formulario
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario(usuario).subscribe(resp => { // llamamos el servicio usamos el subscribe y enviamos una respuesta
      console.log(resp);
      this.router.navigate(['/login']); // una vez todo salio bien el registro fue exitoso, redireccionamos al usuario a la pantalla del login
    });
  }
}
