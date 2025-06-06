// screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "../auth/ctx";
import LoginForm from "../components/LoginForm";

const blurryDesktop = require("../assets/blurry_desktop.svg");

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { signIn, session } = useSession();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isLargeScreen = width >= 1024;

  /**
   * validateEmail
   * @param email String user's email
   * @returns bolean
   */
  const validateEmail = (email: string): boolean => {
    const uvRegex = /^[\w.%+-]+@(uv\.mx|estudiantes\.uv\.mx)$/i;
    return uvRegex.test(email);
  };

  /**
   * resetErrors
   */
  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  /**
   * handleLogin
   * @returns null
   */
  const handleLogin = async (email: string, password: string) => {
    resetErrors();
    setLoading(true);

    try {
      if (!email.trim()) {
        setEmailError("Por favor, ingresa tu correo");
        return;
      }
      if (!validateEmail(email.trim())) {
        setEmailError("El correo debe ser @uv.mx o @estudiantes.uv.mx");
        return;
      }
      if (!password.trim()) {
        setPasswordError("Por favor, ingresa tu contraseña");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      await signIn(email.trim(), password.trim());
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return <Redirect href="/" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="flex-1"
      >
        <View className="flex-1 flex-row">
          {isWeb && isLargeScreen && (
            <View className="flex-1 items-center justify-center bg-slate-300">
              <Image className="h-full w-full" source={blurryDesktop} />
            </View>
          )}
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            emailError={emailError}
            passwordError={passwordError}
            onLogin={handleLogin}
            isLargeScreen={isLargeScreen}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
