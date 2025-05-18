// components/navigation/NavigationUI.tsx
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export function CustomHeaderLeft() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      className="border-[#30363d] border-[1px] p-[6px] rounded-lg ml-[15px]"
    >
      <Ionicons name="menu" size={20} color="#fff" />
    </TouchableOpacity>
  );
}

export function CustomHeaderTitle({routeName}) {
  
  const titleMap: Record<string, string> = {
    Posts: 'All Posts',
    MyPosts: 'Posts',
    Accounts: 'Accounts',
  };

  const title = titleMap[routeName] || 'KJPosts';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Image
        source={require('@/assets/images/logo.png')}
        className="w-[40px] h-[40px]"
        resizeMode="contain"
      />
      <Text className="text-white text-[18px] font-bold font-segoe">
        {title}
      </Text>
    </View>
  );
}

export function CustomHeaderRight() {

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Logging out...');
        navigation.reset({
            index: 0,
            routes:[{ name: 'Login' }],
        })
      }}
      className="mr-[15px] flex justify-center items-center bg-[#161b22] p-3 rounded-lg border-2 border-[#30363d]"
    >
      <Text className="text-white font-segoe">Log out</Text>
    </TouchableOpacity>
  );
}

export function CustomDrawerContent(props) {
  const { state, descriptors, navigation } = props;

  return (
    <DrawerContentScrollView {...props} className="bg-[#161b22]">
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { drawerLabel } = descriptors[route.key].options;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className="border-b-[2px] py-[12px] px-[20px] rounded-t-lg"
            style={{
              backgroundColor: focused ? '#2d3138' : 'transparent',
              borderBottomColor: focused ? '#444a50' : 'transparent',
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: focused ? 'bold' : 'normal',
              }}
            >
              {drawerLabel ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </DrawerContentScrollView>
  );
}
