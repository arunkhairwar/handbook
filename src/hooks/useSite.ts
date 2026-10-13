import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  siteService,
  CreateSiteData,
  UpdateSiteData,
} from "../services/site.service";

/**
 * Hook to fetch paginated sites list using infinite query.
 */
export const useSites = (params?: { q?: string; limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ["sites", params?.q, params?.limit],
    queryFn: ({ pageParam }) =>
      siteService.getAllSites({
        cursor: pageParam as string | undefined,
        q: params?.q,
        limit: params?.limit,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.pagination?.nextCursor ?? undefined,
  });
};

/**
 * Hook to fetch single site details.
 */
export const useSiteDetails = (id: string) => {
  return useQuery({
    queryKey: ["site", id],
    queryFn: async () => {
      const res = await siteService.getSiteById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a site.
 */
export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: siteService.createSite,
    meta: { errorTitle: "Failed to create site" },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
};

/**
 * Hook to update a site.
 */
export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteData }) =>
      siteService.updateSite(id, data),
    meta: { errorTitle: "Failed to update site" },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["site", variables.id] });
    },
  });
};

/**
 * Hook to delete a site.
 */
export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: siteService.deleteSite,
    meta: { errorTitle: "Failed to delete site" },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
};
