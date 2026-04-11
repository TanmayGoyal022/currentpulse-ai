import { Feather } from "@expo/vector-icons";
import { useGetWeeklyArticles } from "@workspace/api-client-react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArticleCard from "@/components/ArticleCard";
import { useColors } from "@/hooks/useColors";

export default function WeeklyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [weekOffset, setWeekOffset] = useState(0);

  const { data: articles, isLoading, refetch } = useGetWeeklyArticles({ weekOffset });

  const weekLabel =
    weekOffset === 0
      ? "This Week"
      : weekOffset === -1
      ? "Last Week"
      : `${Math.abs(weekOffset)} Weeks Ago`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.weekNav, { borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.navBtn, { borderColor: colors.border }]}
          onPress={() => setWeekOffset((w) => w - 1)}
        >
          <Feather name="chevron-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.weekLabel, { color: colors.foreground }]}>
          {weekLabel}
        </Text>
        <Pressable
          style={[
            styles.navBtn,
            { borderColor: colors.border, opacity: weekOffset >= 0 ? 0.3 : 1 },
          ]}
          onPress={() => weekOffset < 0 && setWeekOffset((w) => w + 1)}
          disabled={weekOffset >= 0}
        >
          <Feather name="chevron-right" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={articles ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ArticleCard article={item} />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: isWeb ? 34 + 20 : insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!articles && articles.length > 0}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="calendar" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No articles this week
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  weekLabel: { fontSize: 16, fontFamily: "Inter_700Bold" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
