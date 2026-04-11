import { Feather } from "@expo/vector-icons";
import { useListArticles } from "@workspace/api-client-react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArticleCard from "@/components/ArticleCard";
import ScreenHeader from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = [
  { id: "", label: "All" },
  { id: "polity", label: "Polity" },
  { id: "economy", label: "Economy" },
  { id: "environment", label: "Environment" },
  { id: "international_relations", label: "Intl Relations" },
  { id: "science_tech", label: "Sci & Tech" },
];

export default function FeedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const { data: articles, isLoading, refetch, isRefetching } = useListArticles({
    category: activeCategory || undefined,
    search: search || undefined,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Daily Feed"
        subtitle={`${articles?.length ?? 0} articles`}
        right={
          <Pressable onPress={() => router.push("/weekly")} style={[styles.weeklyBtn, { borderColor: colors.border }]}>
            <Feather name="calendar" size={16} color={colors.primary} />
            <Text style={[styles.weeklyBtnText, { color: colors.primary }]}>Weekly</Text>
          </Pressable>
        }
      />

      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          placeholder="Search articles..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={styles.categoryList}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryChip,
              {
                backgroundColor: activeCategory === item.id ? colors.primary : colors.card,
                borderColor: activeCategory === item.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setActiveCategory(item.id)}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: activeCategory === item.id ? "#fff" : colors.mutedForeground,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={articles ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ArticleCard article={item} />}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!articles && articles.length > 0}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {isLoading ? "Loading articles..." : "No articles found"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  categoryList: { maxHeight: 46, marginBottom: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  weeklyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weeklyBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
