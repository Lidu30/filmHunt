import { View, ScrollView, Text, Button } from "react-native";
import { reactiveModel } from "/src/bootstrapping"; // src/boostrapping also works
import { model } from "./model";
import { observer } from "mobx-react-lite";

import { Details } from "../presenters/detailsPresenter"


// TODO pass reactive model down to presenters
const IndexPage = observer(() => {
  return (
    <ScrollView>
      <Text>WELCOME TO FILMHUNT!!!!!</Text>
      <Text>{reactiveModel.user}</Text> 
      <Button title="Test" onPress={() => console.log(reactiveModel)} />
      {/* <Details model={reactiveModel} /> */}

    </ScrollView>
  );
});

export default IndexPage;
