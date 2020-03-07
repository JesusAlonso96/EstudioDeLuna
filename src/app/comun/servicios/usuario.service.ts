import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto.model';
import { Familia } from '../modelos/familia.model';
import { Usuario } from '../modelos/usuario.model';
import { Proveedor } from '../modelos/proveedor.model';
import { ProductoProveedor } from '../modelos/producto_proveedor.model';
import { EmpresaCot } from '../modelos/empresa_cot.model';
import { Cotizacion } from '../modelos/cotizacion.model';
import { ProductoCot } from '../modelos/producto_cot.model';
import { WebSocketService } from './websocket.service';
import { OrdenCompra } from '../modelos/orden_compra.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private http: HttpClient, private wsService: WebSocketService) { }
    //post
    public agregarNuevoProducto(producto: Producto): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarProducto', producto);
    }
    public agregarNuevaFamilia(familia: Familia): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarFamilia', familia);
    }

    public crearAsistencia(id: string): Observable<any> {
        return this.http.post(`/api/v1/usuarios/crearAsistencia/${id}`, null);
    }
    public nuevoProveedor(proveedor: Proveedor): Observable<any> {
        return this.http.post('/api/v1/usuarios/nuevoProveedor', proveedor);
    }
    public agregarProductoProveedor(producto: ProductoProveedor): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarProductoProveedor', producto);
    }
    public agregarEmpresa(empresa: EmpresaCot): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarEmpresa', empresa);
    }
    public agregarCotizacion(cotizacion: Cotizacion): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarCotizacion', cotizacion);
    }
    public agregarOrdenCompra(ordenCompra: OrdenCompra): Observable<any> {
        return this.http.post('/api/v1/usuarios/ordenCompra', ordenCompra);
    }
    //get
    public obtenerUsuario(id: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerUsuario/${id}`);
    }
    public obtenerUsuarios(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerUsuarios');
    }
    public obtenerPedidosRealizados(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerPedidosRealizados')
    }
    public obtenerFotografos(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerFotografos');
    }
    public obtenerPedidosRealizadosPorFotografo(id: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerPedidosRealizadosPorFotografo/${id}`);
    }
    public obtenerPedidosVendidos(filtro: number): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerPedidosVendidos/${filtro}`);
    }
    public obtenerPedidosVendidosPorFotografo(id: string, filtro: number): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerPedidosVendidosPorFotografo/${id}/${filtro}`);
    }
    public obtenerVentasConRetoquePorFotografo(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerVentasConRetoquePorFotografo');
    }
    public obtenerDesglosePedidosCRetoque(idUsuario: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/desglosarVentasConRetoquePorFotografo/${idUsuario}`);
    }
    public obtenerProveedores(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerProveedores');
    }
    public obtenerListaProveedores(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerListaProveedores');
    }
    public obtenerProductosProveedor(idProveedor: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerProductosProveedor/${idProveedor}`);
    }
    public obtenerEmpresas(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerEmpresas');
    }
    public obtenerDatosEstudio(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerDatosEstudio');
    }
    public obtenerCotizacionesRealizadas(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerCotizaciones');
    }
    public obtenerPestanas(rol: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerPestanas/${rol}`)
    }
    //patch
    public actualizarProducto(producto: Producto): Observable<any> {
        return this.http.patch('/api/v1/usuarios/actualizarProducto', producto);
    }
    public eliminarProducto(id: string, idFamilia: string): Observable<any> {
        return this.http.patch(`/api/v1/usuarios/eliminarProducto/${id}/${idFamilia}`, null);
    }
    public eliminarFamilia(id: string): Observable<any> {
        return this.http.patch(`/api/v1/usuarios/eliminarFamilia/${id}`, null);
    }
    public eliminarEmpresa(empresa: EmpresaCot): Observable<any> {
        return this.http.patch('/api/v1/usuarios/eliminarEmpresa', empresa);
    }
    public actualizarEmpresa(empresa: EmpresaCot): Observable<any> {
        return this.http.patch('/api/v1/usuarios/actualizarEmpresa', empresa);
    }
    public generarCodigoRecuperacion(body: { email: string }): Observable<any> {
        return this.http.patch('/api/v1/usuarios/generarCodigoRecuperacion', body);
    }
    public cambiarContrasena(email: string, body: { contrasena: string, codigo: string }): Observable<any> {
        return this.http.patch(`/api/v1/usuarios/recuperarContrasena/${email}`, body);
    }
    public eliminarCodigoRecuperacion(body: { email: string }): Observable<any> {
        return this.http.patch('/api/v1/usuarios/eliminarCodigoRecuperacion', body);
    }
    /* Peticiones para sockets */
    public escucharNuevoUsuario() {
        return this.wsService.escuchar('nuevo-usuario');
    }
    public escucharNuevoUsuarioEliminado() {
        return this.wsService.escuchar('nuevo-usuario-eliminado');
    }
    public escucharNuevoUsuarioEditado() {
        return this.wsService.escuchar('nuevo-usuario-editado');
    }
    public escucharNuevoUsuarioRestaurado() {
        return this.wsService.escuchar('nuevo-usuario-restaurado')
    }
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
    public escucharNuevaFamilia() {
        return this.wsService.escuchar('nueva-familia');
    }
    public escucharNuevaFamiliaEliminada() {
        return this.wsService.escuchar('nueva-familia-eliminada');
    }
    public escucharNuevaFamiliaRestaurada() {
        return this.wsService.escuchar('nueva-familia-restaurada');
    }
    //FUNCIONES AUXILIARES
    public obtenerSubtotalPorProducto(producto: ProductoCot): number {
        return producto.cantidad * <number>producto.producto.precio;
    }
}