import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import * as html2pdf from 'html2pdf.js';
import { Cotizacion } from 'src/app/comun/modelos/cotizacion.model';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';

@Component({
  selector: 'app-ver-cotizacion',
  templateUrl: './ver-cotizacion.component.html',
  styleUrls: ['./ver-cotizacion.component.scss']
})
export class VerCotizacionComponent implements OnInit {
  @ViewChild('cotizacionPdf') cotizacionPdf: ElementRef;
  displayedColumns: string[] = ['cantidad', 'descripcion', 'precio', 'subtotal'];
  listData: MatTableDataSource<ProductoCot>;

  constructor(
    public dialogRef: MatDialogRef<VerCotizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public cotizacion: Cotizacion) { }

  ngOnInit() {
    this.inicializarTabla();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  descargarCotizacion(num_cotizacion: number) {
    const opciones = {
      filename: `Cotización UTR-${num_cotizacion}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf().from(this.cotizacionPdf.nativeElement).set(opciones).save();
  }
  obtenerSubtotalPorProducto(producto: ProductoCot): number {
    return producto.cantidad * <number>producto.producto.precio;
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.cotizacion.productos);
  }
}
