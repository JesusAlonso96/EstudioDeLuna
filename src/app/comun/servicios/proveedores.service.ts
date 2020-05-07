import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../modelos/proveedor.model';
import { ProductoProveedor } from '../modelos/producto_proveedor.model';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private http: HttpClient,
    private wsService: WebSocketService) { }

  public obtenerProveedores(): Observable<any> {
    return this.http.get('/api/v2/proveedores');
  }
  public obtenerListaProveedores(): Observable<any> {
    return this.http.get('/api/v2/proveedores/lista');
  }
  public obtenerProductosProveedor(idProveedor: string): Observable<any> {
    return this.http.get(`/api/v2/proveedores/insumos/${idProveedor}`);
  }
  public obtenerProveedoresEliminados(): Observable<any> {
    return this.http.get('/api/v2/proveedores/eliminados');
  }
  public obtenerProductosProveedorEliminados(): Observable<any> {
    return this.http.get('/api/v2/proveedores/insumos/eliminados');
  }
  public nuevoProveedor(proveedor: Proveedor): Observable<any> {
    return this.http.post('/api/v2/proveedores', proveedor);
  }
  public agregarProductoProveedor(producto: ProductoProveedor): Observable<any> {
    return this.http.post('/api/v2/proveedores/insumo', producto);
  }
  public editarProveedor(proveedor: Proveedor): Observable<any> {
    return this.http.put('/api/v2/proveedores', proveedor);
  }
  public eliminarProveedor(proveedor: Proveedor): Observable<any> {
    return this.http.patch('/api/v2/proveedores/eliminar', proveedor);
  }
  public restaurarProveedor(proveedor: Proveedor): Observable<any> {
    return this.http.patch('/api/v2/proveedores/restaurar', proveedor);
  }
  public eliminarProductoProveedor(producto: ProductoProveedor): Observable<any> {
    return this.http.patch('/api/v2/proveedores/insumo/eliminar', producto);
  }
  public restaurarProductoProveedorEliminado(producto: ProductoProveedor): Observable<any> {
    return this.http.patch('/api/v2/proveedores/insumo/restaurar', producto);
  }
  /* Sockets */
  public escucharNuevoProveedor() {
    return this.wsService.escuchar('nuevo-proveedor');
  }
  public escucharNuevoProveedorEliminado() {
    return this.wsService.escuchar('nuevo-proveedor-eliminado');
  }
  public escucharNuevoProveedorEditado() {
    return this.wsService.escuchar('nuevo-proveedor-editado');
  }
  public escucharNuevoProveedorRestaurado() {
    return this.wsService.escuchar('nuevo-proveedor-restaurado');
  }
}
