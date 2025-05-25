import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, ScrollView, Text, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { buscarDocumentoPorId, atualizarDocumento } from "../firebase/FirestoreService";
import { TABELA_PARCEIROS } from "../firebase/Constansts";
import { Parceiro } from "../types/Parceiro";

export default function EditParceiro() {
  const [parceiro, setParceiro] = useState<Parceiro | null>(null);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [contato, setContato] = useState("");
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      buscarDocumentoPorId(TABELA_PARCEIROS, user.uid)
        .then((p) => {
          if (p) {
            setParceiro(p);
            setNome(p.nome);
            setDescricao(p.descricao);
            setContato(p.contato);
            setEndereco(p.endereco);
          }
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSalvar = async () => {
    if (!parceiro) return;
    const atualizado = {
      ...parceiro,
      nome,
      descricao,
      contato,
      endereco,
    };

    try {
      await atualizarDocumento(TABELA_PARCEIROS, parceiro.id, atualizado);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text style={styles.label}>Contato</Text>
      <TextInput value={contato} onChangeText={setContato} style={styles.input} />

      <Text style={styles.label}>Endereço</Text>
      <TextInput value={endereco} onChangeText={setEndereco} style={styles.input} />

      <Button title="Salvar Alterações" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
});
