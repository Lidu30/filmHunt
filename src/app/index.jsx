import { View, ScrollView, Text, Button } from "react-native";
import { reactiveModel } from "/src/bootstrapping"; // src/boostrapping also works
import { model } from "./model";
import { observer } from "mobx-react-lite";

import { Details } from "../presenters/detailsPresenter"
import { WatchList } from "../presenters/watchListPresenter"

// TODO pass reactive model down to presenters
const IndexPage = observer(() => {
  return (
    <ScrollView>
      <Text>WELCOME TO FILMHUNT!!!!!</Text>
      <Text>{reactiveModel.username}</Text> 
      <Button title="Test" onPress={() => console.log(model)} />

      {/*<Details model = {reactiveModel} />*/}
        < WatchList model = {reactiveModel} />

    </ScrollView>
  );
});

export default IndexPage;
