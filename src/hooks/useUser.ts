import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { userService } from "../services/user.service";
import { userAtom } from "../atoms/auth.atoms";
import { ApiResponse, User } from "../types";
import { UpdateUserProfileFormData } from "../schema/user.schema";

export const useUpdateUserProfile = () => {
  const setUser = useSetAtom(userAtom);
  return useMutation<ApiResponse<User>, Error, UpdateUserProfileFormData>({
    mutationKey: ["update-user-profile"],
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      setUser(data.data);
    },
  });
};

export const useUpdateWorkAvailability = () => {
  const [user, setUser] = useAtom(userAtom);
  return useMutation<ApiResponse<User>, Error, boolean, { previousUser: User | null }>({
    mutationKey: ["update-user-work-availability"],
    mutationFn: userService.updateWorkAvailability,
    onMutate: async (newAvailability) => {
      const previousUser = user;
      if (user) {
        setUser({
          ...user,
          profile: user.profile
            ? { ...user.profile, availableForWork: newAvailability }
            : { availableForWork: newAvailability, address: null },
        });
      }
      return { previousUser };
    },
    onError: (_err, _newAvailability, context) => {
      if (context?.previousUser !== undefined) {
        setUser(context.previousUser);
      }
    },
    onSuccess: (data) => {
      if (data?.data) {
        setUser(data.data);
      }
    },
  });
};
