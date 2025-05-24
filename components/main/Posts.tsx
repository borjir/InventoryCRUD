import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useDebounce } from "@/database/delete/DeleteUser"; // debounce hook
import { db } from "@/database/firebaseConfig";

dayjs.extend(customParseFormat);

export default function Posts() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const postsRef = ref(db, "posts");
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const entries = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          title: value.post_title,
          imageUri: value.post_imageupload,
          name: value.post_author,
          date: value.post_date,
          description: value.post_description,
        }));

        const fetchImageSizes = entries.map(
          (post) =>
            new Promise((resolve) => {
              Image.getSize(
                post.imageUri,
                (width, height) => {
                  resolve({
                    ...post,
                    imageWidth: width,
                    imageHeight: height,
                    aspectRatio: width / height,
                  });
                },
                () => {
                  // fallback if image fails to load
                  resolve({
                    ...post,
                    imageWidth: 3,
                    imageHeight: 2,
                    aspectRatio: 3 / 2,
                  });
                }
              );
            })
        );

        Promise.all(fetchImageSizes).then((postsWithSize: any) => {
          const sorted = postsWithSize.sort((a, b) => {
            const dateA = dayjs(a.date, "MMM DD, YYYY, h:mm A").valueOf();
            const dateB = dayjs(b.date, "MMM DD, YYYY, h:mm A").valueOf();
            return dateB - dateA;
          });

          setPosts((prev) => {
            const isSame = JSON.stringify(prev) === JSON.stringify(sorted);
            return isSame ? prev : sorted;
          });
          setLoading(false);
        });
      } else {
        setPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = useMemo(() => {
    const searchText = debouncedSearch.toLowerCase();

    // Filter posts by title (case-insensitive)
    const filtered = posts.filter(({ title = "" }) =>
      title.toLowerCase().includes(searchText)
    );

    // Sort filtered posts by date descending (latest first)
    return filtered.sort((a, b) => {
      const dateA = dayjs(a.date, "MMM DD, YYYY, h:mm A").valueOf();
      const dateB = dayjs(b.date, "MMM DD, YYYY, h:mm A").valueOf();
      return dateB - dateA;
    });
  }, [debouncedSearch, posts]);

  const inputStyle =
    "flex-row items-center gap-2 border border-[#30363d] rounded-xl px-3 py-[2px] my-4 text-base text-[18px] font-segoe text-white bg-[#161b22]";

    
  const renderItem = ({ item: post }) => (
    
    <View className="flex-col gap-2 border-[#30363d] border-y py-5 rounded">
      <View className="flex-col justify-start bg-white items-center w-full rounded-xl overflow-hidden">
        <Image
          source={{ uri: post.imageUri }}
          style={{
            width: "100%",
            aspectRatio: post.aspectRatio || 3.0, // fallback
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
      <TouchableOpacity
        className="bg-[#2ea043] rounded-lg py-[7px] px-[10px] justify-center items-center"
        onPress={() => navigation.navigate("PostDetails", { post })}>
        <Text className="text-white font-bold">View Post</Text>
      </TouchableOpacity>
    </View>
  );

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
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
