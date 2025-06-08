import { Platform } from "react-native";
import { Alert } from "react-native";

const useAlert = () => {
  const showAlert = (message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${message}`);
    } else {
      Alert.alert(message);
    }
  };

  return showAlert;
};

export default useAlert;
