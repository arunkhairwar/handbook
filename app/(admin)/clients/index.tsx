import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useClient } from "@/src/hooks/useClient";
import { ClientTile } from "@/src/components/clients/ClientTile";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { AddClientModal } from "@/src/components/clients/AddClientModal";
import { Colors } from "@/constants/Colors";

export default function ClientListScreen() {
  const { clients, isLoading, getAllClients, createClient } = useClient();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getAllClients();
  }, []);

  const handleAddClient = async (clientData: { name: string; mobile: string }) => {
    try {
      await createClient(clientData);
      setModalVisible(false);
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

      <AddClientModal
        visible={modalVisible}
        isLoading={isLoading}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddClient}
      />
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
});
