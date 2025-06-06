import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Message } from "../../../models/Message";

export interface MessageProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  message: Message;
  index: number;
  date: string;
}
