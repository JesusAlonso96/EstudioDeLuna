import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InsumoAlmacen, Almacen } from 'src/app/comun/modelos/almacen.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventarios-inv-fisico-almacenes-existencias-modal',
  templateUrl: './inventarios-inv-fisico-almacenes-existencias-modal.component.html',
  styleUrls: ['./inventarios-inv-fisico-almacenes-existencias-modal.component.scss']
})
export class InventariosInvFisicoAlmacenesExistenciasModalComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<InsumoAlmacen>;
  columnas: string[] = ['id', 'nombre', 'existencia'];
  cargando: boolean = false;

  constructor(
    private almacenService: AlmacenService,
    private toastr: NgToastrService,
    public dialogRef: MatDialogRef<InventariosInvFisicoAlmacenesExistenciasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Almacen) { }

  ngOnInit(): void {
    this.obtenerAlmacen();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerAlmacen() {
    this.cargando = true;
    this.almacenService.obtenerAlmacenPorId(this.data._id).subscribe(
      (almacen: Almacen) => {
        this.inicializarTabla(almacen.insumos);
        this.cargando = false;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  inicializarTabla(insumos: InsumoAlmacen[]) {
    this.datosTabla = new MatTableDataSource(insumos);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.sort = this.sort;
    this.datosTabla.filterPredicate = (elemento: InsumoAlmacen, filtro: string) => {
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
