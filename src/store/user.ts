import {create} from "zustand"
import {UserInfo} from "@/types/user.ts"
import {getItem, removeItem, setItem} from "@/lib/storage.ts";
import {StorageSpace} from "@/enums/storage.ts";

interface UserStore {
  userInfo: Partial<UserInfo>
  userToken: string|null
  actions: {
    setUserInfo: (userInfo: UserInfo) => void
    setUserToken: (token: string) => void
    clearUserInfoAndToken: () => void
  }
}

const store = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageSpace.User) || {},
  userToken: getItem<string>(StorageSpace.Token),
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageSpace.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageSpace.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: null });
      removeItem(StorageSpace.User);
      removeItem(StorageSpace.Token);
    },
  },
}))

export default store