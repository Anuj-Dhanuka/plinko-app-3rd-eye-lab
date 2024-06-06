import { Animated, StyleSheet, View, Text } from "react-native";

//dimension utils 
import { normalize, scaleVertical } from "../utils/DimensionUtils";

//context 
import { useTheme } from "../context/ThemeContext";

const Bucket = (props) => {
  const {currentTheme} = useTheme()

  const { size, color, points, animatedValue } = props;
  const [height, width] = size;

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const styles = getStyles(currentTheme);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bucket(x, y, height, width, color),
          {
            transform: [{ translateY: animatedValue.interpolate({
                inputRange: [scaleVertical(0), scaleVertical(1)],
                outputRange: [scaleVertical(0), scaleVertical(-5)],
              }),
            }],
          },
        ]}
      >
        <Text style={styles.pointsText}>{points}x</Text>
      </Animated.View>
    </View>
  );
};

export default Bucket;

const getStyles = (theme) => StyleSheet.create({
  container: {
    position: "absolute",
  },
  bucket: (x, y, height, width, color) => ({
    justifyContent: "center",
    alignItems: "center",
    top: scaleVertical(y),
    left: normalize(x),
    height: scaleVertical(height),
    width: normalize(width),
    backgroundColor: color,
    borderRadius: normalize(2)
    
  }),
  pointsText: {
    color: theme.white,
    fontWeight: "bold",
    fontSize: normalize(4),
    
  },
});
