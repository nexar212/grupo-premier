import { Routes } from '@angular/router';
import { VistaCapturaComponent } from './vista-captura/vista-captura.component';
import { VistaListadoComponent } from './vista-listado/vista-listado.component';
import { VistaEvaluacionComponent } from './vista-evaluacion/vista-evaluacion.component';

export const routes: Routes = [
    {   
        path: '', redirectTo: '', pathMatch: 'full'
    },
    {
        path: 'captura', component: VistaCapturaComponent
    },
    {
        path: 'listado', component: VistaListadoComponent
    },
    {
        path: 'evaluacion', component: VistaEvaluacionComponent
    }
];
