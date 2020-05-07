import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { InsumoInventario, Inventario } from 'src/app/comun/modelos/inventario.model';
import { MatSort, MatPaginator, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InventarioService } from 'src/app/comun/servicios/inventario.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { InventariosInvFisicoAlmacenesExistenciasModalComponent } from '../../inventarios-inv-fisico-almacenes/inventarios-inv-fisico-almacenes-existencias-modal/inventarios-inv-fisico-almacenes-existencias-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventarios-inv-fisico-historial-existencias-modal',
  templateUrl: './inventarios-inv-fisico-historial-existencias-modal.component.html',
  styleUrls: ['./inventarios-inv-fisico-historial-existencias-modal.component.scss']
})
export class InventariosInvFisicoHistorialExistenciasModalComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<InsumoInventario>;
  columnas: string[] = ['revisado', 'id', 'producto', 'cantidadEsperada', 'cantidadReal', 'observaciones'];
  cargando: boolean = false;

  constructor(
    private inventarioService: InventarioService,
    private toastr: NgToastrService,
    public dialogRef: MatDialogRef<InventariosInvFisicoAlmacenesExistenciasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inventario) { 
    }

  ngOnInit(): void {
    this.obtenerInventarioPorId();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerInventarioPorId() {
    this.cargando = true;
    this.inventarioService.obtenerInventarioPorId(this.data._id).subscribe(
      (inventario: Inventario) => {
        this.inicializarTabla(inventario.insumos);
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
}
