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
import { API_URL, AUTH_LOGIN } from "@env";
import { Redirect } from "expo-router";

const StyledPressable = styled(Pressable);
const logoImage = require("../assets/logo.png");
const blurryDesktop = require("../assets/blurry_desktop.svg");
const blurryPhone = require("../assets/blurry_phone.svg");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signIn, session } = useSession();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isLargeScreen = width >= 1024;

  /**
   * validateEmail
   * @param email String user's email
   * @returns bolean
   */
  const validateEmail = (email: string) => {
    const uvRegex = /^[a-zA-Z0-9._%+-]+@(uv\.mx|estudiantes\.uv\.mx)$/;
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
  const handleLogin = () => {
    resetErrors();
    console.log(API_URL, AUTH_LOGIN);

    if (!email) {
      setEmailError("Por favor, ingresa tu correo");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("El correo debe ser @uv.mx o @estudiantes.uv.mx");
      return;
    }
    if (!password) {
      setPasswordError("Por favor, ingresa tu contraseña");
      return;
    }

    signIn(email, password);
  };

  if (session) {
    return <Redirect href="/" />;
  }
  return (
    <View className="flex-1 flex-row">
      {/* Muestra si la app corre en web o móvil */}
      {isWeb && isLargeScreen && (
        <View className="flex-1 items-center justify-center bg-slate-300">
          <Image className="h-full w-full" source={blurryDesktop} />
        </View>
      )}
      <View className="flex-1 items-center justify-center p-4">
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
            placeholder="Correo"
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
            className="w-full p-4 rounded-lg bg-primary active:opacity-70"
          >
            <Text className="text-white text-center font-bold">
              Iniciar sesión
            </Text>
          </StyledPressable>
        </View>
      </View>
    </View>
  );
}
