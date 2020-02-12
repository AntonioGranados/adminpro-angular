import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';


@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo(archivo: File, tipo: string, id: string) { // Funcion que recibe el archivo, el tipo y el id
    return new Promise((resolve, reject) => {
      let formData = new FormData(); // el formdata que es lo que se sube o se envia a la peticion ajax
      let xhr = new XMLHttpRequest(); // Inicializamos la peticion ajax

      formData.append('imagen', archivo, archivo.name); // Se configura el formdata, donde le enviamos la imagen el archivo y el nombre del archivo

      xhr.onreadystatechange = () => { // Configuramos la peticion ajax, con onreadystatechange seremos notificados ante cualquier cambio que suceda
        if (xhr.readyState === 4) { // Si el estado de la peticion es igual a 4 es decir que la operacion ha sido completada
          if (xhr.status === 200) { // Si el estado es 200 es decir que se hizo correctamente
            console.log('Imagen subida');
            resolve(JSON.parse(xhr.response));
          } else {
            console.log('Fallo la subida del archivo');
            reject(xhr.response);
          }
        }
      };

      let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id; // Definimos la ruta del servicio
      xhr.open('PUT', url, true); // Hacemos la peticion ajax
      xhr.send(formData); // Enviamos el formdata

    });
  }
}
