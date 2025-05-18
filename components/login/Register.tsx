
import { FIREBASE_API_KEY, FIREBASE_DB_URL } from '@/database/firebaseConfig';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import * as Yup from 'yup';

export default function Register({ navigation }) {
  const input = "border rounded-lg px-4 py-[10px] mt-3 text-base text-[15px] text-[#1f2328]";

  const [focused, setFocused] = useState({ email: false, password: false, username: false });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
      .matches(/[a-z]/, 'Password must have at least one lowercase letter')
      .matches(/[0-9]/, 'Password must have at least one number')
      .matches(/[@$!%*?&]/, 'Password must have at least one special character (@$!%*?&)')
      .required('Password is required'),
    username: Yup.string().matches(/^[a-zA-Z0-9]+$/, 'Alphanumeric only').required('Username is required'),
  });

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const registerUser = async (email: string, password: string, username: string) => {
    try {
      // 1. Create user in Firebase Auth
      const usernameCheckRes = await fetch(`${FIREBASE_DB_URL}/users.json`);
      const users = await usernameCheckRes.json();
      const usernameTaken = users && Object.values(users).some((user: any) => user.username === username);

      if (usernameTaken) {
        throw new Error('Username is already taken.');
      }
      const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });

      const authData = await authRes.json();
      if (!authRes.ok) {
        if (authData.error.message === 'EMAIL_EXISTS') {
          throw new Error('This email is already in use.');
        }
        throw new Error(authData.error.message);
      }

      const { localId } = authData;

      // 2. Store user info in Realtime DB
      await fetch(`${FIREBASE_DB_URL}/users/${localId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, role: 'user' }),
      });

      ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
      navigation.navigate('Login');

    } catch (error: any) {
      alert(error.message || 'Registration failed');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 items-center bg-white">
          <View className="w-[100%] px-9 py-[40px] bg-black">
            <View className="flex flex-row">
              <Text className="font-segoe text-white text-[15px]">Already have an account? </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text className="font-segoe text-white text-[15px] underline pb-[20px]">Sign in→</Text>
              </Pressable>
            </View>
            <Text className="font-segoe font-bold text-white text-[20px] pb-[20px]">Create your free account</Text>
            <Text className="font-segoe text-white text-[15px] pb-[10px]">Explore KJPosts' core features for all individuals.</Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 40}
            className="w-[100%] px-9 py-[35px]"
          >
            <Formik
              initialValues={{ email: '', password: '', username: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                await registerUser(values.email, values.password, values.username);
                setSubmitting(false);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <>
                  <Text className="font-segoe text-[#1f2328] font-bold text-[20px] pb-[20px]">Sign up to KJPosts</Text>

                  {/* Email Field */}
                  <Text className="text-[#1f2328] text-[17px] font-segoe">Email</Text>
                  <TextInput
                    style={{ borderColor: emailFocused ? '#58a6ff' : '#dfe0e1' }}
                    className={`${input}`}
                    placeholder="Email"
                    placeholderTextColor="#7c7c7d"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => {
                      setEmailFocused(false);
                      handleBlur('email');
                    }}
                    onChangeText={handleChange('email')}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}

                  {/* Password Field */}
                  <Text className="text-[#1f2328] text-[17px] font-segoe mt-4">Password</Text>
                  <TextInput
                    style={{ borderColor: passwordFocused ? '#58a6ff' : '#dfe0e1' }}
                    className={`${input} mb-2`}
                    placeholder="Password"
                    placeholderTextColor="#7c7c7d"
                    secureTextEntry
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => {
                      setPasswordFocused(false);
                      handleBlur('password');
                    }}
                    onChangeText={handleChange('password')}
                    value={values.password}
                  />
                  {touched.password && errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}
                  <Text className="text-[12px] text-[#7c7c7d] font-segoe mb-4">Password must be at least 8 characters and include uppercase, lowercase, number, and special character.</Text>

                  {/* Username Field */}
                  <Text className="text-[#1f2328] text-[17px] font-segoe">Username</Text>
                  <TextInput
                    style={{ borderColor: usernameFocused ? '#58a6ff' : '#dfe0e1' }}
                    className={`${input} mb-2`}
                    placeholder="Username"
                    placeholderTextColor="#7c7c7d"
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => {
                      setUsernameFocused(false);
                      handleBlur('username');
                    }}
                    onChangeText={handleChange('username')}
                    value={values.username}
                    autoCapitalize="none"
                  />
                  {touched.username && errors.username && <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>}
                  <Text className="text-[12px] text-[#7c7c7d] font-segoe mb-4">Username may only contain alphanumeric characters.</Text>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-[#1f2328] rounded-lg p-[12px] items-center mt-5 ${isSubmitting ? 'opacity-50' : ''}`}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="font-segoe font-bold text-white text-[17px]">Register</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
