import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart } from "@/redux/trackSlice";

const Backet: React.FC = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const cartTracks = useSelector((state: RootState) => state.tracks.cart); // Треки в корзине

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
      Your cart
      ({cartTracks.length})
      </Text>

      {cartTracks.length === 0 ? (
        <Text style={styles.emptyText}>Ваша корзина пуста</Text>
      ) : (
        <FlatList
          data={cartTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.trackItem}>
              <Text style={styles.trackTitle}>{item.title} - {item.artist}</Text>
              <Text style={styles.price}>{item.price} $</Text>
              <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {cartTracks.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Make a deal</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dark: {
    backgroundColor: "#070e2e",
  },
  light: {
    backgroundColor: "#ffffff",
  },
  darkText: {
    color: "#ffffff",
  },
  lightText: {
    color: "#000000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  trackTitle: {
    color: "white",
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
    backgroundColor: "#B22222",
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
    position: 'fixed'
  },
  checkoutButton: {
    marginBottom: '15%',
    padding: 15,
    backgroundColor: "#ff8c00",
    borderRadius: 5,
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    
    position: 'absolute',
    right: '22%',
    color: 'green'
  }
});

export default Backet;
