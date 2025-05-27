import { useAuth } from '@/components/context/authContext'; // import context
import { loginUserService } from '@/database/read/LoginUser';
import '@/global.css';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function Login({ navigation }) {

  const { setUsername, setRoleFlag } = useAuth();
    
  const input = "border border-[#21262d] rounded-lg px-3 py-[5px] my-4 text-base text-[15px] text-white bg-[#0d1117]";

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const focusedBorder = "border-[#58a6ff]";
  const unfocusedBorder = "border-[#21262d]";

  const loginUser = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert('Error', 'Please fill both fields');
      return;
    }

    setLoading(true);
    try {
      const { userData } = await loginUserService(usernameOrEmail, password);

      // Set global context role
      if (userData.role === 'admin') {
        setRoleFlag(1); // admin
      } else {
        setRoleFlag(0);
      }

      setUsername(userData.username); // optional if used
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error: any) {
      let message = 'Login failed. Please try again.';

      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View className="flex-1 items-center bg-[#0D1117]">
                <Image 
                    source={require('@/assets/images/logo.png')}
                    className="h-[65px] w-[65px] mt-[30px] mb-[30px]"
                />
                <Text
                    className="text-white text-[25px] mb-[15px] font-segoe"
                >
                    Sign in To KJPosts
                </Text>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 40}
                    className="bg-[#161B22] w-[90%] border-[#30363d] border rounded py-7 px-4"
                >
                    <Text className="text-white text-[15px] font-segoe">
                        Username or email address
                    </Text>
                    <TextInput 
                        className={`${input} ${usernameFocused ? focusedBorder : unfocusedBorder}`}
                        placeholder="Username or Email"
                        placeholderTextColor="#999"
                        onFocus={() => setUsernameFocused(true)}
                        onBlur={() => setUsernameFocused(false)}
                        value={usernameOrEmail}
                        onChangeText={setUsernameOrEmail}
                        autoCapitalize="none"
                    />
                    <Text className="text-white text-[15px] font-segoe">
                        Password
                    </Text>
                    <TextInput
                        className={`${input} ${passwordFocused ? focusedBorder : unfocusedBorder}`}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry={true}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        className="flex items-center bg-[#2ea043] rounded-lg py-[8px] mt-2"
                        onPress={loginUser}
                        disabled={loading}
                    >
                        {loading ? (
                          <View className="flex-row items-center gap-2">
                            <ActivityIndicator size="small" color="#fff" />
                            <Text className="font-segoe font-bold text-white text-[15px]">
                              Signing in...
                            </Text>
                          </View>
                        ) : (
                          <Text className="font-segoe font-bold text-white text-[15px]">
                            Sign in
                          </Text>
                        )}
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                <View className="bg-none w-[90%] flex-row gap-1 justify-center border-[#30363d] border rounded py-7 px-4 mt-7">
                    <Text className="text-white font-segoe text-[15px]">
                        New to KJPosts?  
                    </Text>
                    <Pressable onPress={() => navigation.navigate('Register')}>
                        {({ pressed }) => (
                        <Text
                            className={`text-[#58a6ff] text-[15px] font-segoe ${
                            pressed ? 'underline' : ''
                            }`}
                        >
                            Create an account
                        </Text>
                        )}
                    </Pressable>
                </View>
                <View className="pt-[75px] items-center gap-4">
                    <Text className="text-[#6e7681] font-segoe text-[15px]">Created by: Joel Jay Arcipe & Kent Jorjet Niez</Text>
                    <Text className="text-[#6e7681] font-segoe text-[15px]">@BSIT III - I</Text>
                </View>
            </View>
        </ScrollView>
    </TouchableWithoutFeedback>
  );
}
