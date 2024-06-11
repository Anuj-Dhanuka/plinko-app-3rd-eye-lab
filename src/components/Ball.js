import { StyleSheet, View } from "react-native";

//dimension utils
import { normalize, scaleVertical } from "../utils/DimensionUtils";

//context 
import { useTheme } from "../context/ThemeContext";

const Ball = (props) => {
  const {currentTheme} = useTheme()

  const width = props.size[0];
  const height = props.size[1];

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const styles = getStyles(currentTheme);

  return (
    <View style={styles.container}>
      <View style={styles.ball(x, y, width, height)}></View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    position: "absolute",
  },
  ball: (x, y, width, height) => ({
    position: "absolute",
    left: x,
    top: y,
    width: normalize(width),
    height: scaleVertical(height),
    borderRadius: normalize(width / 2),
    backgroundColor: theme.white,
  }),
});

export default Ball;
