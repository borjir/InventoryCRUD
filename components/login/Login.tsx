import { useAuth } from '@/components/context/authContext'; // import context
import { FIREBASE_API_KEY, FIREBASE_DB_URL } from '@/database/firebaseConfig';
import '@/global.css';
import { useState } from 'react';
import {
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
  View,
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
      // 1. If user entered a username, fetch users to find their email
      let email = usernameOrEmail;
      if (!usernameOrEmail.includes('@')) {
        // Lookup email by username in DB
        const res = await fetch(`${FIREBASE_DB_URL}/users.json`);
        const users = await res.json();

        const userEntry = users && Object.entries(users).find(([key, user]: any) => user.username === usernameOrEmail);
        if (!userEntry) throw new Error('User not found');
        email = userEntry[1].email;
      }

      // 2. Login with email and password via Firebase Auth REST API
      const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const authData = await authRes.json();

      if (!authRes.ok) {
        throw new Error(authData.error.message || 'Login failed');
      }

      const { localId } = authData;

      // 3. Fetch user info from Realtime Database by localId
      const userRes = await fetch(`${FIREBASE_DB_URL}/users/${localId}.json`);
      const userData = await userRes.json();

      if (!userData) throw new Error('User data not found');

      // 4. Check user role and console.log accordingly
      if (userData.role === 'admin') {
        console.log('1');
        setRoleFlag(1); // admin
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else if (userData.role === 'user') {
        console.log('2');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        console.log('Unknown role:', userData.role);
      }

      // You could navigate to home or dashboard here
      // navigation.navigate('Home');

    } catch (error: any) {
      Alert.alert('Login Error', error.message);
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
                        <Text className="font-segoe font-bold text-white text-[15px]">
                          {loading ? 'Signing in...' : 'Sign in'}
                        </Text>
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
