import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const RatingStar = ({ filled, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <MaterialIcons
      name={filled ? "star" : "star-border"}
      size={32}
      color="#f1c40f"
    />
  </TouchableOpacity>
);
