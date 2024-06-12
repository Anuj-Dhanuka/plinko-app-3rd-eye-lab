import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

//entities
import entities from "../entities";

//physics
import Physics from "../physics";

//store
import { updateScore } from "../store/actions/ScoreAction";

//context 
import { useTheme } from "../context/ThemeContext";

//dimension utils
import { normalize, scaleVertical } from "../utils/DimensionUtils";

//common utils 
import { NUMBER_OF_ROWS } from "../utils/CommonUtils";

const GameApp = () => {
  const {currentTheme} = useTheme()
  const gameEngineRef = useRef(null);
  const dispatch = useDispatch()

  const [randomNumber, setRandomNumber] = useState(4);
  const [randomRow, setRandomRow] = useState(NUMBER_OF_ROWS/2)

  

  const score = (useSelector(({ scoreReducer }) => scoreReducer.score)).toFixed(1)
  const styles = getStyles(currentTheme);

  const getRandomRow = () => {
    const randomRowMin = (NUMBER_OF_ROWS/2) - 3 
  const randomRowMax = (NUMBER_OF_ROWS/2) + 1  
  const randomRow = Math.floor(Math.random() * (randomRowMax - randomRowMin + 1)) + randomRowMin  
  return randomRow
  }

  const addBall = useCallback(
    debounce(() => {
      const randomNumber = Math.floor(Math.random() * (NUMBER_OF_ROWS + 1)) + 1; 
      //setRandomNumber(randomNumber)
      const randomRow = getRandomRow()
      setRandomRow(randomRow)

      gameEngineRef.current.dispatch({ type: "add-ball"});
    }, 200)
  );

  const handleScore = (points) => {
    dispatch(updateScore(points))
  }

  return (
    <View style={styles.container}>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <View style={styles.randomNumberContainer}>
        <Text style={styles.randomNumberText}>Target Bucket: {randomNumber}</Text>
      </View>

      <GameEngine
        ref={gameEngineRef}
        style={styles.gameEngine}
        entities={entities(handleScore, randomNumber)}
        systems={[Physics(randomNumber, randomRow)]}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addBall}>
          <Text style={styles.buttonText}>Create Ball</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.appBackgroundColor,
  },
  gameEngine: {
    flex: 1,
  },
  scoreContainer: {
    width: "100%",
    height: scaleVertical(50),
    backgroundColor: theme.scoreContainerBackgroundColor,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: theme.scoreContainerBorderBottomColor,
    borderBottomWidth: scaleVertical(2),
  },
  scoreText: {
    color: theme.white,
    fontSize: normalize(20),
    fontWeight: "bold",
  },
  randomNumberContainer: {
    position: "absolute",
    top: scaleVertical(60),
    right: normalize(10),
    backgroundColor: theme.scoreContainerBackgroundColor,
    justifyContent: "center",
    alignItems: "center",
    borderColor: theme.randomNumberContainerBorderBottomColor,
    borderWidth: scaleVertical(2),
    borderRadius: normalize(10),
    padding: 10
  },
  randomNumberText: {
    color: theme.white,
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: scaleVertical(30),
    right: normalize(30),
  },
  button: {
    backgroundColor: theme.greenButtonBackgroundColor,
    borderRadius: normalize(10),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    paddingHorizontal: normalize(20),
    paddingVertical: scaleVertical(10),
  },
  buttonText: {
    color: theme.white,
    fontSize: normalize(16),
    fontWeight: "bold",
  },
});

export default GameApp;
