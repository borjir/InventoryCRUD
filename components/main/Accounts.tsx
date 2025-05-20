import {
  handleDelete,
  PersonItem,
  useDebounce,
} from '@/database/delete/DeleteUser';
import { db } from '@/database/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View
} from 'react-native';

export default function Accounts() {
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([key, value]) => ({
          id: key,
          name: value.username,
          email: value.email,
          role: value.role,
        }));
        const filteredUsers = parsed.filter((user) => user.role === 'user');

        // Only update if changed
        setPeople((prev) => {
          const prevIds = prev.map(p => p.id).sort().join(',');
          const newIds = filteredUsers.map(p => p.id).sort().join(',');
          return prevIds !== newIds ? filteredUsers : prev;
        });
      } else {
        setPeople([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    const searchText = debouncedSearch.toLowerCase();
    return people.filter(({ name = '', email = '' }) =>
      name.toLowerCase().includes(searchText) || email.toLowerCase().includes(searchText)
    );
  }, [debouncedSearch, people]);

  const inputStyle =
    'flex-row items-center gap-2 border border-[#30363d] rounded-xl px-3 py-[2px] my-4 text-base text-[18px] text-white bg-[#161b22]';

  return (
    
    <View className="p-[20px] bg-[#0d1117] flex-1">
        <View className={`${inputStyle} mb-[35px]`}>
            <FontAwesome name="search" size={18} color="#888" />
            <TextInput
            placeholder="Search usernames..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-white"
            />
        </View>
        {loading ? (
            <View className="flex-1 items-center mt-10">
            <Text className="text-white mb-4">Loading users...</Text>
            <ActivityIndicator size="large" color="#999" />
            </View>
        ) : filtered.length === 0 ? (
            <View className="flex-1 items-center mt-10">
            <Text className="text-[#888] text-[16px]">No users found.</Text>
            </View>
        ) : (
            <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PersonItem {...item} onDelete={handleDelete} />}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            removeClippedSubviews={false} // Use false if dynamic height
            contentContainerStyle={{ paddingBottom: 40 }}
            />
        )}
        
    </View>
  );
}
