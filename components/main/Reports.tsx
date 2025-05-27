import { useFetchReportsData } from "@/database/read/Reports";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Reports() {
  const { postCountToday, commentCountWeek, topLikedPosts } = useFetchReportsData();
  const navigation = useNavigation();

  const Item = ({ title, name, likeCount, rank, post }) => (
    <TouchableOpacity onPress={() => navigation.navigate("PostDetails", { post })}>
        <View className="gap-2">
        <Text className="text-white font-segoe font-bold text-[15px]">
            {rank}. {title}
        </Text>

        <View className="flex-row gap-2 items-center">
            <Text className="text-white font-segoe text-[12px] pr-[10px]">
            By: {name}
            </Text>
            <FontAwesome name="heart" size={15} color="white" />
            <Text className="text-white font-segoe font-bold text-[12px]">
            {likeCount}
            </Text>
        </View>
        <View className="bg-[#30363d] w-full h-[2px] my-2" />
        </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-[#0d1117]">
      <View className="items-center p-[20px] pb-[50px] border-[#30363d]">
        <View className="bg-[#161b22] flex-row justify-between items-center w-[100%] rounded-xl border-2 gap-3 border-[#30363d] p-[20px]">
          <View>
            <Text className="text-white font-segoe w-[200px] text-[15px]">
              Total number of posts today
            </Text>
            <Text className="text-white font-segoe font-bold text-[35px]">
              {postCountToday}
            </Text>
          </View>
          <FontAwesome name="calendar" size={40} color="white" />
        </View>

        <View className="bg-[#161b22] flex-row justify-between items-center w-[100%] rounded-xl border-2 gap-3 border-[#30363d] p-[20px] mt-[10px]">
          <View>
            <Text className="text-white font-segoe w-[200px] text-[15px]">
              Total number of comments this week
            </Text>
            <Text className="text-white font-segoe font-bold text-[35px]">
              {commentCountWeek}
            </Text>
          </View>
          <FontAwesome name="comment" size={40} color="white" />
        </View>

        <View className="bg-[#161b22] w-[100%] rounded-xl border-2 gap-3 border-[#30363d] mt-[10px] p-[20px]">
          <Text className="text-white font-segoe text-[15px]">
            Top 5 most liked posts
          </Text>
          <View className="bg-[#30363d] w-full h-[2px]" />

          {topLikedPosts.map((item, index) => (
            <Item
              key={item.id}
              post={item}
              title={item.title}
              name={item.name}
              likeCount={item.likeCount}
              rank={index + 1}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
