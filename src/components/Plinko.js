import { View, StyleSheet } from "react-native";

//dimension utils
import { normalize, scaleVertical } from "../utils/DimensionUtils";

//context 
import { useTheme } from "../context/ThemeContext";

const Plinko = (props) => {
  const {currentTheme} = useTheme()

  const width = props.size[0];
  const height = props.size[1];

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const isHighlighted = props.body.isHighlighted;

  const styles = getStyles(currentTheme);

  return (
    <View style={styles.container(x, y)}>
      <View style={styles.plinko(width, height)}></View>
    </View>
  );
};

export default Plinko;

const getStyles = (theme) => StyleSheet.create({
  container: (x, y) => ({
    position: "absolute",
    top: scaleVertical(y),
    left: normalize(x),
  }),
  plinko: (width, height) => ({
    height: scaleVertical(height),
    width: normalize(width),
    backgroundColor: theme.plinkoColor,
    borderRadius: normalize(height / 2),
  }),
});
