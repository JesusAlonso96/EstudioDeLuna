import { Component, OnInit } from '@angular/core';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { CorteCaja } from 'src/app/comun/modelos/corte_caja.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { Caja } from 'src/app/comun/modelos/caja.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-historial-cortes-caja',
  templateUrl: './historial-cortes-caja.component.html',
  styleUrls: ['./historial-cortes-caja.component.scss']
})
export class HistorialCortesCajaComponent implements OnInit {
  caja: Caja = new Caja();
  cajas: Caja[] = [];
  cortes: CorteCaja[];
  totalContado: number = 0;
  cargando: boolean = false;
  constructor(private adminService: AdministradorService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService,
    private cajasService: CajaService) { }

  ngOnInit() {
    this.obtenerCajas();
  }
  obtenerCajas() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo cajas');
    this.cajasService.obtenerCajas().subscribe(
      (cajas: Caja[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.cajas = cajas;
        console.log(this.cajas);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  buscarCortes(idCaja: string){
    this.cargando = this.cargandoService.crearVistaCargando(true,'Buscando cortes');
    this.cajasService.obtenerCortesCaja(idCaja).subscribe(
      (cortes: CorteCaja[])=>{
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.cortes = cortes;
      },
      (err: HttpErrorResponse)=>{
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.titulo,err.error.detalles);
      }
    );
  }
  /*
  obtenerHistorial() {
    this.adminService.obtenerHistorialCortes().subscribe(
      (cortesCaja) => {
        this.cortes = cortesCaja;
        console.log(this.cortes);
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }*/
  menorIgualCero(efectivoContado: number, tarjetaContado: number, efectivoEsperado: number, tarjetaEsperado: number) {
    const diferencia = (efectivoContado + tarjetaContado) - (efectivoEsperado + tarjetaEsperado);
    console.log(diferencia);
    if (diferencia < 0) {
      return 0;
    } else if (diferencia == 0) {
      return 1;
    } else {
      return 2;
    }
  }

}
