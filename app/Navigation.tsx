// Navigation.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Main from '@/app/Main';
import Login from '@/components/login/Login';
import Register from '@/components/login/Register';
import AddPost from '@/components/main/AddPost'; // Adjust path
import PostDetails from '@/components/main/PostDetails';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen
          name="AddPost"
          component={AddPost}
          options={{
            headerShown: true,
            title: 'Add Post',
             headerStyle: {
                backgroundColor: '#0d1117',
              },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetails}
          options={{
            headerShown: true,
            title: 'Post Details',
             headerStyle: {
                backgroundColor: '#0d1117',
              },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
  );
}
