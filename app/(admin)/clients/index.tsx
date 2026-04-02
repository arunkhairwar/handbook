import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useClient } from "@/src/hooks/useClient";
import { ClientTile } from "@/src/components/clients/ClientTile";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Colors } from "@/constants/Colors";

export default function ClientListScreen() {
  const { clients, isLoading, getAllClients, createClient } = useClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    getAllClients();
  }, []);

  const handleAddClient = async () => {
    if (!name || !mobile) return;
    try {
      await createClient({ name, mobile });
      setModalVisible(false);
      setName("");
      setMobile("");
    } catch (e) {
      // Error handled in hook
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && clients.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ClientTile client={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No clients found.</Text>
          }
        />
      )}

      <FloatingActionButton
        variant="primary"
        onPress={() => setModalVisible(true)}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Client</Text>

            <Input
              label="Client Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Arun Khairwar"
            />
            <Input
              label="Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              placeholder="e.g. 9876543210"
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Add Client"
                onPress={handleAddClient}
                style={{ flex: 1, marginLeft: 8 }}
                disabled={isLoading || !name || !mobile}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.primary,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 16,
  },
});
