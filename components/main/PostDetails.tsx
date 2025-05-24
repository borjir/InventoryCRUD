import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function PostDetails({ route }) {
  const { post } = route.params;

  const [imageAspectRatio, setImageAspectRatio] = useState(1.5); // default 3:2

  useEffect(() => {
    if (post?.imageUri) {
      Image.getSize(
        post.imageUri,
        (width, height) => {
          setImageAspectRatio(width / height);
        },
        () => {
          setImageAspectRatio(3 / 2); // fallback
        }
      );
    }
  }, [post?.imageUri]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      className="bg-[#0d1117]"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-[#0d1117] p-[20px] mb-[50px]">
        <View className="flex-col gap-2 border-[#30363d] border-y py-5 rounded">
          <View className="flex-col justify-start bg-white items-center w-full rounded-xl overflow-hidden">
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
              <Text className="font-segoe text-white font-bold text-[15px]">
                By: {post.name}
              </Text>
              <Text className="font-segoe text-white text-[15px]">
                {post.date}
              </Text>
            </View>
            <View className="w-full h-[1px] bg-[#30363d] my-[20px]" />
            <Text className="font-segoe text-white text-[15px]">
              {post.description}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
