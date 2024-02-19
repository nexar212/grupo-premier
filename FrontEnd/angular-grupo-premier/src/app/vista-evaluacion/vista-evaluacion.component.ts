import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {ErrorStateMatcher} from '@angular/material/core';
import {ActivatedRoute,Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../services/servicio_usuario.service';

import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-vista-evaluacion',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatIconModule, MatButtonModule],
  templateUrl: './vista-evaluacion.component.html',
  styleUrl: './vista-evaluacion.component.css'
})
export class VistaEvaluacionComponent {
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router){}
  
  userId: string = '';
  userStatus: string = '';
  usuarioEvaluacion = new FormGroup({
    nombre: new FormControl('',),
    primerApellido:  new FormControl(''),
    segundoApellido: new FormControl(''),
    calle: new FormControl(''),
    numero: new FormControl(''),
    colonia: new FormControl(''),
    codigoPostal: new FormControl(''),
    telefono: new FormControl(''),
    rfc: new FormControl(''),
    estatus: new FormControl('')
  })

  usuariObservaciones = new FormGroup({
    observaciones: new FormControl('', [Validators.required])
  })

  autorizarProspecto(){
    this.userService.cambiarEstatus(this.userId, 'Autorizado', '').subscribe(
      () => {
        console.log('Se actualizó correctamente')
        this.router.navigate(['/listado']);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }

  rechazarProspecto() {
    if(this.usuariObservaciones.valid){
      this.userService.cambiarEstatus(this.userId, 'Rechazado', this.usuariObservaciones.value.observaciones!).subscribe(
        () => {
          this.router.navigate(['/listado']);
          console.log('Se actualizó correctamente')
        },
        (error) => {
          console.error('Error al descargar el archivo:', error);
        }
      );
    }else{
      console.log('Se requiere llenar el campo observaciones')
    }
  }

  regresarListado() {
    this.router.navigate(['/listado']);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const data = JSON.parse(params['userData']);
      this.userId = data._id;
      this.userStatus = data.estatus;
      this.usuarioEvaluacion.patchValue({
        nombre : data.nombre,
        primerApellido : data.primerApellido,
        segundoApellido : data.segundoApellido,
        calle : data.calle,
        codigoPostal : data.codigoPostal,
        colonia : data.colonia,
        numero : data.numero,
        rfc : data.rfc,
        telefono : data.telefono,
        estatus: data.estatus,
      })

      if(data.estatus !== 'Enviado'){
        this.usuariObservaciones.patchValue({
          observaciones : data.observaciones
        })

        this.usuariObservaciones.disable()
      }
      
      this.usuarioEvaluacion.disable()
    });
  }
}
