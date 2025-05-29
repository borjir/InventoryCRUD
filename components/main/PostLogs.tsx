import { getPostLogs, PostLogEntry } from "@/database/read/PostLogs";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ✅ add this
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
dayjs.extend(relativeTime); // ✅ activate the plugin

export default function PostLogs() {
  const route = useRoute();
  const { postId } = route.params as { postId: string };
  const [logs, setLogs] = useState<PostLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getPostLogs(postId);
      setLogs(data);
      setLoading(false);
    })();
  }, [postId]);

  return (
    <View className="flex-1 bg-[#0d1117] p-[20px] border-t-2 border-[#30363d]">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#999" />
        </View>
      ) : logs.length === 0 ? (
        <Text className="text-white text-center mt-10">No activity found.</Text>
      ) : (
        logs.map((log, idx) => (
          <View key={idx}>
            <View className="h-[2px] w-full bg-[#30363d]" />
            <View className="py-[15px] w-[100%] gap-2">
              <Text className="font-segoe text-[15px] text-white">
                {log.username}{" "}
                {log.type === "like" ? (<>
                  <FontAwesome name="heart" size={13} color="white" /> <Text>on your post</Text>
                </>) : (
                  <>
                    commented: "<Text className="italic">{log.comment}</Text>"
                  </>
                )}
              </Text>
              <Text className="text-[#c9d1d9] font-segoe text-[14px]">
                {dayjs(log.timestamp).fromNow()}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
