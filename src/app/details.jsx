import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping"
import { Details } from "src/presenters/detailsPresenter"


export default observer(function DetailsPage() {
  return (
        <Details model = {reactiveModel} />
  )
})