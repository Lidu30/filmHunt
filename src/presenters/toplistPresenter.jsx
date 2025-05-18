import { useEffect, useState } from "react";
import { fetchFullNameMap, getWatchlistById } from "../firestoreModel";
import { TopListView } from "../views/toplistView";
import { UserWatchlist } from "./userwatchlistPresenter"; 
import { observer } from "mobx-react-lite";

export const TopList = observer(function TopList(props) {
  const [fullNames, setFullNames] = useState([]);
  const [idToNameMap, setIdToNameMap] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedWatchlist, setSelectedWatchlist] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const nameMap = await fetchFullNameMap();
      setIdToNameMap(nameMap);
      setFullNames(Object.values(nameMap).filter(Boolean));
    }
    fetchData();
  }, []);

  const handleWatchlistPress = async (name, id) => {
    try {
      const watchlist = await getWatchlistById(id);
      setSelectedUserId(id);
      setSelectedUserName(name);
      setSelectedWatchlist(watchlist || []);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    }
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setSelectedUserName(null);
    setSelectedWatchlist([]);
  };

  return selectedUserId ? (
    <UserWatchlist
      userId={selectedUserId}
      userName={selectedUserName}
      watchlistItems={selectedWatchlist}
      onMovieSelect={props.onMovieSelect}
      onAddToWatchlist={props.onAddToWatchlist}
      onBack={handleBack}
    />
  ) : (
    <TopListView
      fullNames={fullNames}
      idToNameMap={idToNameMap}
      onWatchlistPress={handleWatchlistPress}
    />
  );
});
