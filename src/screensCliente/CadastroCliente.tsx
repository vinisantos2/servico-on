import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/FirebaseConfig';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { ROTA_HOME_CLIENTE, ROTA_HOME_PARCEIRO } from '../routas/Rotas';

export default function CadastroScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isClient, setIsClient] = useState(true); // true = cliente, false = parceiro

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const tipo = isClient ? 'clientes' : 'parceiros';

      await setDoc(doc(db, tipo, user.uid), {
        nome,
        email,
        uid: user.uid,
        criadoEm: new Date()
      });

      Alert.alert('Sucesso', `${isClient ? 'Cliente' : 'Parceiro'} cadastrado com sucesso!`);

      setNome('');
      setEmail('');
      setSenha('');

      navigation.reset({
        index: 0,
        routes: [{ name: isClient ? ROTA_HOME_CLIENTE : ROTA_HOME_PARCEIRO }],
      });

    } catch (error: any) {
      console.log('Erro ao cadastrar:', error);
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Cliente</Text>
        <Switch
          value={!isClient}
          onValueChange={() => setIsClient((prev) => !prev)}
        />
        <Text style={styles.label}>Parceiro</Text>
      </View>

      <Text style={styles.selected}>Tipo: {isClient ? 'Cliente' : 'Parceiro'}</Text>

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  selected: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '500',
  },

});
