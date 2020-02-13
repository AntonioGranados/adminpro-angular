import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {
  titulo: string;

  constructor(private router: Router, private title: Title, private meta: Meta) {
    this.getDataRoute().subscribe(data => {
      this.titulo = data.titulo,
      this.title.setTitle(this.titulo); // Pone el titulo de la pagina donde se encuentre en la pestaña del navegador

      const metaTag: MetaDefinition = { // Creamos el cuerpo del metaTag
        name: 'description',
        content: this.titulo
      };
      this.meta.updateTag(metaTag); // Actualizamos el metaTag
    });
   }

  ngOnInit() {
  }

  getDataRoute() {
    return this.router.events.pipe(
      filter(evento => evento instanceof ActivationEnd), // Si el evento es una instancia de activation end, es lo que dejara pasar por el filter
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null ), // como hay dos activation end lo pasamos nuevamente por el filtro para que muestre solo el activationed cuyo firstchild sea null ya que es el que contiene el titulo que necesitamos
      map((evento: ActivationEnd) => evento.snapshot.data) // pasamos el evento por el map para mostrar finalmente el titulo
    );
  }
}
