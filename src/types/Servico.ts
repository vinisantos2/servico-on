import { Timestamp } from "firebase/firestore";
import { Avaliacao } from "./Avaliacao";

export interface Servico {
    id: string;
    nome: string;
    nomeParceiro?: string; // denormalizado para acesso rápido
    idParceiro?: string;
    valor: number;
    avaliacao: number;
    descricao?: string;
    createdAt?: Timestamp;
    comentarios: Array<Avaliacao>
}