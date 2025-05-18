import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '@/components/login/Login';
import Register from '@/components/login/Register';

export default function Navigation() {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
}
