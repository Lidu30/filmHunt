import { observer } from "mobx-react-lite"
import { reactiveModel } from "../../bootstrapping"
import { Homepage } from '../../presenters/homepagePresenter';


export default observer(function HomePage() {
  return (
        <Homepage model = {reactiveModel} />
  )
})