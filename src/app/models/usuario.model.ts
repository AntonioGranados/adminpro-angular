// Creamos el modelo de usuario
export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string, // El ? significa que es opcional
        public role?: string,
        public google?: boolean,
        public _id?: string

    ) {}
}
