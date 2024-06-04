import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { useCallback, useRef } from "react";
import { debounce } from "lodash";

import entities from "../entities";
import Physics from "../physics";

const GameApp = () => {
  const gameEngineRef = useRef(null);

  const addBall = useCallback(
    debounce(() => {
      gameEngineRef.current.dispatch({ type: "add-ball" });
    }, 200)
  );
  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameEngine}
        entities={entities()}
        systems={[Physics]}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addBall}>
          <Text style={styles.buttonText}>Create Ball</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gameEngine: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  button: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GameApp;
