import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { Parceiro } from "../types/Parceiro";
import { buscarDocumentoPorId } from "../firebase/FirestoreService";
import { TABELA_PARCEIROS } from "../firebase/Constansts";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { Servico } from "../types/Servico";
import CardViewPerfil from "../components/CardViewPerfil";

export default function ParceiroPerfil({ route }) {
  const { idParceiro } = route.params ?? {};
  const [parceiro, setParceiro] = useState<Parceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [clienteLogado, setClienteLogado] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setClienteLogado(!!user);
    });

    const q = query(
      collection(db, "servicos"),
      where("idParceiro", "==", idParceiro)
    );

    const unsubscribeServicos = onSnapshot(q, (snapshot) => {
      const lista: Servico[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Servico, "id">),
      }));
      setServicos(lista);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeServicos();
    };
  }, [idParceiro]);

  useEffect(() => {
    async function fetchParceiro() {
      try {
        const p = await buscarDocumentoPorId(TABELA_PARCEIROS, idParceiro);
        setParceiro(p);
      } catch (error) {
        console.error("Erro ao buscar parceiro:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchParceiro();
  }, [idParceiro]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!parceiro) {
    return (
      <View style={styles.center}>
        <Text>Parceiro não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {parceiro.imagem ? (
        <Image source={{ uri: parceiro.imagem }} style={styles.imagem} />
      ) : (
        <View style={[styles.imagem, styles.placeholder]}>
          <Text style={{ color: "#999" }}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.content}>
        <CardViewPerfil clienteLogado={clienteLogado} parceiro={parceiro} />

        {servicos.length > 0 && (
          <View style={styles.servicosContainer}>
            <Text style={styles.servicosTitulo}>Serviços oferecidos</Text>
            <FlatList
              data={servicos}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.titulo}>{item.nome}</Text>
                  <Text>{item.descricao}</Text>
                  <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagem: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 16,
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  valor: {
    fontSize: 16,
    marginTop: 4,
    color: "#333",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
  },
  servicosContainer: {
    width: "100%",
    marginTop: 24,
  },
  servicosTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
    alignSelf: "flex-start",
  },
});
