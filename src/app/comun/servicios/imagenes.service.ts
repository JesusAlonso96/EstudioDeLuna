import { Injectable } from '@angular/core';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor() { }

  public convertirImagen(imagen: string) {
    const fecha: string = moment(new Date(Date.now())).format('DD-MM-YYYY[_]hh-mm-ss');
    let nombreImagen: string = '';
    const imagenBlob = this.datosURIaBlob(imagen);
    nombreImagen = 'imagen_' + fecha + '.jpg';
    return new File([imagenBlob], nombreImagen, { type: 'image/jpg' })

  }
  private datosURIaBlob(datosURI: string): any {
    const base64 = datosURI.slice(22, -22);
    const stringByte = window.atob(base64);
    const arrayBuffer = new ArrayBuffer(stringByte.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < stringByte.length; i++) {
      int8Array[i] = stringByte.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpg' });
  }
}
