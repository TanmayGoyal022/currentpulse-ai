import { Feather } from "@expo/vector-icons";
import {
  useCreateNote,
  useDeleteNote,
  useListNotes,
  useUpdateNote,
} from "@workspace/api-client-react";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import type { Note } from "@workspace/api-client-react";

export default function NotesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { data: notes, isLoading, refetch, isRefetching } = useListNotes();
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const deleteMutation = useDeleteNote();

  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");

  function openCreate() {
    setEditingNote(null);
    setContent("");
    setShowModal(true);
  }

  function openEdit(note: Note) {
    setEditingNote(note);
    setContent(note.content);
    setShowModal(true);
  }

  function handleSave() {
    if (!content.trim()) return;
    if (editingNote) {
      updateMutation.mutate(
        { id: editingNote.id, data: { content } },
        { onSuccess: () => { setShowModal(false); refetch(); } }
      );
    } else {
      createMutation.mutate(
        { data: { content } },
        { onSuccess: () => { setShowModal(false); refetch(); } }
      );
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleDelete(id: number) {
    Alert.alert("Delete Note", "This note will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMutation.mutate({ id }, { onSuccess: () => refetch() });
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
      },
    ]);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Notes"
        subtitle={`${notes?.length ?? 0} notes`}
        right={
          <Pressable
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={openCreate}
          >
            <Feather name="plus" size={18} color="#fff" />
          </Pressable>
        }
      />

      <FlatList
        data={notes ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => openEdit(item)}
          >
            <Text
              style={[styles.noteContent, { color: colors.foreground }]}
              numberOfLines={4}
            >
              {item.content}
            </Text>
            <View style={styles.noteFooter}>
              <Text style={[styles.noteDate, { color: colors.mutedForeground }]}>
                {formatDate(item.updatedAt)}
              </Text>
              <Pressable
                onPress={() => handleDelete(item.id)}
                hitSlop={8}
              >
                <Feather name="trash-2" size={15} color={colors.destructive} />
              </Pressable>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80,
        }}
        refreshing={isRefetching}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!notes && notes.length > 0}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="edit-3" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No notes yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Tap the + button to add a study note
            </Text>
            <Pressable
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={openCreate}
            >
              <Text style={styles.createBtnText}>Create Note</Text>
            </Pressable>
          </View>
        }
      />

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Pressable onPress={() => setShowModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.mutedForeground }]}>Cancel</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {editingNote ? "Edit Note" : "New Note"}
            </Text>
            <Pressable onPress={handleSave}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>Save</Text>
            </Pressable>
          </View>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write your study notes here..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={[styles.noteInput, { color: colors.foreground }]}
            autoFocus
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 10,
  },
  noteContent: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  noteFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  createBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginTop: 4 },
  createBtnText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 14 },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  modalCancel: { fontSize: 16, fontFamily: "Inter_400Regular" },
  modalTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  modalSave: { fontSize: 16, fontFamily: "Inter_700Bold" },
  noteInput: {
    flex: 1,
    padding: 20,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    textAlignVertical: "top",
  },
});
