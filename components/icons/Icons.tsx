import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
//import FontAwesome from "@expo/vector-icons/FontAwesome";

export const CircleInfoIcon = (props: any) => (
  <FontAwesome6 name="circle-info" size={24} color="white" {...props} />
);

export const HomeIcon = (props: any) => (
  <FontAwesome6 name="house" size={32} color="white" {...props} />
);

export const InfoIcon = (props: any) => (
  <FontAwesome6 name="circle-info" size={32} color="white" {...props} />
);

export const BarsIcon = (props: any) => (
  <FontAwesome6 name="bars" size={32} color="#475569" {...props} />
);

export const RobotIcon = (props: any) => (
  <FontAwesome6 name="robot" size={32} color="white" {...props} />
);

export const CircleExclamation = (props: any, color: string) => (
  <FontAwesome6 name="circle-exclamation" size={32} color={color} {...props} />
);

export const ChevronLeft = (props: any, color: string) => (
  <FontAwesome6 name="chevron-left" size={25} color={color} {...props} />
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
