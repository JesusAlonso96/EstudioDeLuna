import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Estado } from '../../modelos/estado.model';
import { Municipio } from '../../modelos/municipio.model';
import { Cliente } from '../../modelos/cliente.model';
import { EstadosService } from '../../servicios/estados.service';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatStepper } from '@angular/material';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss']
})
export class AltaClienteComponent implements OnInit {
  @ViewChild('infoGeneralForm') infoGeneralForm: NgForm;
  @ViewChild('datosFiscalesForm') datosFiscalesForm: NgForm;
  @ViewChild('contactoForm') contactoForm: NgForm;
  @ViewChild('domicilioForm') domicilioForm: NgForm;
  @ViewChild('stepper') stepper: MatStepper;

  @Output() cargandoEvento = new EventEmitter(true);
  conFactura: boolean = false;
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


  seleccionoEstado(): boolean {
    return this.estado ? true : false;
  }
  abrirRegistrarCliente() {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Registrar cliente', mensaje: '¿Desea registrar este cliente?', msgBoton: 'Registrar', color: 'primary' }
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) this.registrarCliente();
    })
  }
  registrarCliente() {
    this.cliente.razonSocial = this.cliente.ape_mat ? this.cliente.nombre + ' ' + this.cliente.ape_pat + ' ' + this.cliente.ape_mat : this.cliente.nombre + ' ' + this.cliente.ape_pat;
    this.crearVistaCargando(true, 'Registrando cliente...')
    this.clienteService.registrarCliente(this.cliente).subscribe(
      (registrado: any) => {
        this.crearVistaCargando(false);
        this.reiniciarFormularios();
        this.toastr.success('Cliente registrado', 'El cliente ha sido registrado exitosamente', { closeButton: true });
      },
      (err: HttpErrorResponse) => {
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
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
  reiniciarFormularios() {
    for(let i=0; i<3;i++){
      this.stepper.previous();
    }
    this.infoGeneralForm.resetForm();
    this.datosFiscalesForm.resetForm();
    this.contactoForm.resetForm();
    this.domicilioForm.resetForm();
  }
}
