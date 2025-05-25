import { Timestamp } from "firebase/firestore";

export interface Parceiro {
    id: string;
    imagem?: string
    nome: string;
    descricao: string;
    avaliacao: number;
    createdAt?: Timestamp;
    contato: string
    endereco: string
    localizacao?: {
        latitude: number;
        longitude: number;
    }
}