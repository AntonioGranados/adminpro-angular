import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };


  constructor(@Inject(DOCUMENT) private _document) {
    this.cargarAjustes();
   }

  guardarAjustes() {
    // console.log('Guardado en el localstorage');
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes)); // El local storage solo guarda informacion en formato string, para eso se convierte el objeto en string con JSON.stringify
  }

  cargarAjustes() {
    if (localStorage.getItem('ajustes')) { // Si existen ajustes
      this.ajustes = JSON.parse(localStorage.getItem('ajustes')); // Se convierte el string a objeto js con JSON.parse
      // console.log('Cargando de localstorage');
      this.aplicarTema(this.ajustes.tema); // Se aplica el tema seleccionado
    } else {
      // console.log('Usando valores por defecto');
      this.aplicarTema(this.ajustes.tema); // Si no hay uno seleccionado se aplicara uno por defecto
    }
  }

  aplicarTema(color: string) {
    let url = `assets/css/colors/${ color }.css`;
    this._document.getElementById('tema').setAttribute('href', url);

    this.ajustes.tema = color;
    this.ajustes.temaUrl = url;

    this.guardarAjustes();
  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
