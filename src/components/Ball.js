import { StyleSheet, View } from "react-native";

const Ball = (props) => {
  const width = props.size[0];
  const height = props.size[1];

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View style={styles.container}>
      <View style={styles.ball(x, y, width, height)}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  ball: (x, y, width, height) => ({
    position: "absolute",
    left: x,
    top: y,
    width: width,
    height: height,
    borderRadius: width / 2,
    backgroundColor: "white",
  }),
});

export default Ball;
