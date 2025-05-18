import { AuthProvider } from '@/components/context/authContext'; // adjust path if needed
import { useFontLoader } from '@/components/fonts/FontLoader';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import Navigation from './Navigation';

export default function RootLayout() {

  const fontsLoaded = useFontLoader();

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
