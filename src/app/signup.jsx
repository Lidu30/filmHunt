import { observer } from "mobx-react-lite"
import { SignupPresenter } from "../presenters/signupPresenter"


export default observer(function SignupPage() {
  return <SignupPresenter/>
})