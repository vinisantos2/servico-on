import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Servico } from "../types/Servico";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ROTA_PERFIL_PARCEIRO } from "../routas/Rotas";
import { RootStackParamList } from "../types/navigation";

interface Props {
  item: Servico;
}

export default function CardViewAnuncio({ item }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  function navTelaPerfil() {
    const idParceiro = item.idParceiro
    navigation.navigate(ROTA_PERFIL_PARCEIRO, { idParceiro })

  }
  return (
    <TouchableOpacity style={styles.card}
      onPress={navTelaPerfil}
    >
      <Text style={styles.titulo}>{item.nome}</Text>
      <Text>{item.descricao}</Text>
      {item.valor !== undefined && (
        <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
      )}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3, // para Android
    shadowColor: '#000', // para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  titulo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },

  valor: {
    fontSize: 14,
    color: '#555',
  },
});
