import { useState } from 'react';
import { useAtom } from 'jotai';
import { siteAtom } from '../atoms/site.atoms';
import { siteService, CreateSiteData, UpdateSiteData } from '../services/site.service';
import Toast from 'react-native-toast-message';

export const useSite = () => {
  const [sites, setSites] = useAtom(siteAtom);
  const [isLoading, setIsLoading] = useState(false);

  const getAllSites = async () => {
    setIsLoading(true);
    try {
      const response = await siteService.getAllSites();
      const data = Array.isArray(response) ? response : response.data || [];
      setSites(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching sites:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to fetch sites',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSite = async (data: CreateSiteData) => {
    setIsLoading(true);
    try {
      const response = await siteService.createSite(data);
      await getAllSites();
      return response;
    } catch (error: any) {
      console.error('Error creating site:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to create site',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSite = async (id: string, data: UpdateSiteData) => {
    setIsLoading(true);
    try {
      const response = await siteService.updateSite(id, data);
      await getAllSites();
      return response;
    } catch (error: any) {
      console.error('Error updating site:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to update site',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSite = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await siteService.deleteSite(id);
      await getAllSites();
      return response;
    } catch (error: any) {
      console.error('Error deleting site:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to delete site',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sites,
    isLoading,
    getAllSites,
    createSite,
    updateSite,
    deleteSite,
  };
};
