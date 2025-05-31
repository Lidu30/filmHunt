import { useEffect, useState, useMemo } from "react";
import { fetchFullNameMap, getWatchlistById } from "../firestoreModel";
import { TopListView } from "../views/toplistView";
import { UserWatchlist } from "./userwatchlistPresenter";
import { observer } from "mobx-react-lite";
import { useRouter } from "expo-router";

export const TopList = observer(function TopList(props) {
  const [fullNames, setFullNames] = useState([]);
  const [idToNameMap, setIdToNameMap] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedWatchlist, setSelectedWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const router = useRouter();

  const nameToIdMap = useMemo(() => {
    const mapping = {};
    Object.entries(idToNameMap).forEach(([id, name]) => {
      if (name) mapping[name] = id;
    });
    return mapping;
  }, [idToNameMap]);

  const filteredData = useMemo(() => {
    if (searchQuery.trim() === "") {
      return fullNames.map(name => ({
        name,
        id: nameToIdMap[name] || null
      }));
    }

    const lowerQuery = searchQuery.toLowerCase();

    const nameResults = fullNames
      .filter(name => name && name.toLowerCase().includes(lowerQuery))
      .map(name => ({
        name,
        id: nameToIdMap[name] || null
      }));

    const idResults = Object.entries(idToNameMap)
      .filter(([id]) => id.toLowerCase().includes(lowerQuery))
      .map(([id, name]) => ({ name, id }))
      .filter(item => item.name && !nameResults.some(r => r.name === item.name));

    return [...nameResults, ...idResults];
  }, [searchQuery, fullNames, idToNameMap, nameToIdMap]);

  const resultsInfoMessage = useMemo(() => {
    if (searchQuery.length === 0) return null;
    return `Found ${filteredData.length} result${filteredData.length !== 1 ? "s" : ""}`;
  }, [searchQuery, filteredData]);

  useEffect(() => {
    async function fetchData() {
      const nameMap = await fetchFullNameMap();
      setIdToNameMap(nameMap);
      setFullNames(Object.values(nameMap).filter(Boolean));
    }
    fetchData();
  }, []);

  const handleWatchlistPress = async (name, id, index) => {
    try {
      const watchlist = await getWatchlistById(id);
      setSelectedUserId(id);
      setSelectedUserName(name);
      setSelectedWatchlist(watchlist || []);
      setSelectedItemIndex(index);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    }
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setSelectedUserName(null);
    setSelectedWatchlist([]);
    setSelectedItemIndex(null);
    router.replace("/toplist");
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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
      filteredData={filteredData}
      searchQuery={searchQuery}
      selectedItemIndex={selectedItemIndex}
      resultsInfoMessage={resultsInfoMessage}
      onWatchlistPress={handleWatchlistPress}
      onSearchChange={handleSearchChange}
      onClearSearch={handleClearSearch}
    />
  );
});
