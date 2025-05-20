// PostFlow.tsx
import AddPost from '@/components/main/AddPost';
import EditPost from '@/components/main/EditPost';
import ViewPost from '@/components/main/ViewPost';
import { createStackNavigator } from '@react-navigation/stack'; // swap here

const Stack = createStackNavigator(); // and here

export default function PostFlow() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AddPost" component={AddPost} options={{ title: 'Add Post' }} />
      <Stack.Screen name="EditPost" component={EditPost} options={{ title: 'Edit Post' }} />
      <Stack.Screen name="ViewPost" component={ViewPost} options={{ title: 'Post Details' }} />
    </Stack.Navigator>
  );
}
