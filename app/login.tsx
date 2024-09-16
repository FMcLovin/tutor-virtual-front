import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  Image,
} from "react-native";
import { styled } from "nativewind";

import { Screen } from "../components/Screen";

const StyledPressable = styled(Pressable);
const logoImage = require("../assets/logo.png");

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validar correos de @uv.mx o @estudiantes.uv.mx
  const validateEmail = (email: string) => {
    const uvRegex = /^[a-zA-Z0-9._%+-]+@(uv\.mx|estudiantes\.uv\.mx)$/;
    return uvRegex.test(email);
  };

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleLogin = () => {
    resetErrors();

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

    Alert.alert("Login exitoso");
    router.push("/");
  };

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        {/* Logo UV */}
        <Image
          source={logoImage}
          className="w-full h-32 object-contain mb-6"
          resizeMode="contain"
        />

        <Text className="text-2xl font-bold mb-1 text-primary">MiTutor UV</Text>
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

        {/* Muestra si la app corre en web o móvil */}
        {Platform.OS === "web" ? (
          <Text className="mt-4 text-sm text-gray-500">Estás en la web</Text>
        ) : (
          <Text className="mt-4 text-sm text-gray-500">
            Estás en un dispositivo móvil
          </Text>
        )}
      </View>
    </Screen>
  );
}
