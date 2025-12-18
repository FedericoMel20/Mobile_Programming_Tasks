import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Priority,
  Todo,
  addTodo,
  deleteTodo,
  getTodos,
  initDB,
  updateTodo,
} from "../services/todoService";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      await initDB();
      await reload();
    })();
  }, []);

  async function reload() {
    const data = await getTodos();
    setTodos(data);
  }

  async function submit() {
    if (!text.trim()) return;

    if (editingId) {
      await updateTodo(editingId, { text, priority });
      setEditingId(null);
    } else {
      await addTodo(text.trim(), priority);
    }

    setText("");
    setPriority("medium");
    await reload();
  }

  async function toggleDone(item: Todo) {
    await updateTodo(item.id!, {
      done: item.done ? 0 : 1,
      finished_at: item.done ? null : new Date().toISOString(),
    });
    await reload();
  }

  function startEdit(item: Todo) {
    setEditingId(item.id!);
    setText(item.text);
    setPriority(item.priority);
  }

  function confirmDelete(item: Todo) {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTodo(item.id!);
          await reload();
        },
      },
    ]);
  }

  const filtered = todos.filter((t) => {
    if (filter === "done") return t.done === 1;
    if (filter === "undone") return t.done === 0;
    return true;
  });

  function renderItem({ item }: { item: Todo }) {
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.text}</Text>

        <Text
          style={[
            styles.cell,
            item.priority === "urgent" && styles.urgentText,
            item.priority === "medium" && styles.mediumText,
            item.priority === "low" && styles.lowText,
          ]}
        >
          {item.priority.toUpperCase()}
        </Text>

        <TouchableOpacity onPress={() => toggleDone(item)}>
          <Text
            style={[
              styles.cell,
              item.done ? styles.doneText : styles.undoneText,
            ]}
          >
            {item.done ? "DONE" : "UNDONE"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.cell}>
          {item.finished_at
            ? new Date(item.finished_at).toLocaleString()
            : "-"}
        </Text>

        {/* ACTIONS */}
        <View style={[styles.cell, styles.actionCell]}>
          <TouchableOpacity onPress={() => startEdit(item)}>
            <Text style={styles.actionEdit}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(item)}>
            <Text style={styles.actionDelete}>DEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To Do List Manager</Text>

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Task name..."
          placeholderTextColor="#777"
          style={styles.input}
          onFocus={() => setShowPriorityDropdown(false)}
        />

        <View style={styles.addArea}>
          <TouchableOpacity
            style={[
              styles.priorityBtn,
              priority === "urgent" && styles.urgentBtn,
              priority === "medium" && styles.mediumBtn,
              priority === "low" && styles.lowBtn,
            ]}
            onPress={() => setShowPriorityDropdown((v) => !v)}
          >
            <Text
              style={[
                styles.priorityText,
                priority === "urgent" && styles.urgentText,
                priority === "medium" && styles.mediumText,
                priority === "low" && styles.lowText,
              ]}
            >
              {priority.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {showPriorityDropdown && (
            <View style={styles.priorityMenu}>
              {(["urgent", "medium", "low"] as Priority[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={styles.priorityOption}
                  onPress={() => {
                    setPriority(p);
                    setShowPriorityDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      p === "urgent" && styles.urgentText,
                      p === "medium" && styles.mediumText,
                      p === "low" && styles.lowText,
                    ]}
                  >
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.addBtn} onPress={submit}>
            <Text style={styles.addText}>
              {editingId ? "SAVE" : "ADD"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER */}
      <View style={styles.filterRow}>
        {["all", "done", "undone"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f as any)}
            style={[
              styles.filterBtn,
              filter === f && styles.activeFilter,
            ]}
          >
            <Text style={styles.filterText}>{f.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Task</Text>
        <Text style={styles.header}>Priority</Text>
        <Text style={styles.header}>Status</Text>
        <Text style={styles.header}>Finished At</Text>
        <Text style={styles.header}>Action</Text>
      </View>

      {/* TABLE */}
      <View style={styles.table}>
        <FlatList
          data={filtered}
          extraData={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0a0a12" },
  title: {
    fontSize: 22,
    color: "#b56cff",
    textAlign: "center",
    marginBottom: 16,
  },

  inputRow: { flexDirection: "row", marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#555",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
  },

  addArea: { flexDirection: "row", alignItems: "center" },
  addBtn: {
    backgroundColor: "#00ff9c",
    marginLeft: 8,
    padding: 12,
    borderRadius: 6,
  },
  addText: { fontWeight: "bold" },

  priorityBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  priorityText: { fontWeight: "600", fontSize: 12 },

  urgentBtn: { borderColor: "#ff4d4d" },
  mediumBtn: { borderColor: "#ffcc00" },
  lowBtn: { borderColor: "#00ff9c" },

  urgentText: { color: "#ff4d4d" },
  mediumText: { color: "#ffcc00" },
  lowText: { color: "#00ff9c" },

  priorityMenu: {
    position: "absolute",
    top: "110%",
    right: 0,
    backgroundColor: "#0d0d10",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    paddingVertical: 6,
    zIndex: 1000,
  },
  priorityOption: { paddingHorizontal: 12, paddingVertical: 8 },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  filterBtn: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#666",
  },
  activeFilter: {
    backgroundColor: "#7f5cff",
    shadowColor: "#7f5cff",
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  filterText: { color: "#fff", fontSize: 12 },

  headerRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#444",
    paddingVertical: 6,
    marginTop: 10,
  },
  header: {
    flex: 1,
    color: "#00ff9c",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
  },

  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    marginTop: 6,
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  cell: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  actionCell: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionEdit: { color: "#7f5cff", fontWeight: "600" },
  actionDelete: { color: "#ff4d4d", fontWeight: "600" },

  doneText: { color: "#00ff9c" },
  undoneText: { color: "#ff4d4d" },

  emptyText: {
    color: "#999",
    textAlign: "center",
    padding: 12,
  },
});
