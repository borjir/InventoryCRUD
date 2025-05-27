// components/navigation/DrawerUI.tsx
import { useAuth } from '@/components/context/authContext'; // add this
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export function CustomHeaderLeft() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      className="ml-[15px] border border-[#30363d] p-[6px] rounded-[8px]"
    >
      <Ionicons name="menu" size={20} color="#fff" />
    </TouchableOpacity>
  );
}

export function CustomHeaderTitle({ routeName }: { routeName: string }) {
  const titleMap: Record<string, string> = {
    Posts: 'All Posts',
    MyPosts: 'My Posts',
    Accounts: 'Accounts',
    Reports: 'Reports', //
  };

  const title = titleMap[routeName] || 'KJPosts';

  return (
    <View className="flex-row items-center gap-[8px]">
      <Image
        source={require('@/assets/images/logo.png')}
        className="w-[40px] h-[40px]"
        resizeMode="contain"
      />
      <Text className="text-white text-[18px] font-bold font-['Segoe UI']">
        {title}
      </Text>
    </View>
  );
}

export function CustomHeaderRight() {
  const navigation = useNavigation();
  const { setUsername, setRoleFlag } = useAuth(); // access contex
  
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Logging out...');
        setUsername('');
        setRoleFlag(0); // 👈 THIS IS CRUCIAL
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }}
      className="mr-[15px] justify-center items-center bg-[#161b22] px-[10px] py-[10px] rounded-[8px] border-2 border-[#30363d]"
    >
      <Text className="text-white font-['Segoe UI']">Log out</Text>
    </TouchableOpacity>
  );
}

export function CustomDrawerContent(props) {
  const { state, descriptors, navigation } = props;

  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    Posts: 'newspaper-outline',
    MyPosts: 'document-text-outline',
    Accounts: 'people-outline',
    Reports: 'bar-chart-outline',
  };

  return (
    <DrawerContentScrollView {...props} className="bg-[#161b22]">
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { drawerLabel } = descriptors[route.key].options;
        const iconName = iconMap[route.name] || 'apps-outline';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className={`flex-row items-center py-[12px] px-[20px] gap-[12px] border-b-2 ${
              focused ? 'bg-[#2d3138] border-b-[#444a50]' : 'border-b-transparent'
            }`}
          >
            <Ionicons name={iconName} size={20} color="#ffffff" />
            <Text
              className={`text-white text-[16px] ${
                focused ? 'font-bold' : ''
              }`}
            >
              {drawerLabel ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </DrawerContentScrollView>
  );
}
