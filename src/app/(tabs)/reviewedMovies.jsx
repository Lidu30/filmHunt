import { observer } from "mobx-react-lite"
import { reactiveModel } from "../../bootstrapping"
import { ReviewedMovies } from "../../presenters/reviewedMoviesPresenter"

export default observer(function ReviewedMoviesPage() {
  return (
        <ReviewedMovies model = {reactiveModel} />
  )
})