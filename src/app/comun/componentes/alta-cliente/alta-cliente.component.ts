import { Component, OnInit } from '@angular/core';
import { Estado } from '../../modelos/estado.model';
import { Municipio } from '../../modelos/municipio.model';
import { Cliente } from '../../modelos/cliente.model';
import { EstadosService } from '../../servicios/estados.service';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss']
})
export class AltaClienteComponent implements OnInit {
  conFactura: string = 'No';
  estados: Estado[];
  estado: Estado;
  municipios: Municipio[];
  municipio: Municipio;
  cliente: Cliente = new Cliente();
  cargando: boolean = false;
  constructor(private estadosService: EstadosService, private clienteService: ClienteService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.cliente.estado = '';
    this.obtenerEstados();
  }
  obtenerEstados() {
    this.estadosService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.estados = estados;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )
  }
  generarContrasena(): string {
    let contrasena = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 14; i++) {
      contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contrasena;
  }

  onChange(e) {
    this.conFactura = e.checked ? 'Si' : 'No';
  }
  seleccionoEstado() {
    if (this.estado) return true;
    return false;
  }
  abrirRegistrarCliente() {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Registrar cliente', mensaje: '¿Desea registrar este cliente?', msgBoton: 'Registrar', color: 'primary' }
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.registrarCliente();
      }
    })
  }
  registrarCliente() {
    this.cliente.fecha_registro = new Date(Date.now());
    this.cliente.contrasena = this.generarContrasena();
    this.cargando = true;
    this.clienteService.registrarCliente(this.cliente).subscribe(
      (registrado: any) => {
        this.cargando = false;
        this.toastr.success('Cliente registrado', 'El cliente ha sido registrado exitosamente', { closeButton: true });
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  buscarMunicipios() {
    this.cliente.estado = this.estado.nombre;
    this.cargando = true;
    this.estadosService.obtenerMunicipios(this.estado._id).subscribe(
      (municipios) => {
        this.cargando = false;
        this.municipios = municipios;
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )

  }
  setMunicipio() {
    this.cliente.municipio = this.municipio.nombre;
  }
}
