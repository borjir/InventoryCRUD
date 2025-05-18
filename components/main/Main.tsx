// Navigation.tsx
import { useAuth } from '@/components/context/authContext'; // adjust path as needed
import { createDrawerNavigator } from '@react-navigation/drawer';
import Accounts from './Accounts';
import {
    CustomDrawerContent,
    CustomHeaderLeft,
    CustomHeaderRight,
    CustomHeaderTitle,
} from './Drawer';
import MyPosts from './MyPosts';
import Posts from './Posts';

const Drawer = createDrawerNavigator();

export default function Main() {
  const { roleFlag } = useAuth();

  return (
    <Drawer.Navigator
      initialRouteName="Posts"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#0d1117',
          borderBottomWidth: 1,
          borderBottomColor: '#30363d',
        },
        headerTintColor: '#ffffff',
        drawerStyle: {
          backgroundColor: '#161b22',
        },
        headerLeft: () => <CustomHeaderLeft />,
        headerRight: () => <CustomHeaderRight />,
        headerTitle: () => <CustomHeaderTitle routeName={route.name} />,
      })}
    >
      <Drawer.Screen name="Posts" component={Posts} />
      <Drawer.Screen name="MyPosts" component={MyPosts} />
      {roleFlag == 1 && ( <Drawer.Screen name="Accounts" component={Accounts} /> )}
    </Drawer.Navigator>
  );
}
