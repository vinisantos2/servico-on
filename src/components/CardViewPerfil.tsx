import { Button, StyleSheet, Text, View } from "react-native";
import Avaliacao from "./Avaliacao";
import { Parceiro } from "../types/Parceiro";
import ModalAvaliacao from "./ModalAvaliacao";
import { useState } from "react";

type Props = {
  parceiro: Parceiro
  clienteLogado: boolean
}

export default function CardViewPerfil({ parceiro, clienteLogado }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{parceiro.nome}</Text>
      <Avaliacao nota={parceiro.nome} />
      <Text style={styles.descricao}>{parceiro.descricao}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Contato:</Text>
        <Text style={styles.texto}>{parceiro.contato}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.texto}>{parceiro.endereco}</Text>
      </View>

      {parceiro.localizacao && (
        <Text style={styles.localizacao}>
          📍 Lat: {parceiro.localizacao.latitude.toFixed(4)} | Lng:{" "}
          {parceiro.localizacao.longitude.toFixed(4)}
        </Text>
      )}

      {clienteLogado && (
        <View style={{ marginTop: 16 }}>
          <Button
            title="Avaliar este parceiro"
            onPress={() => setModalVisible(true)}
          />
        </View>
      )}

      <ModalAvaliacao
        visivel={modalVisible}
        onFechar={() => setModalVisible(false)}
        idCliente={parceiro.id}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    color: "#555",
  },
  localizacao: {
    marginTop: 10,
    fontSize: 14,
    color: "#777",
  },
  infoBox: {
    marginTop: 10,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  texto: {
    fontSize: 15,
    color: "#555",
  },
});
