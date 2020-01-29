import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../../services/service.index';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor(public _ajustes: SettingsService) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor(color: string, link: any) {
    this.aplicarCheck(link);
    this._ajustes.aplicarTema(color);
  }

  aplicarCheck(link: any) {
    let selectores: any = document.getElementsByClassName('selector');
    for (let ref of selectores) {
      ref.classList.remove('working'); // Se eliminan todas las clases working
    }

    link.classList.add('working');

  }

  colocarCheck() {
    let selectores: any = document.getElementsByClassName('selector');
    let tema = this._ajustes.ajustes.tema; // Ponemos el tema en una variable
    for (let ref of selectores) {
      if (ref.getAttribute('data-theme') === tema) { // Si el atributo es igual al tema seleccionado
        ref.classList.add('working'); // Agregamos la clase working
        break;
      }
    }
  }

}
