import { registerUser } from '@/database/create/AddUser';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center bg-white">
            {/* Header */}
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

            {/* Formik Form */}
            <View className="w-[100%] px-9 py-[35px]">
              <Formik
                initialValues={{ email: '', password: '', username: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  Alert.alert(
                    'Confirm Registration',
                    'Are you sure you want to register this account?',
                    [
                      { text: 'Cancel', style: 'cancel', onPress: () => setSubmitting(false) },
                      {
                        text: 'Yes',
                        onPress: async () => {
                          try {
                            const result = await registerUser(values.email, values.password, values.username);
                            if (result.success) {
                              ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
                              navigation.navigate('Login');
                            } else {
                              alert(result.error);
                            }
                          } catch (error) {
                            alert('An unexpected error occurred.');
                          } finally {
                            setSubmitting(false);
                          }
                        }
                      }
                    ],
                    { cancelable: true }
                  );
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                  <>
                    <Text className="font-segoe text-[#1f2328] font-bold text-[20px] pb-[20px]">Sign up to KJPosts</Text>

                    {/* Email Field */}
                    <Text className="text-[#1f2328] text-[17px] font-segoe">Email</Text>
                    <TextInput
                      style={{ borderColor: emailFocused ? '#58a6ff' : '#dfe0e1' }}
                      className={input}
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
                    <Text className="text-[12px] text-[#7c7c7d] font-segoe mb-4">
                      Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                    </Text>

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
                      className={`bg-[#1f2328] rounded-lg p-[12px] items-center mt-5`}
                    >
                      {isSubmitting ? (
                        <View className="flex-row items-center gap-2">
                          <ActivityIndicator size="small" color="#fff" />
                          <Text className="font-segoe font-bold text-white text-[15px]">Signing up...</Text>
                        </View>
                      ) : (
                        <Text className="font-segoe font-bold text-white text-[17px]">Register</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
