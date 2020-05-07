import { trigger, state, style, transition, animate, group } from '@angular/animations';


export const Animaciones = {
    deslizarAbajo: trigger('primerEstado', [
        state('void', style({
            transform: 'translateY(-100%)',
            opacity: 0
        })),
        transition(':enter', [
            animate(300, style({
                transform: 'translateY(0)',
                opacity: 1
            }))
        ]),
        transition('* => void', [
            animate(200, style({
                transform: 'translateY(-100%)',
                opacity: 0
            }))
        ])
    ]),
    deslizarDerecha: trigger('deslizarDerecha', [
        state('void', style({
            transform: 'translateX(-100%)',
            opacity: 0
        })),
        transition(':enter', [
            animate(300, style({
                transform: 'translateX(0)',
                opacity: 1
            }))
        ]),
        transition('* => void', [
            animate(200, style({
                transform: 'translateX(-100%)',
                opacity: 0
            }))
        ])
    ]),
    carga: trigger('carga', [
        state('in', style({ opacity: 1 })),
        transition(':enter', [
            style({ opacity: 0 }),
            animate(300)
        ]),
        transition(':leave',
            animate(300, style({ opacity: 0 })))
    ]),
    toggle: trigger('openClose', [
        state('open', style({
            height: '*',
            opacity: 1,
            visibility: 'visible'
        })),
        state('closed', style({
            height: 0,
            opacity: 0,
            visibility: 'hidden'
        })),
        transition('open => closed', [
            style({ height: '*', opacity: 1 }),
            group([
                animate(200, style({ height: 0 })),
                animate('100ms ease-in-out', style({ opacity: 0 }))
            ])
        ]),
        transition('closed => open', [
            style({ height: 0, opacity: 0 }),
            group([
                animate(200, style({ height: '*' })),
                animate('300ms ease-in-out', style({ opacity: 1 }))
            ])
        ]),
    ]),
    rotacion: trigger('rotacion', [
        state('inicial', style({ transform: 'rotate(0)' })),
        state('rotado', style({ transform: 'rotate(-180deg)' })),
        transition('rotado => inicial', animate('200ms ease-out')),
        transition('inicial => rotado', animate('200ms ease-in'))
    ]),
    deslizar: trigger('slideInOut', [
        state('abierto', style({
            'max-height': '100%', opacity: 1, visibility: 'visible'
        })),
        state('cerrado', style({
            'max-height': '0px', opacity: 0, visibility: 'hidden'
        })),
        transition('abierto => cerrado', [group([

            animate('200ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('200ms ease-in-out', style({
                opacity: 0
            })),
            animate('200ms ease-in-out', style({
                visibility: 'hidden'
            }))
        ]
        )]),
        transition('cerrado => abierto', [group([
            animate('200ms ease-in-out', style({
                opacity: 1
            })),
            animate('200ms ease-in-out', style({
                'max-height': '100%'
            })),
            animate('200ms ease-in-out', style({
                visibility: 'visible'
            })),
        ]
        )])
    ]),
}