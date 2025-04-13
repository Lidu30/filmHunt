import { View, ActivityIndicator, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Homepage } from '../presenters/homepagePresenter';
import { reactiveModel } from '../bootstrapping';
/* import { useAuth } from '../hooks/useAuth'; */

const IndexPage = observer(() => {
 /*  const loading = useAuth(); */
/* loading = false;
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } */

  return (
      <Homepage model ={reactiveModel}/>
  );
});

export default IndexPage;
