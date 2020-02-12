import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any { // recibimos la imagen y el tipo que por defecto sera usuario
    let url = URL_SERVICIOS + '/img'; // definimos el url del servicio

    if (!img) {
      return url + '/usuario/xxx'; // Si no recibo ninguna imagen, mostrara el no image que se definio en el backend
    }

    if (img.indexOf('https') >= 0) { // si viene una imagen con https sabemos que es una imagen de google
      return img;
    }

    switch (tipo) { // si no es https pueden ser tres tipos de imagenes, hospitales medicos o usuarios
      case 'usuario':
        url += '/usuarios/' + img; // path con la imagen de los usuarios
        break;

      case 'medico':
        url += '/medicos/' + img;
        break;

      case 'hospital':
        url += '/hospitales/' + img;
        break;

      default:
        console.log('Tipo de imagen no existe / usuarios, medicos, hospitales');
        url += '/usuarios/xxx';
    }
    return url;
  }
}
