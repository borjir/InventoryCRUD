import { useAuth } from '@/components/context/authContext';
import { addPost } from '@/database/create/AddPost';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default function AddPost() {
  const { username } = useAuth();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // 🆕 loading state

  const inputStyle =
    'flex-row items-center gap-2 border border-[#30363d] rounded-xl p-3 my-4 text-base text-[18px] text-white bg-[#161b22]';

  const handleAddPost = async () => {
    if (!title.trim() || !description.trim()) {
      ToastAndroid.show('Title and description cannot be empty', ToastAndroid.SHORT);
      return;
    }

    setLoading(true); // <-- This was missing

    try {
      await addPost(title, description, username);
      ToastAndroid.show('Post added successfully!', ToastAndroid.SHORT);
      navigation.navigate('Main', { screen: 'Posts' });

    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to add post', ToastAndroid.SHORT);
    } finally {
        setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-[#0d1117]">
          <View className="border-t-2 border-[#30363d] p-[20px]">
            <Text className="text-white font-bold text-[20px]">Post Title</Text>
            <TextInput
              className={inputStyle}
              placeholder="Write your post title here..."
              placeholderTextColor="#7c7c7d"
              value={title}
              onChangeText={setTitle}
            />
            <Text className="text-white font-bold text-[20px] mt-[20px]">Post Description</Text>
            <TextInput
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              placeholder="Write your post description here..."
              placeholderTextColor="#7c7c7d"
              className={`${inputStyle} h-[250px]`}
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              className="bg-[#2ea043] rounded-lg py-[7px] px-[10px] justify-center items-center mt-[20px]"
              onPress={handleAddPost}
            >
              {loading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white font-bold">Adding...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold">Add Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
