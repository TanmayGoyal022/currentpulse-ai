import { Feather } from "@expo/vector-icons";
import {
  useCreateBookmark,
  useDeleteBookmark,
  useGetArticle,
  useListBookmarks,
} from "@workspace/api-client-react";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getCategoryColor,
  getCategoryLabel,
  getGSColor,
} from "@/components/ArticleCard";
import { useColors } from "@/hooks/useColors";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const { data: article, isLoading, error } = useGetArticle(Number(id));
  const { data: bookmarks, refetch: refetchBookmarks } = useListBookmarks();
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const bookmarkEntry = useMemo(
    () => bookmarks?.find((b) => b.articleId === Number(id)),
    [bookmarks, id]
  );
  const isBookmarked = !!bookmarkEntry;

  function toggleBookmark() {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isBookmarked) {
      deleteBookmark.mutate({ id: bookmarkEntry!.id }, { onSuccess: refetchBookmarks });
    } else {
      createBookmark.mutate({ data: { articleId: Number(id) } }, { onSuccess: refetchBookmarks });
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={40} color={colors.destructive} />
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          Article not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.link, { color: colors.primary }]}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const catColor = getCategoryColor(article.category, colors as Record<string, string>);
  const gsColor = getGSColor(article.gsMapping, colors as Record<string, string>);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: isWeb ? 34 + 20 : insets.bottom + 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: catColor + "22", borderColor: catColor + "44" }]}>
              <Text style={[styles.badgeText, { color: catColor }]}>
                {getCategoryLabel(article.category)}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: gsColor + "22", borderColor: gsColor + "44" }]}>
              <Text style={[styles.badgeText, { color: gsColor }]}>
                {article.gsMapping}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>
                {article.examRelevance === "both" ? "Prelims + Mains" : article.examRelevance}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            {article.title}
          </Text>

          <View style={styles.meta}>
            <Text style={[styles.source, { color: colors.mutedForeground }]}>
              {article.source}
            </Text>
            <Pressable onPress={toggleBookmark} hitSlop={8}>
              <Feather
                name={isBookmarked ? "bookmark" : "bookmark"}
                size={20}
                color={isBookmarked ? colors.primary : colors.mutedForeground}
                style={isBookmarked ? {} : { opacity: 0.6 }}
              />
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Section title="Key Points" color={colors.primary}>
            {article.keyPoints.map((pt, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.bodyText, { color: colors.foreground }]}>
                  {pt}
                </Text>
              </View>
            ))}
          </Section>

          <Section title="Background" color={catColor}>
            <Text style={[styles.bodyText, { color: colors.foreground }]}>
              {article.background}
            </Text>
          </Section>

          <Section title="Analysis" color={gsColor}>
            <Text style={[styles.bodyText, { color: colors.foreground }]}>
              {article.analysis}
            </Text>
          </Section>

          {article.tags && article.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
                Tags
              </Text>
              <View style={styles.tags}>
                {article.tags.map((tag, i) => (
                  <View key={i} style={[styles.tag, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                    <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <View style={[styles.sectionIndicator, { backgroundColor: color }]} />
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  link: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  content: { padding: 20 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  source: { fontSize: 13, fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionIndicator: {
    width: 3,
    height: 18,
    borderRadius: 2,
    position: "absolute",
    left: -12,
    top: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    flexShrink: 0,
  },
  tagsSection: { marginTop: 4 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
