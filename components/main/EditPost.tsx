import { useAuth } from "@/components/context/authContext";
import { updatePost } from "@/database/update/UpdatePost"; // <-- backend separated update function
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
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

export default function EditPost() {
  const { username } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();

  // Receive the post object via route params
  const { post } = route.params || {};

  // Initialize with existing post data
  const [title, setTitle] = useState(post?.title || "");
  const [imageUri, setImageUri] = useState(post?.imageUri || "");
  const [description, setDescription] = useState(post?.description || "");
  const [loading, setLoading] = useState(false);

  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const [imageAspectRatio, setImageAspectRatio] = useState(1.5); // default 3:2

  const inputStyle =
    "flex-row items-center gap-2 border border-[#30363d] rounded-xl p-3 my-4 text-base font-segoe text-[18px] text-white bg-[#161b22]";

  const handleEditPost = () => {
    if (!title.trim() || !description.trim()) {
      ToastAndroid.show(
        "Title and description cannot be empty",
        ToastAndroid.SHORT
      );
      return;
    }

    Alert.alert(
      "Confirm Edit",
      "Are you sure you want to update this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            try {
              await updatePost(post.id, title, description);
              ToastAndroid.show(
                "Post updated successfully!",
                ToastAndroid.SHORT
              );
              navigation.replace("Main", { screen: "MyPosts" });
            } catch (error) {
              console.error(error);
              ToastAndroid.show("Failed to update post", ToastAndroid.SHORT);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageAspectRatio(width / height);
        },
        () => {
          // fallback if error
          setImageAspectRatio(3 / 2);
        }
      );
    }
  }, [imageUri]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
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
              {imageUri && (
                <View className="justify-center items-center mt-5 w-full bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      width: "100%",
                      aspectRatio: imageAspectRatio,
                      borderRadius: 12,
                      resizeMode: "cover",
                    }}
                  />
                </View>
              )}
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
                className="bg-[#58a6ff] rounded-lg py-[7px] px-[10px] justify-center items-center mt-[20px]"
                onPress={handleEditPost}
                disabled={loading}>
                {loading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-segoe font-bold">
                      Updating...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-segoe font-bold">
                    Update Post
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
