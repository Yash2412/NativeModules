/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  Text,
  useColorScheme,
  View,
  NativeModules,
  Button,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

// console.log(NativeModules.Duckdb);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleIncrement = () => {
    NativeModules.Duckdb.increment((value: any) => {
      console.log('Value Incremented', value);
    });
  };

  const handleGetTable = () => {
    NativeModules.Duckdb?.getTableData((value: any) => console.log(value));
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        <Text>hello</Text>
        <Button onPress={handleIncrement} title="Increment" />
        <Button onPress={handleGetTable} title="COnnect" />
      </View>
    </SafeAreaView>
  );
}

export default App;
