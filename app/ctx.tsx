// Credits to: https://github.com/lumamontes
import React from "react";
import { useStorageState } from "./useStorageState";
import { useRouter } from "expo-router";
import { post } from "../services/httpService";
import { AUTH_LOGIN } from "@env";

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
  }>("session"); // Cambia el tipo según tu estructura

  return (
    <AuthContext.Provider
      value={{
        signIn: (email: string, password: string) => {
          login(email, password)
            .then((sessionData) => {
              console.log(sessionData);
              setSession(sessionData); // Guardar todo el objeto { token, user }
              router.push("/");
            })
            .catch((error) => {
              console.log(error);
            });
        },
        signOut: () => {
          setSession(null); // Limpiar la sesión
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
