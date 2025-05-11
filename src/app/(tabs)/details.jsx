import { observer } from "mobx-react-lite"
import { reactiveModel } from "../../bootstrapping"
import { Details } from "../../presenters/detailsPresenter"

export default observer(function DetailsPage() {
  return (
        <Details model = {reactiveModel} />
  )
})