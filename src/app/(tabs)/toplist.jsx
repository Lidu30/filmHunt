import { observer } from "mobx-react-lite";
import { TopList } from "src/presenters/toplistPresenter";
import { reactiveModel } from "../../bootstrapping";

export default observer(function TopListpage() {
  return (
  <TopList model={reactiveModel} />
)
});
