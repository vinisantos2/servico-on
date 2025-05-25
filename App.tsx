import { PaperProvider } from 'react-native-paper';
import StackNavigator from './src/routas/Stack';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

