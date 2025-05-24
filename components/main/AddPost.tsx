import { useAuth } from "@/components/context/authContext";
import { addPost } from "@/database/create/AddPost";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function AddPost() {
  const { username } = useAuth();
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setimageUri] = useState("");
  const [loading, setLoading] = useState(false); // 🆕 loading state

  const inputStyle =
    "flex-row items-center gap-2 border border-[#30363d] rounded-xl p-3 my-4 text-base font-segoe text-[18px] text-white bg-[#161b22]";

  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setimageUri(result.assets[0].uri);
    } else {
      ToastAndroid.show("you did not pick image", ToastAndroid.SHORT);
    }
  };

  const handleAddPost = () => {
    if (!title.trim() || !description.trim()) {
      ToastAndroid.show(
        "Title and description cannot be empty",
        ToastAndroid.SHORT
      );
      return;
    }

    Alert.alert(
      "Confirm Add",
      "Are you sure you want to add this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            try {
              await addPost(title, imageUri, description, username);
              ToastAndroid.show("Post added successfully!", ToastAndroid.SHORT);
              navigation.replace("Main", { screen: "MyPosts" });
            } catch (error) {
              console.error(error);
              ToastAndroid.show("Failed to add post", ToastAndroid.SHORT);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // adjust if needed
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <View className="flex-1 bg-[#0d1117]">
              <View className="border-t-2 border-[#30363d] p-[20px] mb-20">
                <Text className="text-white font-segoe font-bold text-[20px]">
                  Post Title
                </Text>
                <TextInput
                  placeholder="Write your post title here..."
                  placeholderTextColor="#7c7c7d"
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                  className={`${inputStyle} ${
                    titleFocused ? "border-[#58a6ff]" : "border-[#21262d]"
                  }`}
                />
                <TouchableOpacity
                  className="bg-[#2ea043] rounded-lg py-[10px] px-[10px] justify-center items-center mt-[20px]"
                  onPress={imagePicker}>
                  <Text className="text-white font-segoe font-bold">
                    Add Image
                  </Text>
                </TouchableOpacity>
                <View className="justify-center items-center mt-5 w-[350px] h-[350px] bg-gray-50 rounded-lg">
                  {imageUri && (
                    <Image
                      source={{ uri: imageUri }}
                      className="w-full h-full rounded-xl"
                      resizeMode="contain"
                    />
                  )}
                </View>
                <Text className="text-white font-bold text-[20px] mt-[20px]">
                  Post Description
                </Text>
                <TextInput
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  placeholder="Write your post description here..."
                  placeholderTextColor="#7c7c7d"
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setDescFocused(false)}
                  className={`${inputStyle} h-[250px] ${
                    descFocused ? "border-[#58a6ff]" : "border-[#21262d]"
                  }`}
                />
                <TouchableOpacity
                  className="bg-[#2ea043] rounded-lg py-[7px] px-[10px] justify-center items-center mt-[20px]"
                  onPress={handleAddPost}>
                  {loading ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator size="small" color="#fff" />
                      <Text className="text-white font-segoe font-bold">
                        Adding...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-segoe font-bold">
                      Add Post
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
