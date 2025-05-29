// Navigation.tsx
import Main from '@/app/Main';
import Login from '@/components/login/Login';
import Register from '@/components/login/Register';
import AddPost from '@/components/main/AddPost'; // Adjust path
import EditPost from '@/components/main/EditPost';
import PostDetails from '@/components/main/PostDetails';
import PostLogs from '@/components/main/PostLogs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

function CloseButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-[32px]">
      <Ionicons name="close" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

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
            headerLeft: () => <CloseButton />,
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
        <Stack.Screen
          name="EditPost"
          component={EditPost}
          options={{
            headerShown: true,
            title: 'Edit Post',
             headerStyle: {
                backgroundColor: '#0d1117',
              },
            headerTintColor: '#fff',
            headerLeft: () => <CloseButton />,
          }}
        />
        <Stack.Screen
          name="PostLogs"
          component={PostLogs}
          options={{
            headerShown: true,
            title: 'Post Logs',
             headerStyle: {
                backgroundColor: '#0d1117',
              },
            headerTintColor: '#fff',
            headerLeft: () => <CloseButton />,
          }}
        />
      </Stack.Navigator>
  );
}
