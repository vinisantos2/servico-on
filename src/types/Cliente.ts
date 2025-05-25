import { Timestamp } from "firebase/firestore";
import { Comentario } from "./Comentario";

export interface Cliente {
  id: string;
  nome: string;
  descricaoParceiro?: string;
  createdAt?: Timestamp;
  avaliacao?: number;
  comentarios?: Array<Comentario>
}