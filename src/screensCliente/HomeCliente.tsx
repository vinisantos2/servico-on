import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/FirebaseConfig';
import CardViewAnuncio from '../components/CardViewAnuncio';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
}

export default function HomeCliente() {
  const [servicos, setServicos] = useState<Array<Servico>>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'servicos'), (snapshot) => {
      const lista: Servico[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Servico, 'id'>),
      }));
      setServicos(lista);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Anúncios de Serviços</Text>

      <FlatList<Servico>
        data={servicos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardViewAnuncio item={item} />}
        ListEmptyComponent={<Text>Nenhum serviço disponível no momento.</Text>}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

});
