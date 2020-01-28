import { MatPaginator, MatPaginatorIntl } from '@angular/material';

export class PaginadorTraductor extends MatPaginatorIntl{
    constructor() {
        super();
        this.nextPageLabel = 'Siguiente pagina';
        this.previousPageLabel = 'Pagina anterior';
        this.itemsPerPageLabel = 'Items por pagina';
    }
}