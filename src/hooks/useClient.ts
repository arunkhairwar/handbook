import { useState } from 'react';
import { useAtom } from 'jotai';
import { clientAtom } from '../atoms/client.atoms';
import { clientService, CreateClientData, UpdateClientData } from '../services/client.service';
import Toast from 'react-native-toast-message';

export const useClient = () => {
  const [clients, setClients] = useAtom(clientAtom);
  const [isLoading, setIsLoading] = useState(false);

  const getAllClients = async () => {
    setIsLoading(true);
    try {
      const response = await clientService.getAllClients();
      const data = Array.isArray(response) ? response : response.data || [];
      setClients(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to fetch clients',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (data: CreateClientData) => {
    setIsLoading(true);
    try {
      const response = await clientService.createClient(data);
      await getAllClients();
      return response;
    } catch (error: any) {
      console.error('Error creating client:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to create client',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id: string, data: UpdateClientData) => {
    setIsLoading(true);
    try {
      const response = await clientService.updateClient(id, data);
      await getAllClients();
      return response;
    } catch (error: any) {
      console.error('Error updating client:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to update client',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await clientService.deleteClient(id);
      await getAllClients();
      return response;
    } catch (error: any) {
      console.error('Error deleting client:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to delete client',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clients,
    isLoading,
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
  };
};
