// Credits to: https://github.com/lumamontes
import React from "react";
import { useStorageState } from "./useStorageState";
import { useRouter } from "expo-router";
import { post } from "../services/httpService";
import { AUTH_LOGIN } from "@env";

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
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
  const [[isLoading, session], setSession] = useStorageState("session");
  return (
    <AuthContext.Provider
      value={{
        signIn: (email: string, password: string) => {
          // Add your login logic here
          // For example purposes, we'll just set a fake session in storage
          //This likely would be a JWT token or other session data
          login(email, password)
            .then((sessionData) => {
              console.log(sessionData);
              setSession(sessionData.token);
              router.push("/");
            })
            .catch((error) => {
              console.log(58, error);
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
