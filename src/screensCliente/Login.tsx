import { useIsFocused, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/FirebaseConfig';
import { ROTA_CADASTRO, ROTA_HOME_CLIENTE, ROTA_HOME_PARCEIRO } from '../routas/Rotas';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [isClient, setIsClient] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [msgErro, setMsgErro] = useState("");

  useEffect(() => {
    if (isFocused) {
      limpar();
    }
  }, [isFocused]);

  function limpar() {
    setMsgErro("");
    setEmail("");
    setPassword("");
    setCarregando(false);
  }


  const handleLogin = async () => {
    setCarregando(true);
    setMsgErro('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Verifica se é parceiro
      const parceiroRef = doc(db, 'parceiros', uid);
      const parceiroSnap = await getDoc(parceiroRef);

      if (parceiroSnap.exists()) {
        navigation.reset({
          index: 0,
          routes: [{ name: ROTA_HOME_PARCEIRO }],
        });
        return;
      }

      // Verifica se é cliente
      const clienteRef = doc(db, 'clientes', uid);
      const clienteSnap = await getDoc(clienteRef);

      if (clienteSnap.exists()) {
        navigation.reset({
          index: 0,
          routes: [{ name: ROTA_HOME_CLIENTE }],
        });
        return;
      }

      setMsgErro("Usuário autenticado, mas não cadastrado como cliente ou parceiro.");

    } catch (error: any) {
      console.error(error);
      setMsgErro("Falha no login: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Login</Text>

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
        value={password}
        onChangeText={setPassword}
      />

      {msgErro !== "" && <Text style={styles.error}>{msgErro}</Text>}

      <Text style={styles.selected}>Tipo: {isClient ? 'Cliente' : 'Parceiro'}</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <Button title="Entrar" onPress={handleLogin} />
          <View style={{ marginTop: 12 }}>
            <Button
              title="Cadastrar"
              color="#888"
              onPress={() => navigation.navigate(ROTA_CADASTRO)}
            />
          </View>
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
