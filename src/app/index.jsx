import { View,Text, Button } from "react-native";
import { reactiveModel } from "/src/bootstrapping"; // src/boostrapping also works
import { model } from "./model";
import { observer } from "mobx-react-lite";

// TODO pass reactive model down to presenters
const IndexPage = observer(() => {
  return (
    <View>
      <Text>WELCOME TO FILMHUNT!!!!!</Text>
      <Text>{reactiveModel.username}</Text> 
      <Button title="Test" onPress={() => console.log(model)} />
    </View>
  );
});

export default IndexPage;
