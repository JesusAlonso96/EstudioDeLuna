import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InsumoInventario, Inventario } from 'src/app/comun/modelos/inventario.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Almacen, InsumoAlmacen, Movimiento } from 'src/app/comun/modelos/almacen.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventarios-inv-fisico-almacenes-alta-modal',
  templateUrl: './inventarios-inv-fisico-almacenes-alta-modal.component.html',
  styleUrls: ['./inventarios-inv-fisico-almacenes-alta-modal.component.scss']
})
export class InventariosInvFisicoAlmacenesAltaModalComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<InsumoInventario>;
  columnas: string[] = ['revisado', 'id', 'producto', 'cantidadEsperada', 'aumentar', 'cantidadReal', 'disminuir', 'observaciones'];
  cargando: boolean = false;
  inventario: Inventario = new Inventario();

  constructor(
    private almacenService: AlmacenService,
    private toastr: NgToastrService,
    public dialogRef: MatDialogRef<InventariosInvFisicoAlmacenesAltaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Almacen) { }

  ngOnInit(): void {
    this.inventario.almacen = this.data._id;
    this.obtenerAlmacen();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerAlmacen() {
    this.cargando = true;
    this.almacenService.obtenerAlmacenPorId(this.data._id).subscribe(
      (almacen: Almacen) => {
        almacen.insumos.forEach(insumo => {
          this.inventario.insumos.push({
            existenciaEsperada: insumo.existencia,
            existenciaReal: insumo.existencia,
            insumo: insumo.insumo,
            revisado: false
          });
        });
        this.inicializarTabla(this.inventario.insumos);
        this.cargando = false;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  inicializarTabla(insumos: InsumoInventario[]) {
    this.datosTabla = new MatTableDataSource(insumos);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.sort = this.sort;
    this.datosTabla.filterPredicate = (elemento: InsumoInventario, filtro: string) => {
      return elemento.insumo.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }

  aplicarFiltroBusqueda() {
    this.datosTabla.filter = this.busquedaElemento.trim().toLowerCase();
  }

  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }

  aumentarExistencia(insumo: InsumoInventario) {
    insumo.existenciaReal++;
  }

  disminuirExistencia(insumo: InsumoInventario) {
    if(insumo.existenciaReal > 0) {
      insumo.existenciaReal--;
    } else {
      this.toastr.abrirToastr('error', 'No es posible disminuir esta existencia', 'Existencia de ' + insumo.insumo.nombre + ' en 0');
    }
  }

  datosValidosFormulario(): boolean {
    if (this.datosTabla != undefined) {
      let posicionInsumoRevisado = this.datosTabla.data.findIndex(insumo => {
        return insumo.revisado;
      });
      return posicionInsumoRevisado != -1;
    } else {
      return false;
    }
  }

  /*agregarInventario() {
    let insumosAlmacen: InsumoAlmacen[] = [];
    this.inventario.insumos.forEach(insumo => {
        insumosAlmacen.push({
        existencia: insumo.existenciaReal,
        insumo: insumo.insumo,
      });
    });
    this.dialogRef.close({inventario: this.inventario, insumosAlmacen: insumosAlmacen});
  }*/

  agregarInventario() {
    this.dialogRef.close(this.inventario);
  }
}
