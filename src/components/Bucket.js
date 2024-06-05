import { Animated, StyleSheet, View, Text } from "react-native";

const Bucket = (props) => {
  const { size, color, points, animatedValue } = props;
  const [height, width] = size;

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bucket(x, y, height, width, color),
          {
            transform: [{ translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10], // Adjust the value to control how much the bucket moves up
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

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  bucket: (x, y, height, width, color) => ({
    justifyContent: "center",
    alignItems: "center",
    top: y,
    left: x,
    height: height,
    width: width,
    backgroundColor: color,
    borderRadius: 2
    
  }),
  pointsText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 4,
    
  },
});
