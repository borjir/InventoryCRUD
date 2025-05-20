import { Image, Text, View, } from 'react-native';

export default function PostDetails({ route }){
    const { post } = route.params;

    return(
        <View className="flex-1 bg-[#0d1117] p-[20px]">
            <View className="flex-col gap-2 border-[#30363d] border-y py-5 rounded">
                  <View className="flex-col justify-start bg-white items-center w-full rounded-xl">
                    <Image
                      source={require('@/assets/images/post.png')}
                      style={{ aspectRatio: 3.0, height: 200, width: '100%' }}
                      resizeMode="contain"
                    />
                  </View>
                  <View>
                    <Text className="font-segoe text-white font-bold text-[30px]">{post.title}</Text>
                    <View className="flex-row items-center gap-5">
                        <Text className="font-segoe text-white font-bold text-[15px]">By: {post.name}</Text>
                        <Text className="font-segoe text-white text-[15px]">{post.date}</Text>
                    </View>
                    <View className="w-full h-[1px] bg-[#30363d] my-[20px]"/>
                    <Text className="font-segoe text-white text-[15px]">{post.description}</Text>
                  </View>
                </View>
        </View>
    );
}