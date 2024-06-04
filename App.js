
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import GameApp from './src/GameApp';

export default function App() {
  return (
    <>
      <GameApp />
      <StatusBar  hidden={true} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
