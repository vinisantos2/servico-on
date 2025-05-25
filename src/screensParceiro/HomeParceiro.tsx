import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { auth, db } from '../firebase/FirebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  idParceiro: string;
}

export default function HomeParceiro() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [editandoServico, setEditandoServico] = useState<Servico | null>(null);
  const [carregando, setCarregando] = useState(true);

  const parceiroId = auth.currentUser?.uid;

  useEffect(() => {
    if (!parceiroId) return;

    const q = query(
      collection(db, 'servicos'),
      where('idParceiro', '==', parceiroId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: Servico[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Servico, 'id'>),
      }));
      setServicos(lista);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, [parceiroId]);

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setValor('');
    setEditandoServico(null);
  };

  const validarCampos = () => {
    if (!nome.trim() || !descricao.trim() || !valor.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return false;
    }
    if (isNaN(Number(valor))) {
      Alert.alert('Erro', 'Valor deve ser um número válido');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!parceiroId) return;

    if (!validarCampos()) return;

    const valorNum = Number(valor);

    try {
      if (editandoServico) {
        // Atualiza serviço
        const docRef = doc(db, 'servicos', editandoServico.id);
        await updateDoc(docRef, {
          nome,
          descricao,
          valor: valorNum,
        });
        Alert.alert('Sucesso', 'Serviço atualizado');
      } else {
        // Adiciona novo serviço
        await addDoc(collection(db, 'servicos'), {
          nome,
          descricao,
          valor: valorNum,
          idParceiro: parceiroId,
        });
        Alert.alert('Sucesso', 'Serviço cadastrado');
      }
      limparFormulario();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar serviço');
    }
  };

  const handleEditar = (servico: Servico) => {
    setNome(servico.nome);
    setDescricao(servico.descricao);
    setValor(servico.valor.toString());
    setEditandoServico(servico);
  };

  const handleExcluir = (id: string) => {
    Alert.alert(
      'Confirmação',
      'Deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'servicos', id));
              Alert.alert('Sucesso', 'Serviço excluído');
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Erro ao excluir serviço');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meus Serviços</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Serviço"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor (R$)"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>
            {editandoServico ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
          </Text>
        </TouchableOpacity>

        {editandoServico && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#999', marginTop: 10 }]}
            onPress={limparFormulario}
          >
            <Text style={styles.buttonText}>Cancelar Edição</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>{item.nome}</Text>
            <Text>{item.descricao}</Text>
            <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>

            <View style={styles.botoes}>
              <TouchableOpacity
                style={[styles.btnEditar]}
                onPress={() => handleEditar(item)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnExcluir]}
                onPress={() => handleExcluir(item.id)}
              >
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum serviço cadastrado.</Text>}
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
  form: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  valor: {
    fontSize: 16,
    marginBottom: 8,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnEditar: {
    backgroundColor: '#ffa500',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  btnExcluir: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
