import { observer } from "mobx-react-lite"
import { SignupPresenter } from "../presenters/signupPresenter"
import { reactiveModel } from "../bootstrapping"

export default observer(function SignupPage() {
  return <SignupPresenter/>
})