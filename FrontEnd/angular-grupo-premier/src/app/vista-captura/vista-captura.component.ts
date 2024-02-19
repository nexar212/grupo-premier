import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../services/servicio_usuario.service';
import { User, ArrayDocNames, Documento, DocumentToUpLoad, TotalDocumentos } from '../models/modelo_usuario';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-vista-captura',
  standalone: true,
  imports: [MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatTooltipModule, MatCardModule],
  templateUrl: './vista-captura.component.html',
  styleUrl: './vista-captura.component.css'
})
export class VistaCapturaComponent {

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }
  
  nombre: any;
  documents : DocumentToUpLoad[] = [];
  totalDocumentos : TotalDocumentos[] = [ { id : 1 , nombre: ''}];
  primerArchivo : Boolean = true;
  
  agregarNuevoDocumento () {
    this.primerArchivo ? this.primerArchivo = false : null;
    this.totalDocumentos.push({id: this.documents.length, nombre: ''})
  }

  quitarDocumento (index: number) {
    if(this.totalDocumentos.length > 1) {
      this.totalDocumentos.splice(index, 1)
      this.selectedFiles.splice(index,1)
    }
  }

  selectedFiles: File[] = [];
  onFileSelected(event: any, index: number) {
    this.primerArchivo ? this.primerArchivo = false : null;
    debugger
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
      this.totalDocumentos[index].nombre = files[i].name
    }
  }

  clickDeleteDocument(idx: number) {
    this.documents.splice(idx, 1);
  }
  
  matcher = new MyErrorStateMatcher();
  usuario = new FormGroup({
    nombre: new FormControl('',[Validators.required]),
    primerApellido:  new FormControl('',[Validators.required]),
    segundoApellido: new FormControl(''),// Opcional
    calle: new FormControl('',[Validators.required]),
    numero: new FormControl('',[Validators.required]),
    colonia: new FormControl('',[Validators.required]),
    codigoPostal: new FormControl('',[Validators.required]),
    telefono: new FormControl('',[Validators.required]),
    rfc: new FormControl('',[Validators.required])
  })

  uploadFiles(userId : any) {
    if (this.selectedFiles.length > 0) {
      this.userService.uploadFiles(this.selectedFiles, userId)
        .subscribe(
          response => {
            console.log('Archivos subidos exitosamente:', response);
          },
          error => {
            console.error('Error al subir archivos:', error);
          }
        );
    }
  }

  guardarUsuario(): void {
    if (this.usuario.valid && this.selectedFiles.length > 0 ) {
      const userData: User = this.usuario.value as User;
      
      this.userService.createUser(userData).subscribe(
        usuarioGuardado => {
          this.uploadFiles(usuarioGuardado._id)

          this.usuario.reset();
          this.selectedFiles = [];
          this.totalDocumentos = [{ id : 1 , nombre: ''}];
        },
        error => {
          console.error('Error al guardar el usuario:', error);
        }
      );
    } else {
    }
  }

  dataDocuments: Documento[] = [
    {
      _id : '',
      nombre: '',
      path: '',
      userId: '',
      contenido: '',
    }
  ];

  descargarArchivo(docId : string, docName: string): void {
    this.userService.downloadFile(docId,docName).subscribe(
      (data: any) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = docName;
        link.click();
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }

  arrDocNames : ArrayDocNames[] = [];
  obtenerNomDocumentos(userId:string) {
    this.userService.getDocName(userId).subscribe(
      (data: any) => {
        this.arrDocNames = data;
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }

  clickSalir () {
    if(this.desdeListado){
      this.desdeListado = false
      this.usuario.reset();
      this.arrDocNames = [];
      this.primerArchivo = true
      this.usuario.enable()
      console.log(this.totalDocumentos, this.selectedFiles)
    }else{
      this.router.navigate(['/']);
    }
  }

  desdeListado : boolean = false;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.desdeListado = Boolean(params['desdeListado']);
      const data = JSON.parse(params['userData']);

      if(this.desdeListado){
        this.usuario.disable()
        this.obtenerNomDocumentos(data._id);
      }

      this.usuario.patchValue({
        nombre : data.nombre,
        primerApellido : data.primerApellido,
        segundoApellido : data.segundoApellido,
        calle : data.calle,
        codigoPostal : data.codigoPostal,
        colonia : data.colonia,
        numero : data.numero,
        rfc : data.rfc,
        telefono : data.telefono
      })
    });
  }
}
