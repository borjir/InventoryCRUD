import '@/global.css';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

export default function Login({ navigation }) {

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="bg-[#161B22] w-[90%] border-[#30363d] border rounded py-7 px-4"
            >
                <Text
                    className="text-white text-[15px] font-segoe"
                >
                    Username or email address
                </Text>
                <TextInput 
                    className="border border-[#21262d] rounded-lg px-3 py-[5px] my-4 text-base text-[15px] text-white bg-[#0d1117]"
                    placeholder="Username"
                    placeholderTextColor="#999"
                />
                <Text
                    className="text-white text-[15px] font-segoe"
                >
                    Password
                </Text>
                <TextInput
                    className="border border-[#21262d] rounded-lg px-3 py-[5px] my-4 text-base text-[15px] text-white bg-[#0d1117]"
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    className="flex items-center bg-[#2ea043] rounded-lg py-[8px] mt-2"
                >
                    <Text className="font-segoe font-bold text-white text-[15px]">Sign in</Text>
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
    </TouchableWithoutFeedback>
  );
}
