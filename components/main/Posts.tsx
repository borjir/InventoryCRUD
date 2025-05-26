// frontend/Posts.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/components/context/authContext";
import { useDebounce } from "@/database/delete/DeleteUser";
import { db } from "@/database/firebaseConfig";
import { useFetchPosts } from "@/database/read/AllPosts"; // new backend hook
import { ref, update } from "firebase/database";

export default function Posts() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { posts, loading } = useFetchPosts();

  const { username } = useAuth();

  const toggleLike = (postId: string, currentLikes: Record<string, boolean>) => {
    const liked = !!currentLikes[username];
    const postLikesRef = ref(db, `posts/${postId}/likes`);
    update(postLikesRef, {
      [username]: liked ? null : true, // Remove like if already liked
    });
  };

  const filteredPosts = useMemo(() => {
    const searchText = debouncedSearch.toLowerCase();
    return posts
      .filter(({ title = "" }) => title.toLowerCase().includes(searchText))
      .sort((a, b) => b.id.localeCompare(a.id)); // Already sorted, but safe fallback
  }, [debouncedSearch, posts]);

  const inputStyle =
    "flex-row items-center gap-2 border border-[#30363d] rounded-xl px-3 py-[2px] my-4 text-base text-[18px] font-segoe text-white bg-[#161b22]";

  const renderItem = ({ item: post }) => {
    const liked = !!post.likes?.[username]; // check if current user liked it
    const likeCount = post.likes ? Object.keys(post.likes).length : 0;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("PostDetails", { post })}
      >
        <View className="flex-col gap-2 border-[#30363d] border-y py-5 rounded">
          <View className="flex-col justify-start bg-white items-center w-full rounded-xl overflow-hidden">
            <Image
              source={{ uri: post.imageUri }}
              style={{
                width: "100%",
                aspectRatio: post.aspectRatio || 3 / 2,
                resizeMode: "cover",
              }}
            />
          </View>
          <View>
            <Text className="font-segoe text-white font-bold text-[30px]">
              {post.title}
            </Text>
            <View className="flex-row items-center gap-5">
              <Text className="font-segoe text-white font-bold text-[15px]">
                By: {post.name}
              </Text>
              <Text className="font-segoe text-white text-[15px]">{post.date}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Like Button */}
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => toggleLike(post.id, post.likes || {})}
            >
              <FontAwesome
                name="heart"
                size={24}
                color={liked ? "#e25555" : "#999"}
                solid={liked}
              />
              {likeCount > 0 && (
                <Text className="font-segoe text-white font-bold text-[15px] mr-3">
                  {likeCount}
                </Text>
              )}
            </TouchableOpacity>

            {/* Placeholder for comment button */}
            <TouchableOpacity 
            className="flex-row items-center gap-2"
            onPress={()=> navigation.navigate('PostDetails', { post })}
            >
              <FontAwesome name="comment" size={24} color="#58a6ff" />
              {post.commentCount > 0 && (
                <Text className="font-segoe text-white font-bold text-[15px]">
                  {post.commentCount}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View className="flex-1 bg-[#0d1117] p-[20px]">
      <View className={`${inputStyle} mb-[25px]`}>
        <FontAwesome name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search posts..."
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
          <Text className="text-white font-segoe mb-4">Loading posts...</Text>
          <ActivityIndicator size="large" color="#999" />
        </View>
      ) : filteredPosts.length === 0 ? (
        <View className="flex-1 items-center mt-10">
          <Text className="text-[#888] font-segoe text-[16px]">
            No posts found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
