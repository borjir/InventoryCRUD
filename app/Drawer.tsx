// components/navigation/DrawerUI.tsx
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function CustomHeaderLeft() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={styles.headerButtonLeft}
    >
      <Ionicons name="menu" size={20} color="#fff" />
    </TouchableOpacity>
  );
}

export function CustomHeaderTitle({ routeName }: { routeName: string }) {
  const titleMap: Record<string, string> = {
    Posts: 'All Posts',
    MyPosts: 'Posts',
    Accounts: 'Accounts',
  };

  const title = titleMap[routeName] || 'KJPosts';

  return (
    <View style={styles.headerTitleContainer}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.headerTitleText}>{title}</Text>
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
          routes: [{ name: 'Login' }],
        });
      }}
      style={styles.logoutButton}
    >
      <Text style={styles.logoutButtonText}>Log out</Text>
    </TouchableOpacity>
  );
}

export function CustomDrawerContent(props) {
  const { state, descriptors, navigation } = props;

  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    Posts: 'newspaper-outline',
    MyPosts: 'document-text-outline',
    Accounts: 'people-outline',
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerScrollView}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { drawerLabel } = descriptors[route.key].options;
        const iconName = iconMap[route.name] || 'apps-outline';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[
              styles.drawerItem,
              focused && styles.drawerItemFocused,
            ]}
          >
            <Ionicons name={iconName} size={20} color="#ffffff" />
            <Text style={[styles.drawerItemText, focused && styles.drawerItemTextFocused]}>
              {drawerLabel ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  headerButtonLeft: {
    borderColor: '#30363d',
    borderWidth: 1,
    padding: 6,
    borderRadius: 8,
    marginLeft: 15,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTitleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Segoe UI', // Optional: ensure this is linked properly
  },
  logoutButton: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161b22',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#30363d',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontFamily: 'Segoe UI',
  },
  drawerScrollView: {
    backgroundColor: '#161b22',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 12,
  },
  drawerItemFocused: {
    backgroundColor: '#2d3138',
    borderBottomColor: '#444a50',
  },
  drawerItemText: {
    color: '#ffffff',
    fontSize: 16,
  },
  drawerItemTextFocused: {
    fontWeight: 'bold',
  },
});
