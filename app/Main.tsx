// Navigation.tsx
import { useAuth } from '@/components/context/authContext'; // adjust path as needed
import { createDrawerNavigator } from '@react-navigation/drawer';
import Accounts from '../components/main/Accounts';
import MyPosts from '../components/main/MyPosts';
import Posts from '../components/main/Posts';
import Reports from '../components/main/Reports';
import {
  CustomDrawerContent,
  CustomHeaderLeft,
  CustomHeaderRight,
  CustomHeaderTitle,
} from './Drawer';

const Drawer = createDrawerNavigator();

export default function Main() {
  const { roleFlag } = useAuth();

  if (roleFlag === null || roleFlag === undefined) return null; // or return a loading spinner
  
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
      <Drawer.Screen name="Posts" component={Posts} options={{ drawerLabel: 'All Posts' }}/>
      <Drawer.Screen name="MyPosts" component={MyPosts} options={{ drawerLabel: 'My Posts' }}/>
      <Drawer.Screen name="Reports" component={Reports} options={{ drawerLabel: 'Reports' }} />
      {roleFlag == 1 && ( <Drawer.Screen name="Accounts" component={Accounts} options={{ drawerLabel: 'Accounts' }}/> )}
    </Drawer.Navigator>
  );
}
