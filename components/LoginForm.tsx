// components/LoginForm.tsx
import { View, Text, Image } from "react-native";
import StyledTextInput from "./ui/inputs/StyledTextInput";
import FormButton from "./ui/Buttons/FormButton";

const logoImage = require("../assets/logo.png");

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  emailError: string;
  passwordError: string;
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isLargeScreen: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading,
  emailError,
  passwordError,
  email,
  password,
  setEmail,
  setPassword,
  isLargeScreen,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-4 relative">
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
        <Text className="text-2xl font-bold mb-1 text-primary">MiTutor UV</Text>
        <Text className="text-xl mb-6">Inicia Sesión</Text>

        {/* Campo de correo */}
        <StyledTextInput
          label="Correo institucional"
          icon="account"
          value={email}
          onChangeText={setEmail}
          placeholder="zs21004492@estudiantes.uv.mx"
          keyboardType="email-address"
          autoCapitalize="none"
          errorText={emailError}
        />

        {/* Campo de contraseña */}
        <StyledTextInput
          label="Contraseña"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="* * * * * * * * *"
          autoCapitalize="none"
          isPassword={true}
          errorText={passwordError}
        />

        <FormButton
          isLoading={loading}
          onPress={() => onLogin(email, password)}
        >
          Iniciar Sesión
        </FormButton>
      </View>
    </View>
  );
};

export default LoginForm;
