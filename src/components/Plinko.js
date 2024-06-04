import { View, StyleSheet } from "react-native";

const Plinko = (props) => {
    const width = props.size[0]
    const height = props.size[1]

    const x = props.body.position.x - width/2 
    const y = props.body.position.y - height/2 

  return (
    <View style={styles.container}>
      <View style={styles.plinko(x, y, width, height)}></View>
    </View>
  );
};

export default Plinko;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  plinko: (x, y, width, height) => ({
    top: y,
    left: x,
    height: height,
    width: width,
    backgroundColor: "green",
    borderRadius: height/2
  }),
});
