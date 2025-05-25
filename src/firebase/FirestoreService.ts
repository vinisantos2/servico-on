// firestoreService.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';

// 🆕 Criar documento
export const criarDocumento = async (colecao: string, dados: any) => {
  const docRef = await addDoc(collection(db, colecao), dados);
  return docRef.id;
};

// 📄 Ler todos os documentos da coleção
export const listarDocumentos = async (colecao: string) => {
  const querySnapshot = await getDocs(collection(db, colecao));
  const dados: any[] = [];
  querySnapshot.forEach((doc) => {
    dados.push({ id: doc.id, ...doc.data() });
  });
  return dados;
};

// 🔍 Ler um documento por ID
export const buscarDocumentoPorId = async (colecao: string, id: string) => {
  const docRef = doc(db, colecao, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Documento não encontrado');
  }
};

// ✏️ Atualizar um documento
export const atualizarDocumento = async (
  colecao: string,
  id: string,
  novosDados: any
) => {
  const docRef = doc(db, colecao, id);
  await updateDoc(docRef, novosDados);
};

// 🗑️ Deletar um documento
export const deletarDocumento = async (colecao: string, id: string) => {
  const docRef = doc(db, colecao, id);
  await deleteDoc(docRef);
};
