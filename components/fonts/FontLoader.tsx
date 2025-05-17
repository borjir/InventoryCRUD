// FontLoader.js
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'SegoeUI': require('@/assets/fonts/segoe-ui.ttf'),
      'SegoeUI-Bold': require('@/assets/fonts/segoe-ui-bold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  return fontsLoaded;
};
