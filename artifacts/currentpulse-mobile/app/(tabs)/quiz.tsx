import { Feather } from "@expo/vector-icons";
import { useListQuizQuestions } from "@workspace/api-client-react";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function QuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { data: questions, isLoading, refetch } = useListQuizQuestions({});

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answered, setAnswered] = useState(false);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
          Loading quiz...
        </Text>
      </View>
    );
  }

  const q = questions?.[current];

  if (!q || questions!.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="zap-off" size={48} color={colors.mutedForeground} />
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          No quiz questions available
        </Text>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={() => refetch()}
        >
          <Text style={styles.btnText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (showScore) {
    const total = questions!.length;
    const pct = Math.round((score / total) * 100);
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Quiz Results" />
        <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.scoreBadge, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.scorePct, { color: colors.primary }]}>{pct}%</Text>
          </View>
          <Text style={[styles.scoreTitle, { color: colors.foreground }]}>
            {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good job!" : "Keep practising!"}
          </Text>
          <Text style={[styles.scoreDetail, { color: colors.mutedForeground }]}>
            {score} / {total} correct
          </Text>
          <Pressable
            style={[styles.btn, { backgroundColor: colors.primary, marginTop: 20 }]}
            onPress={() => {
              setCurrent(0);
              setSelected(null);
              setScore(0);
              setShowScore(false);
              setAnswered(false);
            }}
          >
            <Text style={styles.btnText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q!.correctAnswer) {
      setScore((s) => s + 1);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  function handleNext() {
    if (current + 1 >= questions!.length) {
      setShowScore(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  function getOptionStyle(idx: number) {
    if (!answered) return { backgroundColor: colors.card, borderColor: colors.border };
    if (idx === q!.correctAnswer) return { backgroundColor: "#22C55E20", borderColor: "#22C55E" };
    if (idx === selected) return { backgroundColor: "#EF444420", borderColor: "#EF4444" };
    return { backgroundColor: colors.card, borderColor: colors.border };
  }

  function getOptionTextColor(idx: number) {
    if (!answered) return colors.foreground;
    if (idx === q!.correctAnswer) return "#22C55E";
    if (idx === selected) return "#EF4444";
    return colors.mutedForeground;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Quiz"
        subtitle={`Question ${current + 1} of ${questions!.length}`}
      />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${((current + 1) / questions!.length) * 100}%` as any,
              },
            ]}
          />
        </View>

        <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.questionText, { color: colors.foreground }]}>
            {q.question}
          </Text>
        </View>

        <View style={styles.options}>
          {q.options.map((opt, idx) => (
            <Pressable
              key={idx}
              style={[styles.option, getOptionStyle(idx)]}
              onPress={() => handleSelect(idx)}
            >
              <View style={[styles.optionLetter, { backgroundColor: answered ? "transparent" : colors.secondary }]}>
                <Text style={[styles.optionLetterText, { color: getOptionTextColor(idx) }]}>
                  {String.fromCharCode(65 + idx)}
                </Text>
              </View>
              <Text style={[styles.optionText, { color: getOptionTextColor(idx) }]}>
                {opt}
              </Text>
              {answered && idx === q.correctAnswer && (
                <Feather name="check-circle" size={18} color="#22C55E" />
              )}
              {answered && idx === selected && idx !== q.correctAnswer && (
                <Feather name="x-circle" size={18} color="#EF4444" />
              )}
            </Pressable>
          ))}
        </View>

        {answered && (
          <View style={[styles.explanationBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Text style={[styles.explanationTitle, { color: colors.primary }]}>
              Explanation
            </Text>
            <Text style={[styles.explanationText, { color: colors.foreground }]}>
              {q.explanation}
            </Text>
          </View>
        )}

        {answered && (
          <Pressable
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.btnText}>
              {current + 1 >= questions!.length ? "See Results" : "Next Question"}
            </Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 32 },
  progressBar: { height: 4, borderRadius: 2, marginBottom: 16, overflow: "hidden" },
  progressFill: { height: 4, borderRadius: 2 },
  questionCard: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  questionText: { fontSize: 16, fontFamily: "Inter_600SemiBold", lineHeight: 24 },
  options: { gap: 10, marginBottom: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  optionText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  explanationBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  explanationTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  explanationText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  btnText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 15 },
  scoreCard: {
    margin: 20,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  scoreBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  scorePct: { fontSize: 36, fontFamily: "Inter_700Bold" },
  scoreTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  scoreDetail: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
