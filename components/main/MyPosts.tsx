import { useAuth } from "@/components/context/authContext"; // Adjust path if needed
import { deletePostById } from "@/database/delete/deletePost"; // ⬅️ Import backend delete
import { useDebounce } from "@/database/delete/DeleteUser"; // Adjust path if needed
import { listenToUserPosts } from "@/database/read/MyPosts"; // adjust path
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyPosts() {
  const { username } = useAuth();
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const unsubscribe = listenToUserPosts(username, setPosts, setLoading);
    return () => unsubscribe();
  }, [username]);

  const filteredPosts = useMemo(() => {
    const searchText = debouncedSearch.toLowerCase();
    return posts.filter(({ title = "" }) =>
      title.toLowerCase().includes(searchText)
    );
  }, [debouncedSearch, posts]);

  const inputStyle =
    "flex-row items-center gap-2 border border-[#30363d] rounded-xl px-3 py-[2px] my-4 text-base text-[18px] text-white bg-[#161b22]";

  const renderItem = ({ item: post }) => (
    <View className="bg-[#161b22] p-[15px] rounded-lg mb-[10px] border-[1px] gap-2 border-[#30363d] flex-row justify-between items-center">
      <View className="flex-1 pr-2">
        <Text className="font-bold font-segoe text-white text-[18px]">
          {post.title}
        </Text>
        <Text className="text-[#c9d1d9] font-segoe text-[14px]">
          {post.date}
        </Text>
      </View>
      <View className="mr-[10px] flex-row gap-3 justify-center items-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("EditPost", { post })}>
          <FontAwesome name="edit" size={24} color="#58a6ff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Delete Post",
              "Are you sure you want to delete this post?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    const result = await deletePostById(post.id);
                    if (result.success) {
                      ToastAndroid.show(
                        "Post deleted successfully",
                        ToastAndroid.SHORT
                      );
                    } else {
                      ToastAndroid.show(
                        "Failed to delete post",
                        ToastAndroid.SHORT
                      );
                    }
                  },
                },
              ],
              { cancelable: true }
            )
          }>
          <FontAwesome name="trash" size={24} color="#fa5e55" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#0d1117] p-[20px]">
      <View className={`${inputStyle} mb-[25px]`}>
        <FontAwesome name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search your posts..."
          placeholderTextColor="#999"
          className="flex-1 font-segoe text-white"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View className="flex-row justify-end">
        <TouchableOpacity
          className="bg-[#2ea043] rounded-lg py-[7px] px-[10px] mb-[30px]"
          onPress={() => navigation.navigate("AddPost")}>
          <Text className="text-white font-segoe font-bold">+ Add Post</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center mt-10">
          <Text className="text-white mb-4">Loading your posts...</Text>
          <ActivityIndicator size="large" color="#999" />
        </View>
      ) : filteredPosts.length === 0 ? (
        <View className="flex-1 items-center mt-10">
          <Text className="text-[#888] text-[16px]">No posts found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}
