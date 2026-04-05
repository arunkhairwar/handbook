import { AddClientModal } from "@/src/components/clients/AddClientModal";
import { ClientTile } from "@/src/components/clients/ClientTile";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { FullScreenLoader } from "@/src/components/ui/FullScreenLoader";
import { useClient } from "@/src/hooks/useClient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function ClientListScreen() {
  const { clients, isLoading, getAllClients, createClient } = useClient();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getAllClients();
  }, []);

  const handleAddClient = async (clientData: {
    name: string;
    mobile: string;
  }) => {
    try {
      await createClient(clientData);
      setModalVisible(false);
    } catch (e) {
      // Error handled in hook
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <FullScreenLoader message="loading clients..." />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ClientTile client={item} />}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getAllClients} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No clients found"
              description="Add a new client to get started."
              iconName="people-outline"
            />
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
  list: {
    padding: 16,
    flexGrow: 1,
  },
});
