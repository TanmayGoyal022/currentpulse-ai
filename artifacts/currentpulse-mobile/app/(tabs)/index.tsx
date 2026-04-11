import { Feather } from "@expo/vector-icons";
import {
  useGetDashboardSummary,
  useGetTrendingTopics,
} from "@workspace/api-client-react";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArticleCard, { getCategoryColor } from "@/components/ArticleCard";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const {
    data: summary,
    isLoading,
    refetch,
    isRefetching,
  } = useGetDashboardSummary();
  const { data: trending } = useGetTrendingTopics();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: isWeb ? 67 : insets.top + 16,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Good {getTimeGreeting()},
          </Text>
          <Text style={[styles.appName, { color: colors.foreground }]}>
            CurrentPulse AI
          </Text>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            {today}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/weekly")}
          style={[styles.weeklyBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="calendar" size={16} color="#fff" />
          <Text style={styles.weeklyBtnText}>Weekly</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: 40 }}
          size="large"
        />
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatCard
              label="Today"
              value={summary?.todayCount ?? 0}
              icon="sun"
              color={colors.primary}
              colors={colors}
            />
            <StatCard
              label="This Week"
              value={summary?.weekCount ?? 0}
              icon="trending-up"
              color={colors.gs1 as string}
              colors={colors}
            />
            <StatCard
              label="Saved"
              value={summary?.totalBookmarks ?? 0}
              icon="bookmark"
              color={colors.gs2 as string}
              colors={colors}
            />
            <StatCard
              label="Notes"
              value={summary?.totalNotes ?? 0}
              icon="edit-3"
              color={colors.gs4 as string}
              colors={colors}
            />
          </View>

          {trending && trending.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Trending Topics
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.trendingRow}>
                  {trending.slice(0, 8).map((t, i) => (
                    <View
                      key={i}
                      style={[
                        styles.trendingChip,
                        {
                          backgroundColor: getCategoryColor(t.category, colors as Record<string, string>) + "20",
                          borderColor: getCategoryColor(t.category, colors as Record<string, string>) + "40",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.trendingText,
                          { color: getCategoryColor(t.category, colors as Record<string, string>) },
                        ]}
                      >
                        {t.topic}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                By Category
              </Text>
              <View style={styles.categoryGrid}>
                {summary.categoryBreakdown.map((cat) => (
                  <Pressable
                    key={cat.category}
                    style={[
                      styles.categoryItem,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() =>
                      router.push(
                        `/feed?category=${encodeURIComponent(cat.category)}`
                      )
                    }
                  >
                    <View
                      style={[
                        styles.categoryDot,
                        {
                          backgroundColor: getCategoryColor(
                            cat.category,
                            colors as Record<string, string>
                          ),
                        },
                      ]}
                    />
                    <Text
                      style={[styles.categoryLabel, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {formatCategory(cat.category)}
                    </Text>
                    <Text
                      style={[styles.categoryCount, { color: colors.primary }]}
                    >
                      {cat.count}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {summary?.recentArticles && summary.recentArticles.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Recent Articles
                </Text>
                <Pressable onPress={() => router.push("/feed")}>
                  <Text style={[styles.seeAll, { color: colors.primary }]}>
                    See all
                  </Text>
                </Pressable>
              </View>
              {summary.recentArticles.slice(0, 5).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  colors,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
  colors: Record<string, string>;
}) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Feather name={icon as any} size={18} color={color} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

function formatCategory(cat: string) {
  const map: Record<string, string> = {
    polity: "Polity",
    economy: "Economy",
    environment: "Environment",
    international_relations: "Intl. Relations",
    science_tech: "Sci & Tech",
  };
  return map[cat] ?? cat;
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  appName: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  date: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  weeklyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  weeklyBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textAlign: "center" },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  trendingRow: { flexDirection: "row", gap: 8, paddingRight: 16 },
  trendingChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  trendingText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: "45%",
    flex: 1,
  },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  categoryCount: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
