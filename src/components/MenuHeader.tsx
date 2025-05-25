import { IconButton, Menu } from "react-native-paper";
import { ROTA_EDIT_PARCEIRO, ROTA_HOME_CLIENTE } from "../routas/Rotas";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/FirebaseConfig";

export function MenuHeader({ navigation }: any) {
    const [visible, setVisible] = useState(false);
  

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            closeMenu();
            navigation.reset({
                index: 0,
                routes: [{ name: ROTA_HOME_CLIENTE }],
            });
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    const editarParceiro = () => {
        navigation.navigate(ROTA_EDIT_PARCEIRO)
    };

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={openMenu}
                    accessibilityLabel="Menu"
                />
            }
        >
            <Menu.Item
                title={"Perfil"}
                onPress={editarParceiro}
            />

            <Menu.Item
                title={`Sair (${auth.currentUser?.email})`}
                onPress={handleLogout}
            />

        </Menu>
    );
}