import { useAuth } from "@/components/context/authContext";
import { addCommentToPost } from "@/database/create/AddComment";
import { db } from "@/database/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import { onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

interface Comment {
  id: string;
  username: string;
  comment: string;
  timestamp: number;
}

export default function PostDetails({ route }) {
  const { post } = route.params;
  const { username } = useAuth();

  const [imageAspectRatio, setImageAspectRatio] = useState(1.5);
  const [descFocused, setDescFocused] = useState(false);
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef(null);

  const inputStyle =
    "flex-row items-center gap-2 border border-[#30363d] rounded-xl p-3 my-4 text-base font-segoe text-[18px] text-white bg-[#161b22]";

  useEffect(() => {
    if (post?.imageUri) {
      Image.getSize(
        post.imageUri,
        (width, height) => setImageAspectRatio(width / height),
        () => setImageAspectRatio(3 / 2)
      );
    }
  }, [post?.imageUri]);

  useEffect(() => {
    const commentsRef = ref(db, `comments/${post.id}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedComments = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key,
        username: value.username,
        comment: value.comment,
        timestamp: value.timestamp,
      })).sort((a, b) => b.timestamp - a.timestamp);
      setComments(loadedComments);
    });

    return () => unsubscribe();
  }, [post.id]);

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const handleAddComment = async () => {
    const trimmedComment = description.trim();
    if (!trimmedComment) return;

    setIsSubmitting(true);
    try {
      await addCommentToPost(post.id, username, trimmedComment);
      setDescription("");
      Keyboard.dismiss();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View key={item.id} className="p-3 border-b border-[#30363d]">
      <View className="flex-row justify-between mb-1">
        <Text className="text-[#58a6ff] font-bold">{item.username}</Text>
        <Text className="text-[#888] text-xs">{timeAgo(item.timestamp)}</Text>
      </View>
      <View className="flex-row items-start gap-2">
        <FontAwesome name="comment" size={16} color="#58a6ff" />
        <Text className="text-white text-[15px] flex-1">{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderCommentItem}
          ListHeaderComponent={
            <View className="bg-[#0d1117] px-[20px] pt-[20px] border-[#30363d] border-t-2">
              {/* Image and Post Info */}
              <View className="flex-col gap-2 py-5 rounded">
                <View className="flex-col justify-start items-center w-full rounded-xl overflow-hidden">
                  {post.imageUri && (
                    <Image
                      source={{ uri: post.imageUri }}
                      style={{
                        width: "100%",
                        aspectRatio: imageAspectRatio,
                        borderRadius: 12,
                        resizeMode: "cover",
                      }}
                    />
                  )}
                </View>
                <View>
                  <Text className="font-segoe text-white font-bold text-[30px]">
                    {post.title}
                  </Text>
                  <View className="flex-row items-center gap-5">
                    <Text className="font-segoe text-white font-bold text-[15px]">By: {post.name}</Text>
                    <Text className="font-segoe text-white text-[15px]">{post.date}</Text>
                  </View>
                  <View className="w-full h-[1px] bg-[#30363d] my-[20px]" />
                  <Text className="font-segoe text-white font-bold text-[20px] mb-3">Description:</Text>
                  <Text className="font-segoe text-white text-[15px]">{post.description}</Text>
                </View>
              </View>

              {/* Comment Input */}
              <View className="w-full h-[1px] bg-[#30363d] mb-[20px]" />
              <Text className="font-segoe text-white font-bold text-[20px] mb-3">Comments:</Text>
              <TextInput
                ref={inputRef}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                placeholder="Write your comment description here..."
                placeholderTextColor="#7c7c7d"
                value={description}
                onChangeText={setDescription}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                className={`${inputStyle} h-[150px] ${descFocused ? "border-[#58a6ff]" : "border-[#21262d]"}`}
              />
              <View className="justify-center items-end">
                <TouchableOpacity
                  className="bg-[#2ea043] rounded-lg py-[7px] px-[10px] mb-[30px] justify-center items-center flex-row gap-2"
                  onPress={handleAddComment}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <ActivityIndicator size="small" color="white" />}
                  <Text className="text-white font-segoe font-bold">
                    {isSubmitting ? "Adding..." : "+ Add Comment"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 50 }}
          className="bg-[#0d1117]"
          keyboardShouldPersistTaps="handled"
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
