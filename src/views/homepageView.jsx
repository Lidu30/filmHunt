import { observer } from "mobx-react-lite";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export const HomepageView = observer(({ moviesarray, isLoading }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Top Rated Movies</Text>

      {isLoading && <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />}

      {moviesarray.map((movie) => (
        <View key={movie.id} style={styles.card}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }}
            style={styles.poster}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.sub}>Released: {movie.release_date}</Text>
            <Text style={styles.sub}>⭐ {movie.vote_average}/10</Text>
            <Text numberOfLines={3} style={styles.overview}>
              {movie.overview}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#111",
    flex: 1,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  poster: {
    width: 100,
    height: 150,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sub: {
    color: "#ccc",
    fontSize: 13,
  },
  overview: {
    marginTop: 8,
    color: "#aaa",
    fontSize: 12,
  },
});
