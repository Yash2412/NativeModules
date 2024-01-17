/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import * as RNFS from 'react-native-fs';

import {
  SafeAreaView,
  Text,
  useColorScheme,
  View,
  NativeModules,
  Button,
  ScrollView,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const {DuckDb} = NativeModules;

const headers = {
  Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0aXAtNnJZakFYd0hPaWdlU2JfQ2Z2MUZ4ZlFqanVqdkhFUEN2aEVGczFvIn0.eyJleHAiOjE3MDU0MDYwMzIsImlhdCI6MTcwNTM4ODAzMiwiYXV0aF90aW1lIjoxNzA1Mzg4MDMwLCJqdGkiOiJjNDk2Nzg0My1lMjU0LTRiYzAtYTMxYy1mMjE2YjU0MWNhODciLCJpc3MiOiJodHRwczovL2F1dGguMzE0ZWNvcnAudGVjaC9hdXRoL3JlYWxtcy9waHIiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMzQxNWIyYmItMmM0ZC00MDQ2LTk2NGQtM2I4NWJlNjVmZWRmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicGhyIiwibm9uY2UiOiJiNDlhOWE5MC04ZTNlLTQ4ZTktOTI1OS0zMGExODZiZjQ1MjAiLCJzZXNzaW9uX3N0YXRlIjoiMmMyYWI5YWMtYzQxNS00MWI1LTgzZTAtY2FiMDUxMjM1YmEzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3Boci4zMTRlY29ycC50ZWNoIiwiaHR0cDovL3dlbGxmb3JjZS5waHIuMzE0ZWNvcnAudGVjaCIsImh0dHBzOi8vbG9jYWxob3N0OjkwMDAiLCJodHRwOi8vcGhyLjMxNGVjb3JwLnRlY2giLCJodHRwczovL2xvY2FsaG9zdDo4MDAwIiwiaHR0cDovL2xvY2FsaG9zdDo4MDAwIiwiaHR0cHM6Ly9kZXYucGhyLjMxNGVjb3JwLnRlY2giLCJodHRwczovL3dlbGxmb3JjZS5waHIuMzE0ZWNvcnAudGVjaCIsImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1waHIiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6IjJjMmFiOWFjLWM0MTUtNDFiNS04M2UwLWNhYjA1MTIzNWJhMyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6ImpvZSBzbWFydCIsInByZWZlcnJlZF91c2VybmFtZSI6ImpvZSIsImdpdmVuX25hbWUiOiJqb2UiLCJmYW1pbHlfbmFtZSI6InNtYXJ0IiwiZW1haWwiOiJqb2VAZ21haWwuY29tIn0.nLeBL1o_V646RZ2LWYcGMdCwZyDfBCTAcqR9dVFVhlKBTE8L_qY7qRPgt-J_0kEq8aKXmF1IOWEQ03QQPpEl8p78PN8yxW6ouX29vdJjNZx6bUu3-y14IgX6XcDBDMu6PEwpWkpXQ7nKz338IE4I5enaAeA3agN_FKQ75ju5AID9IBIg4dNuHNQ--TRTIPuHEuIGbsTG549iGoBbAmpdySyjuEN2ez1VLnO8mfnFIAhgI9DkeNOFKr9RGoobvu9dy70yCrlXbGEQn8r1A5C777kV-E-vQDUjJ9oQcFbaA5xuelt1h6pWkhmdzogr2DhEKqng0lPi1edPFiUSp73FCw`,
  Accept: 'application/parquet',
};

function App(): React.JSX.Element {
  const [jsonString, setJsonString] = React.useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const downloadFile = async (url: string, destination: string) => {
    try {
      const response = await fetch(url, {headers});
      await RNFS.downloadFile({
        fromUrl: response.url,
        toFile: destination,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleGetTable = async () => {
    try {
      const resourceName = 'allergy';
      const url = 'http://localhost:4445/allergy1.parquet';
      const destination = `${RNFS.CachesDirectoryPath}/phr/resources`;
      const filePath = `${destination}/${resourceName}.parquet`;
      const tempFilePath = `${destination}/${resourceName}.json`;
      await RNFS.mkdir(destination);
      await downloadFile(url, filePath);
      console.log(filePath);

      await DuckDb.runQuery(
        `COPY (SELECT * FROM '${filePath}') TO '${tempFilePath}' (FORMAT JSON, ARRAY true);`,
      );

      const jsonContent = await RNFS.readFile(tempFilePath, 'utf8');
      const jsonParsed = JSON.parse(jsonContent);
      setJsonString(JSON.stringify(jsonParsed, null, 2));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        <Text>hello</Text>
        <Button onPress={handleGetTable} title="Run Query" />
        <ScrollView>
          <Text>{jsonString}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default App;
