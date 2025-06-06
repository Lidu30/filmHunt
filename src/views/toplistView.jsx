import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";

export function TopListView({
  filteredData = [],
  searchQuery = "",
  selectedItemIndex = null,
  resultsInfoMessage = null,
  onWatchlistPress,
  onSearchChange,
  onClearSearch,
}) {
  const renderItem = ({ item, index }) => {
    const isSelected = selectedItemIndex === index;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed ? styles.cardPressed : null,
          isSelected ? styles.cardSelected : null,
        ]}
        onPress={() => {
          if (onWatchlistPress) {
            onWatchlistPress(item.name, item.id, index);
          }
        }}
        android_ripple={{ color: "#333" }}
      >
        <View style={styles.info}>
          <View style={styles.nameContainer}>
            <Text style={styles.title}>{item.name || "Unknown"}</Text>
            <Text style={styles.sub}>'s watchlist</Text>
          </View>

          {isSelected && (
            <View style={styles.watchlistBadge}>
              <Text style={styles.watchlistText}>Selected</Text>
            </View>
          )}
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Watchlists</Text>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClearSearch} style={styles.iconButton}>
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {resultsInfoMessage && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>{resultsInfoMessage}</Text>
        </View>
      )}

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.movieGrid}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noResults}>No watchlists found</Text>
      )}

      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#121212",
    flex: 1,
  },
  header: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    color: "white",
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconButton: {
    padding: 8,
  },
  clearButtonText: {
    color: "#aaa",
    fontSize: 18,
  },
  resultsInfo: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  resultsText: {
    color: "#3498db",
    fontSize: 16,
    textAlign: "center",
  },
  noResults: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 30,
  },
  movieGrid: {
    flexDirection: "column",
    gap: 15,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPressed: {
    backgroundColor: "#2a2a2a",
    transform: [{ scale: 0.98 }],
  },
  cardSelected: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  info: {
    flex: 1,
    position: "relative",
  },
  nameContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 4,
  },
  sub: {
    color: "#bbb",
    fontSize: 16,
  },
  userId: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  arrowContainer: {
    marginLeft: 10,
    backgroundColor: "rgba(52, 152, 219, 0.2)",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "#3498db",
    fontSize: 16,
  },
  watchlistBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgba(46, 204, 113, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  watchlistText: {
    color: "#2ecc71",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 40,
  },
});
