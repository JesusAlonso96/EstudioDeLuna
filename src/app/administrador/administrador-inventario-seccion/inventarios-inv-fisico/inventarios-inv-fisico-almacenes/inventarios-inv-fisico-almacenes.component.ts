import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Almacen, InsumoAlmacen, Movimiento } from 'src/app/comun/modelos/almacen.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { InventarioService } from 'src/app/comun/servicios/inventario.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InventariosInvFisicoAlmacenesExistenciasModalComponent } from './inventarios-inv-fisico-almacenes-existencias-modal/inventarios-inv-fisico-almacenes-existencias-modal.component';
import { InventariosInvFisicoAlmacenesAltaModalComponent } from './inventarios-inv-fisico-almacenes-alta-modal/inventarios-inv-fisico-almacenes-alta-modal.component';
import { Inventario, InsumoInventario } from 'src/app/comun/modelos/inventario.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-inventarios-inv-fisico-almacenes',
  templateUrl: './inventarios-inv-fisico-almacenes.component.html',
  styleUrls: ['./inventarios-inv-fisico-almacenes.component.scss']
})
export class InventariosInvFisicoAlmacenesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<Almacen>;
  columnas: string[] = ['id', 'nombre', 'direccion', 'existencias', 'hacerInventario'];
  cargando: boolean = false;
  contadorInsumosActualizados: number;

  constructor(
    private almacenService: AlmacenService,
    private inventarioService: InventarioService,
    private toastr: NgToastrService,
    private dialog: MatDialog,
    private cargandoService: CargandoService
  ) { }

  ngOnInit() {
    this.obtenerAlmacenes();
  }

  obtenerAlmacenes() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Cargando almacenes');
    this.almacenService.obtenerAlmacenes().subscribe(
      (almacenes: Almacen[]) => {
        this.inicializarTabla(almacenes);
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  inicializarTabla(almacenes: Almacen[]) {
    this.datosTabla = new MatTableDataSource(almacenes);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.sort = this.sort;
    this.datosTabla.filterPredicate = (elemento: Almacen, filtro: string) => {
      return elemento.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }

  aplicarFiltroBusqueda() {
    this.datosTabla.filter = this.busquedaElemento.trim().toLowerCase();
  }

  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }

  verExistencias(almacen: Almacen) {
    this.dialog.open(InventariosInvFisicoAlmacenesExistenciasModalComponent, {
      data: almacen
    });
  }
  nuevoInventario(almacen: Almacen) {
    const dialogRef = this.dialog.open(InventariosInvFisicoAlmacenesAltaModalComponent, {
      disableClose:true,
      width:'80%',
      data: almacen
    });
    dialogRef.afterClosed().subscribe((res: Inventario) => {
      if (res) {
        this.agregarInventario(res);
      }
    })
  }

  agregarInventario(inventarioActualizar: Inventario) {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Agregando inventario');
    this.contadorInsumosActualizados = 0;
    this.inventarioService.nuevoInventario(inventarioActualizar).subscribe(
      (inventario: Inventario) => {
        this.toastr.abrirToastr('exito',`Se ha agregado exitosamente el inventario del almacen ${inventario.almacen}`, 'Inventario agregado exitosamente');
        inventarioActualizar.insumos.forEach(insumo => {
          console.log(insumo);
          if (insumo.revisado && insumo.existenciaEsperada != insumo.existenciaReal) {
            console.log("Si se va a actualizar");
            this.contadorInsumosActualizados++;
            this.actualizarInsumoAlmacen(<string>inventario.almacen, insumo.insumo._id, this.obtenerDatosMovimiento(insumo, inventario));
          }
        });
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerDatosMovimiento(insumo: InsumoInventario, inventario: Inventario): Movimiento {
    let movimiento = new Movimiento();
    movimiento.cantidadMovimiento = Math.abs(insumo.existenciaEsperada - insumo.existenciaReal);
    movimiento.insumo = insumo.insumo;
    movimiento.observaciones = insumo.observaciones;
    movimiento.inventario = inventario._id;
    movimiento.tipo =  (insumo.existenciaEsperada - insumo.existenciaReal) > 0 ? 'Baja inventario' : 'Alta inventario';
    return movimiento;
  }

  actualizarInsumoAlmacen(idAlmacen: string, idInsumo: string, movimiento: Movimiento){
    this.almacenService.actualizarInsumoAlmacen(idAlmacen, idInsumo, movimiento).subscribe(
      (almacen: Almacen) => {
        console.log("Si se actualizo");
        this.contadorInsumosActualizados--;
        if (this.contadorInsumosActualizados == 0) {
          this.cargando = this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('exito',`Se han actualizado exitosamente las existencias del almacen ${idAlmacen}`, 'Existencias actualizadas exitosamente');
        }
      }, (err: HttpErrorResponse) => {
        this.contadorInsumosActualizados--;
        if (this.contadorInsumosActualizados == 0) {
          this.cargando = this.cargandoService.crearVistaCargando(false);
        }
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }
}
