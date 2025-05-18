// Navigation.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '@/components/login/Login';
import Register from '@/components/login/Register';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
  );
}
