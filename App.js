import { StyleSheet, Text, View, StatusBar } from "react-native";
import { Provider } from "react-redux";

//game app
import GameApp from "./src/GameApp";

//store
import store from "./src/store/store";

//context
import { ThemeProvider } from "./src/context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <GameApp />
        <StatusBar style="auto" hidden={true} />
      </Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
