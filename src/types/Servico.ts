import { Timestamp } from "firebase/firestore";
import { Comentario } from "./Comentario";

export interface Servico {
    id: string;
    nome: string;
    nomeParceiro?: string; // denormalizado para acesso rápido
    idParceiro?: string;
    valor: number;
    avaliacao: number;
    descricao?: string;
    createdAt?: Timestamp;
    comentarios: Array<Comentario>
}