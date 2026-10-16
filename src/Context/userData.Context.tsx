import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";

import axios from "axios";
import type { UserDataType } from "../types/user.Type";

type UserDataContextType = {
  userData: UserDataType | null;
  setuserData: React.Dispatch<
    React.SetStateAction<UserDataType | null>
  >;
  isLoadingUser: boolean;
  getUserProfile: () => Promise<void>; // أضفنا الدالة هنا
};

export const userDataContext =
  createContext<UserDataContextType | null>(null);

type UserDataProviderProps = {
  children: ReactNode;
};

export function UserDataProvider({
  children,
}: UserDataProviderProps) {
  const [userData, setuserData] = useState<UserDataType | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // عملنا الدالة useCallback عشان نقدر نناديها في أي مكان بكل أمان
  const getUserProfile = useCallback(async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.data.user;
      setuserData(user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setuserData(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  return (
    <userDataContext.Provider
      value={{
        userData,
        setuserData,
        isLoadingUser,
        getUserProfile, 
      }}
    >
      {children}
    </userDataContext.Provider>
  );
}