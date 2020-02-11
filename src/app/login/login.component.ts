import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any; // para usar la libreria de google

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  recordarme: boolean = false;
  auth2: any;


  constructor(public router: Router,
              public _usuarioService: UsuarioService,
              public _ngZone: NgZone) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || ''; // Obtenemos el email para que lo muestre en el login cuando el check este activado, si no hay nada en el localstorage no mostrara nada
    if (this.email.length > 1) { // Si hay algo en el campo del email
      this.recordarme = true; // el check estara activo
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '986128165421-qe5afla31j1l4j5uu7b7r5htdpttg53i.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignIn(document.getElementById('btnGoogle'));
    });
  }

  attachSignIn(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile(); // Obtenemos la informacion del usuario
      let token = googleUser.getAuthResponse().id_token; // obtenemos el token de google
      this._usuarioService.loginGoogle(token).subscribe(() => {
        this._ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      });
    });
  }

  iniciarSesion(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    let usuario = new Usuario(null, forma.value.email, forma.value.password); // creamos un objeto de tipo usuario y le enviamos los campos de acuerdo al modelo de ususario, el primero es el nombre pero como no lo mandamos aqui es null, email y password
    this._usuarioService.login(usuario, forma.value.recordarme).subscribe(correcto => { // llamamos la funcion login del servicio y recibimos un usuario y el check recordarme y nos suscribimos para obtener una respuesta
      this.router.navigate(['/dashboard']); // Una vez las credenciales son correctas redireccionamos al dashboard
    });


    console.log(forma.valid);
    console.log(forma.value);
    // this.router.navigate(['/dashboard']);
  }

}
