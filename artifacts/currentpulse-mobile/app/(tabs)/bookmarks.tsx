import { Feather } from "@expo/vector-icons";
import {
  useCreateBookmark,
  useDeleteBookmark,
  useListBookmarks,
} from "@workspace/api-client-react";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArticleCard from "@/components/ArticleCard";
import ScreenHeader from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function BookmarksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { data: bookmarks, isLoading, refetch, isRefetching } = useListBookmarks();
  const deleteMutation = useDeleteBookmark();

  function handleDelete(id: number) {
    Alert.alert("Remove Bookmark", "Remove this article from your saved list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deleteMutation.mutate({ id }, { onSuccess: () => refetch() });
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Saved"
        subtitle={`${bookmarks?.length ?? 0} articles`}
      />
      <FlatList
        data={bookmarks ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View>
            <ArticleCard article={item.article} />
            <Pressable
              style={[styles.deleteBtn, { borderColor: colors.border }]}
              onPress={() => handleDelete(item.id)}
            >
              <Feather name="trash-2" size={14} color={colors.destructive} />
              <Text style={[styles.deleteBtnText, { color: colors.destructive }]}>
                Remove
              </Text>
            </Pressable>
          </View>
        )}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80,
        }}
        refreshing={isRefetching}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!bookmarks && bookmarks.length > 0}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bookmark" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No saved articles
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Bookmark articles from the Daily Feed to find them here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginTop: -6,
    marginBottom: 12,
    marginRight: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});
