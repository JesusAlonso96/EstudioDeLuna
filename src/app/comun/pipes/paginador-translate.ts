import { MatPaginator, MatPaginatorIntl } from '@angular/material';
import { Injectable } from "@angular/core";

@Injectable()
export class PaginadorTraductor extends MatPaginatorIntl{
    constructor() {
        super();
        this.nextPageLabel = 'Siguiente pagina';
        this.previousPageLabel = 'Pagina anterior';
        this.itemsPerPageLabel = 'Items por pagina';
    }
}