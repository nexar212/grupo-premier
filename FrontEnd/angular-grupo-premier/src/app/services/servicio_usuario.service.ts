import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/modelo_usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:5038/api/grupopremier/users';
    private uploadUrl = 'http://localhost:5038/api/grupopremier/upload';
    private getFilesUrl = 'http://localhost:5038/api/grupopremier/download';
    private getDocNamesUrl = 'http://localhost:5038/api/grupopremier/download/docNames'
    private putEstatusUrl = 'http://localhost:5038/api/grupopremier/estatus'

    constructor(private http: HttpClient) {}

    // Obtener todos los usuarios
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    // Crear un nuevo usuario
    createUser(user: User): Observable<User> {
        console.log('usaurio en service: ',user)
        return this.http.post<User>(this.apiUrl, user);
    }

    // Método para subir archivos
    uploadFiles(files: File[], userId: string): Observable<any> {
        const formData: FormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('archivos', files[i], files[i].name);
        }
        // Agregar el ID del usuario al formData
        formData.append('userId', userId);
        
        return this.http.post<any>(this.uploadUrl, formData);
    }

    // Obtener datos de documentos subidos por el usuarioo
    getDocName(userId: string): Observable<any> {
        return this.http.post<any>(this.getDocNamesUrl, {userId});
    }

    // Descargar un archivo
    downloadFile(docId: string, docName: string): Observable<any> {
        return this.http.get(`${this.getFilesUrl}/${docId}/${docName}`, { responseType: 'blob' });
    }

    // Cambiar estatus enviado/rechazado/autorizado
    cambiarEstatus(userId: string, status: string, observaciones: string): Observable<string> {
        const url = `${this.putEstatusUrl}`;
        return this.http.post<string>(url, {userId, status, observaciones});
    }
}