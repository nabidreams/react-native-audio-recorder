import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Audio from '@nabidreams/react-native-audio';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default function App() {
  const [state, setState] = React.useState({
    status: 'starting',
    message: '--',
  });

  React.useEffect(() => {
    Audio.sampleMethod('Testing', 123, (message) => {
      setState({
        status: 'native callback received',
        message,
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>☆Audio example☆</Text>
      <Text style={styles.instructions}>STATUS: {state.status}</Text>
      <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
      <Text style={styles.instructions}>{state.message}</Text>
    </View>
  );
}
