import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../services/servicio_usuario.service';
import { User } from '../models/modelo_usuario';
import { Router } from '@angular/router'


@Component({  
  selector: 'app-vista-listado',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './vista-listado.component.html',
  styleUrl: './vista-listado.component.css'
})
export class VistaListadoComponent {
  displayedColumns: string[] = ['nombre', 'primerApellido', 'segundoApellido', 'estatus', 'ver', 'evaluar'];
  dataSource : User[] = [];

  constructor(private userService: UserService, private router: Router) { }
  ngOnInit(): void {
    this.obtenerProspectos();
  }
  archivos: any[] = [];

  obtenerProspectos(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  };

  verProspecto(index: string): void {
    const cadenaData = JSON.stringify(this.dataSource.find( item => item._id === index))
    this.router.navigate(['/captura', { index : index, desdeListado : true, userData : cadenaData}]);
  }

  evaluarProspecto(index: string): void {
    const cadenaData = JSON.stringify(this.dataSource.find( item => item._id === index))
    this.router.navigate(['/evaluacion', { userData : cadenaData }]);
  }
}
