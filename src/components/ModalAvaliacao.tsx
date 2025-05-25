import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase/FirebaseConfig";
import { collection, addDoc, Timestamp, serverTimestamp } from "firebase/firestore";

type Props = {
  visivel: boolean;
  onFechar: () => void;
  idCliente: string;
};

export default function ModalAvaliacao({ visivel, onFechar, idCliente }: Props) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  const handleEnviar = async () => {
    if (nota < 1) return alert("Escolha uma nota antes de enviar.");
    const avaliacao = {
      idCliente: idCliente,
      nomeCliente: auth.currentUser?.email,
      comentario: comentario,
      data: serverTimestamp(),
      nota: nota
    };

    try {
      await addDoc(collection(db, "avaliacoes"),
        avaliacao
      );
      alert("Avaliação enviada!");
      onFechar();
      setNota(0);
      setComentario("");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação.");
    }
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.titulo}>Avaliar Parceiro</Text>

          <View style={styles.estrelas}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setNota(n)}>
                <Ionicons
                  name={n <= nota ? "star" : "star-outline"}
                  size={32}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Comentário (opcional)"
            value={comentario}
            onChangeText={setComentario}
            style={styles.input}
            multiline
          />

          <View style={styles.botoes}>
            <Button title="Cancelar" onPress={onFechar} />
            <Button title="Enviar" onPress={handleEnviar} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  estrelas: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
