import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  Image,
  useWindowDimensions,
} from "react-native";
import { styled } from "nativewind";

import { useSession } from "./ctx";
import { Redirect } from "expo-router";
import { KeyboardAvoidingView, ScrollView } from "react-native";

const StyledPressable = styled(Pressable);
const logoImage = require("../assets/logo.png");
const blurryDesktop = require("../assets/blurry_desktop.svg");
const blurryPhone = require("../assets/blurry_phone.svg");

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
  const handleLogin = async () => {
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
          {/* Muestra si la app corre en web o móvil */}
          {isWeb && isLargeScreen && (
            <View className="flex-1 items-center justify-center bg-slate-300">
              <Image className="h-full w-full" source={blurryDesktop} />
            </View>
          )}
          <View className="flex-1 items-center justify-center p-4 relative">
            {!isWeb && (
              <Image className="h-full w-full absolute" source={blurryPhone} />
            )}
            {/* Formulario de inicio de sesión */}
            <View
              className={`flex-1 items-center justify-center ${
                isLargeScreen ? "w-1/2" : "w-9/12"
              }`}
            >
              <Image
                source={logoImage}
                className="w-full h-32 object-contain mb-6"
                resizeMode="contain"
              />
              <Text className="text-2xl font-bold mb-1 text-primary">
                MiTutor UV
              </Text>
              <Text className="text-xl mb-6">Inicia Sesión</Text>
              {/* Campo de correo */}
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
                placeholder="Correo institucional"
                accessibilityLabel="Campo de correo institucional"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text className="text-red-500 mb-4">{emailError}</Text>
              ) : null}
              {/* Campo de contraseña */}
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 mb-6 w-full"
                placeholder="Contraseña"
                accessibilityLabel="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {passwordError ? (
                <Text className="text-red-500 mb-4">{passwordError}</Text>
              ) : null}
              {/* Botón de login */}
              <StyledPressable
                onPress={handleLogin}
                className={`w-full p-4 rounded-lg bg-primary ${loading ? "opacity-50" : "active:opacity-70"}`}
                disabled={loading}
              >
                <Text className="text-white text-center font-bold">
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Text>
              </StyledPressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
