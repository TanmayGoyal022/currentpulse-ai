import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Article } from "@workspace/api-client-react";

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export function getCategoryColor(
  category: string,
  colors: Record<string, string>
): string {
  const map: Record<string, string> = {
    polity: colors.catPolity ?? "#3B82F6",
    economy: colors.catEconomy ?? "#22C55E",
    environment: colors.catEnvironment ?? "#14B8A6",
    international_relations: colors.catInternational ?? "#A855F7",
    science_tech: colors.catSciTech ?? "#F97316",
  };
  return map[category] ?? colors.primary;
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    polity: "Polity",
    economy: "Economy",
    environment: "Environment",
    international_relations: "Int'l Relations",
    science_tech: "Science & Tech",
  };
  return map[category] ?? category;
}

export function getGSColor(gs: string, colors: Record<string, string>): string {
  const map: Record<string, string> = {
    GS1: colors.gs1 ?? "#3B82F6",
    GS2: colors.gs2 ?? "#22C55E",
    GS3: colors.gs3 ?? "#F97316",
    GS4: colors.gs4 ?? "#A855F7",
  };
  return map[gs] ?? colors.primary;
}

export default function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const router = useRouter();
  const colors = useColors();
  const catColor = getCategoryColor(article.category, colors as Record<string, string>);
  const gsColor = getGSColor(article.gsMapping, colors as Record<string, string>);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      onPress={() => router.push(`/article/${article.id}`)}
      android_ripple={{ color: colors.border }}
    >
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
        {article.examRelevance === "prelims" || article.examRelevance === "both" ? (
          <View style={[styles.badge, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "44" }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>Prelims</Text>
          </View>
        ) : null}
        {article.examRelevance === "mains" || article.examRelevance === "both" ? (
          <View style={[styles.badge, { backgroundColor: colors.mutedForeground + "22", borderColor: colors.mutedForeground + "44" }]}>
            <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>Mains</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={compact ? 2 : 3}>
        {article.title}
      </Text>

      {!compact && (
        <Text style={[styles.summary, { color: colors.mutedForeground }]} numberOfLines={3}>
          {article.background}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={[styles.source, { color: colors.mutedForeground }]}>
          {article.source}
        </Text>
        <View style={styles.readMore}>
          <Text style={[styles.readMoreText, { color: colors.primary }]}>Read</Text>
          <Feather name="chevron-right" size={14} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
    marginBottom: 8,
  },
  summary: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  source: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  readMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});
