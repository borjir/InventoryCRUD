import { useFontLoader } from '@/components/fonts/FontLoader';
import { Text, View } from "react-native";
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {

  const fontsLoaded = useFontLoader();

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 items-center bg-[#0D1117]">
      <Text 
        className="font-bold color-white" 
        style={{fontFamily:'SegoeUI'}}
      >
        gea</Text>
    </View>
  );
}
