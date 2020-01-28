import { Component, OnInit } from '@angular/core';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { CorteCaja } from 'src/app/comun/modelos/corte_caja.model';

@Component({
  selector: 'app-historial-cortes-caja',
  templateUrl: './historial-cortes-caja.component.html',
  styleUrls: ['./historial-cortes-caja.component.scss']
})
export class HistorialCortesCajaComponent implements OnInit {
  cortes: CorteCaja[] = [];
  totalContado: number = 0;
  constructor(private adminService: AdministradorService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerHistorial();
  }
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
  }
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
