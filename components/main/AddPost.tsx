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
  const [imageAspectRatio, setImageAspectRatio] = useState(1.5); // default to 3:2

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
      const uri = result.assets[0].uri;
      Image.getSize(
        uri,
        (width, height) => {
          setImageAspectRatio(width / height);
          setimageUri(uri);
        },
        () => {
          // fallback aspect ratio
          setImageAspectRatio(3 / 2);
          setimageUri(uri);
        }
      );
    } else {
      ToastAndroid.show("You did not pick an image", ToastAndroid.SHORT);
    }
  };

  const handleAddPost = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Missing Fields", "Please enter both a title and description.");
      return;
    }

    if (!imageUri) {
      Alert.alert("Image Required", "Please upload an image before submitting.");
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
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to add post");
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
                  className="bg-[#58a6ff] rounded-lg py-[7px] px-[10px] justify-center items-center mt-[20px]"
                  onPress={imagePicker}>
                  <Text className="text-white font-segoe font-bold">
                    Add Image
                  </Text>
                </TouchableOpacity>
                <View className="justify-center items-center mt-5 w-full bg-gray-50 rounded-lg overflow-hidden">
                  {imageUri && (
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: "100%",
                        aspectRatio: imageAspectRatio,
                        borderRadius: 12,
                        resizeMode: "cover",
                      }}
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
