import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

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

  const isHighlighted = props.isHighlighted;
  //console.log(isHighlighted)

  const styles = getStyles(currentTheme);
  // const animationValue = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   if (isHighlighted) {
  //     Animated.sequence([
  //       Animated.timing(animationValue, {
  //         toValue: 1,
  //         duration: 100,
  //         useNativeDriver: false,
  //       }),
  //       Animated.timing(animationValue, {
  //         toValue: 0,
  //         duration: 100,
  //         useNativeDriver: false,
  //       }),
  //     ]).start();
  //   }
  // }, [isHighlighted]);

  // const backgroundColor = animationValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [currentTheme.plinkoColor, "yellow"]
  // });


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
