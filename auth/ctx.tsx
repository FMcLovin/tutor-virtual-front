// Credits to: https://github.com/lumamontes
import React from "react";
import { useStorageState } from "./useStorageState";
import { useRouter } from "expo-router";
import { post } from "../services/httpService";
import { AUTH_LOGIN } from "@env";
import useAlert from "../hooks/useAlert";

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: {
    token: string;
    user: any;
  } | null;
  isLoading: boolean;
}>({
  signIn: (email: string, password: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

const login = async (email: string, password: string) => {
  try {
    const response = await post(AUTH_LOGIN, {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export function SessionProvider(props: React.PropsWithChildren) {
  const router = useRouter();
  const [[isLoading, session], setSession] = useStorageState<{
    token: string;
    user: any;
  }>("session");
  const showAlert = useAlert();

  return (
    <AuthContext.Provider
      value={{
        signIn: (email: string, password: string) => {
          login(email, password)
            .then((sessionData) => {
              setSession(sessionData);
              router.push("/");
            })
            .catch((error) => {
              showAlert(error.error);
            });
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
