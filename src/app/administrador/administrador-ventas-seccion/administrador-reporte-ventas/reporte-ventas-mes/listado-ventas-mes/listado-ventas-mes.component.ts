import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-listado-ventas-mes',
  templateUrl: './listado-ventas-mes.component.html',
  styleUrls: ['./listado-ventas-mes.component.scss']
})
export class ListadoVentasMesComponent implements OnInit {
  displayedColumns: string[] = ['pedido', 'fecha', 'cliente', 'tipo', 'iva', 'total'];
  @ViewChild('contenido', { static: false }) contenido: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ListadoVentasMesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data)
  }
  descargarReporte() {
    const opciones = {
      filename: 'reporte.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf().from(this.contenido.nativeElement).set(opciones).save();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  obtenerTotal(){
    return this.data.ventas.ventas.map( t => t.pedido.total).reduce((acc,value)=> acc + value, 0)
  }

}
