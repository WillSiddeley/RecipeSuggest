import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/components/TabNavigator';

// Recipe search / image API:
// https://developer.edamam.com/recipe-demo

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

