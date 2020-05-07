import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Estado } from '../../modelos/estado.model';
import { Municipio } from '../../modelos/municipio.model';
import { Cliente } from '../../modelos/cliente.model';
import { EstadosService } from '../../servicios/estados.service';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss']
})
export class AltaClienteComponent implements OnInit {
  @ViewChild('clienteForm') clienteForm: NgForm;
  @Output() cargandoEvento = new EventEmitter(true);
  conFactura: string = 'No';
  estados: Estado[];
  estado: Estado;
  municipios: Municipio[];
  municipio: Municipio;
  cliente: Cliente = new Cliente();
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
    this.crearVistaCargando(true, 'Registrando cliente...')
    this.clienteService.registrarCliente(this.cliente).subscribe(
      (registrado: any) => {
        this.crearVistaCargando(false);
        this.clienteForm.resetForm();
        this.toastr.success('Cliente registrado', 'El cliente ha sido registrado exitosamente', { closeButton: true });
      },
      (err: any) => {
        this.crearVistaCargando(false);
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  buscarMunicipios() {
    this.cliente.estado = this.estado.nombre;
    this.crearVistaCargando(true, 'Obteniendo municipios...')
    this.estadosService.obtenerMunicipios(this.estado._id).subscribe(
      (municipios) => {
        this.crearVistaCargando(false);
        this.municipios = municipios;
      },
      (err: HttpErrorResponse) => {
        this.crearVistaCargando(false);
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )

  }
  setMunicipio() {
    this.cliente.municipio = this.municipio.nombre;
  }
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
}
