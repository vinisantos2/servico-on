import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  ROTA_CADASTRO,
  ROTA_EDIT_PARCEIRO,
  ROTA_HOME_CLIENTE,
  ROTA_HOME_PARCEIRO,
  ROTA_LOGIN,
  ROTA_PERFIL_PARCEIRO,
} from "./Rotas";

import { auth } from "../firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import HomeCliente from "../screensCliente/HomeCliente";
import LoginScreen from "../screensCliente/Login";
import CadastroScreen from "../screensCliente/CadastroCliente";
import HomeParceiro from "../screensParceiro/HomeParceiro";
import { Button } from "react-native";
import { MenuHeader } from "../components/MenuHeader";
import ParceiroPerfil from "../screensCliente/PerfilParceiro";
import EditParceiro from "../screensParceiro/EditParceiro";

const Stack = createStackNavigator();

export default function StackNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={ROTA_HOME_CLIENTE}
      screenOptions={({ route, navigation }) => {
        // Não mostrar nada no cabeçalho da tela de cadastro
        if (route.name === ROTA_CADASTRO) return {};

        return {
          headerRight: () =>
            isLoggedIn ? (
              <MenuHeader navigation={navigation} />
            ) : (
              <Button
                title="Login"
                onPress={() => navigation.navigate(ROTA_LOGIN)}
              />
            ),
        };
      }}
    >
      <Stack.Screen name={ROTA_HOME_CLIENTE} component={HomeCliente} />
      <Stack.Screen name={ROTA_LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROTA_CADASTRO} component={CadastroScreen} />
      <Stack.Screen name={ROTA_HOME_PARCEIRO} component={HomeParceiro} />
      
      {/* telas do parceiro */}
      <Stack.Screen name={ROTA_PERFIL_PARCEIRO} component={ParceiroPerfil} />
      <Stack.Screen name={ROTA_EDIT_PARCEIRO} component={EditParceiro} />
    </Stack.Navigator>
  );
}
