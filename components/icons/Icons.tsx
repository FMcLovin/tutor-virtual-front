import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
//import FontAwesome from "@expo/vector-icons/FontAwesome";

export const ChatIcon = ({
  color = "black",
  size = 25,
  ...props
}: {
  color?: string;
  size?: number;
  [key: string]: any;
}) => <FontAwesome6 name="comment" size={size} color={color} {...props} />;

export const AboutIcon = ({
  color = "black",
  size = 25,
  ...props
}: {
  color?: string;
  size?: number;
  [key: string]: any;
}) => (
  <FontAwesome6 name="circle-question" size={size} color={color} {...props} />
);

export const CloudSave = ({
  color = "black",
  size = 25,
  ...props
}: {
  color?: string;
  size?: number;
  [key: string]: any;
}) => <FontAwesome6 name="cloud" size={size} color={color} {...props} />;

export const PlayIcon = ({
  color = "black",
  size = 25,
  ...props
}: {
  color?: string;
  size?: number;
  [key: string]: any;
}) => <FontAwesome6 name="play" size={size} color={color} {...props} />;

export const TrashIcon = ({
  color = "black",
  size = 25,
  ...props
}: {
  color?: string;
  size?: number;
  [key: string]: any;
}) => <FontAwesome6 name="trash" size={size} color={color} {...props} />;
