import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
  } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const RatingStar = ({ filled, onPress, value }) => (
  <TouchableOpacity onPress={() => onPress(value)}>
    <MaterialIcons
      name={filled ? "star" : "star-border"}
      size={28}
      color="#f1c40f"
    />
  </TouchableOpacity>
);

export function DetailsView(props) {
    const movie = props.movie
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const router = useRouter();

    function addToWatchlistACB() {
        props.addingToWatchList()
    }

    function posterPathACB() {
        return "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
    }

    const handleSetRating = (value) => {
        setRating(value);
    };

    const handleSubmitReview = async () => {
       
        setSubmittingReview(true);
        try {
            await props.onSubmitReview(rating, comment);
            setRating(0);
            setComment("");
            setShowReviewForm(false);
            Alert.alert("Success", "Your review has been submitted!");
        } catch (error) {
            Alert.alert("Error", "Failed to submit review. Please try again.");
            console.error("Review submission error:", error);
        } finally {
            setSubmittingReview(false);
        }
        
    };

    const toggleReviewForm = () => {
        setShowReviewForm(!showReviewForm);
        if (!showReviewForm) {
            setRating(0);
            setComment("");
        }
    };

    return (
        <ScrollView style={styles.base}>
            
            <Image source={{ uri: posterPathACB() }} style={styles.image} />

            <View style={styles.container}>
                <Text style={styles.grayText}>{props.movieGenres}</Text>
                <View style={styles.rowBetween}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={[styles.header, { flexShrink: 1 }]}>{movie.title}</Text>
                    </View> 
                    <LinearGradient
                        colors={['#4c669f','#3b5998','#192f6a']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.gradientButton}
                        >
                        <Pressable
                            onPress={addToWatchlistACB}
                            disabled={props.inWatchList}
                            style={styles.gradientInner}
                        >
                            <Text style={styles.gradientText}>
                            {props.inWatchList ? 'In Watchlist' : '+'}
                            </Text>
                        </Pressable>
                        </LinearGradient>
                </View>
                <Text style={styles.grayText}>{movie.release_date ? movie.release_date.substring(0, 4) : ""}</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.whiteText}>Rating: </Text>
                <Text style={styles.whiteText}>⭐  {movie.vote_average
                    ? Math.round(props.movie.vote_average * 10) / 10
                    : "?"} / 10</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.subHeader}>Description</Text>
                <Text style={styles.grayText}>{movie.overview}</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.subHeader}>Cast</Text>
                <Text style={styles.grayText}>{props.movieCast}</Text>
            </View>

            <View style={styles.container} >
                <Text style={styles.whiteText}>Available on:</Text>
                <Text style={styles.grayText}>{props.streamingPlatforms.length > 0
                    ? props.streamingPlatforms
                    : "Not available in your country" 
                    /* The country is preset to Sweden, see apiConfig.js */}
                </Text>
            </View>

            {/* User Reviews Section */}
            {props.currentMovieReviews && props.currentMovieReviews.length > 0 && (
                <View style={styles.container}>
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.subHeader}>User Reviews</Text>
                        {props.currentMovieAverageRating && (
                            <Text style={styles.averageRating}>
                                ⭐ {props.currentMovieAverageRating.toFixed(1)} avg
                            </Text>
                        )}
                    </View>
                    
                    {props.currentMovieReviews.map((review, index) => (
                        <View key={index} style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewerName}>{review.userName || "Anonymous"}</Text>
                                {review.rating && (
                                    <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                                )}
                            </View>
                            {review.comment && (
                                <Text style={styles.reviewComment}>"{review.comment}"</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Review Form Section */}
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.reviewToggleButton}
                    onPress={toggleReviewForm}
                >
                    <MaterialIcons 
                        name={showReviewForm ? "close" : "rate-review"} 
                        size={20} 
                        color="#fff" 
                    />
                    <Text style={styles.reviewToggleText}>
                        {showReviewForm ? "Cancel Review" : "Write a Review"}
                    </Text>
                </TouchableOpacity>

                {showReviewForm && (
                    <View style={styles.reviewForm}>
                        <Text style={styles.reviewFormLabel}>Rate this movie:</Text>
                        <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <RatingStar 
                                    key={value} 
                                    filled={rating >= value}
                                    onPress={handleSetRating}
                                    value={value}
                                />
                            ))}
                        </View>
                        
                        <Text style={styles.reviewFormLabel}>Comment (optional):</Text>
                        <TextInput
                            placeholder="Share your thoughts about this movie..."
                            placeholderTextColor="#888"
                            style={styles.reviewInput}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            numberOfLines={4}
                        />
                        
                        <LinearGradient
                            colors={['#4c669f','#3b5998','#192f6a']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={[
                                styles.submitReviewButton,
                                (!rating && !comment.trim()) && styles.disabledButton
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.submitReviewInner}
                                onPress={handleSubmitReview}
                                disabled={(!rating && !comment.trim()) || submittingReview}
                            >
                                <Text style={styles.submitReviewText}>
                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </View>

            <View style={styles.bottomPadding} />

        </ScrollView>
        )
  }
  
  const styles = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: "#111",
    },
    container: {
        padding: 16,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
    },
    subHeader: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    image: {
        width: "100%",
        aspectRatio: 3,
        margin: 0,
    },
    whiteText: {
        color: "white",
    },
    grayText: {
        color: "#bbb",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap"
    },
    gradientButton: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientInner: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    gradientText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Review styles
    reviewsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    averageRating: {
        color: "#f1c40f",
        fontSize: 16,
        fontWeight: "bold",
    },
    reviewItem: {
        backgroundColor: "#222",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#4c669f",
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    reviewerName: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    reviewRating: {
        color: "#f1c40f",
        fontSize: 14,
        fontWeight: "bold",
    },
    reviewComment: {
        color: "#ccc",
        fontSize: 14,
        fontStyle: "italic",
        lineHeight: 20,
    },
    reviewToggleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    reviewToggleText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
    },
    reviewForm: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
    },
    reviewFormLabel: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 8,
        fontWeight: "600",
    },
    starRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    reviewInput: {
        backgroundColor: "#2a2a2a",
        color: "#fff",
        padding: 12,
        borderRadius: 6,
        minHeight: 80,
        marginBottom: 16,
        textAlignVertical: "top",
        borderWidth: 1,
        borderColor: "#444",
    },
    submitReviewButton: {
        borderRadius: 6,
        overflow: 'hidden',
    },
    submitReviewInner: {
        padding: 12,
        alignItems: 'center',
    },
    submitReviewText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
    bottomPadding: {
        height: 100,
    },
  })