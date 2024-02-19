export interface User {
    _id?: string;
    nombre: string;
    primerApellido: string;
    segundoApellido?: string;
    calle: string;
    numero: string;
    colonia: string;
    codigoPostal: string;
    telefono: string;
    rfc: string;
    estatus: string;
    observaciones?: string;
  }

  export interface Documento {
    _id : string;
    nombre: string;
    path: string;
    userId: string;
    contenido: string;
  }
  
  export interface ArrayDocNames {
    _id : string,
    nombre: string
  }
  
  export interface DocumentToUpLoad {
    nombre : string;
  }
  
  export interface TotalDocumentos {
    id: number;
    nombre: string;
  }