import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping"
import { WatchList } from "src/presenters/watchListPresenter"


export default observer(function WatchListPage() {
  return (
        <WatchList model = {reactiveModel} />
  )
})