import { Timestamp } from "firebase/firestore";
import { Avaliacao } from "./Avaliacao";

export interface Cliente {
  id: string;
  nome: string;
  descricaoParceiro?: string;
  createdAt?: Timestamp;
  avaliacao?: number;
  comentarios?: Array<Avaliacao>
}