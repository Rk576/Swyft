import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { icons } from "@/constants"; // Adjust according to your project structure

// Replace with your Geoapify API key
const geoapifyApiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

// Define the type for places response
interface Place {
  properties: {
    formatted: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface GoogleTextInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: object; // Object instead of string for more flexible styles
  textInputBackgroundColor?: string;
  handlePress: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

const GoogleTextInput: React.FC<GoogleTextInputProps> = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [places, setPlaces] = useState<Place[]>([]);

  // Function to fetch places from Geoapify autocomplete API
  const fetchPlacesAutocomplete = async (query: string) => {
    if (!query) return;

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${geoapifyApiKey}`;

    try {
      const response = await fetch(url); // Using fetch here
      const data = await response.json(); // Parsing JSON response
      setPlaces(data.features);
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
    }
  };

  // Handle place selection
  const handleSelectPlace = (place: Place) => {
    const { coordinates } = place.geometry;
    const address = place.properties.formatted;

    handlePress({
      latitude: coordinates[1],
      longitude: coordinates[0],
      address,
    });

    setSearchQuery(address);
    setPlaces([]); // Clear the list after selection
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.searchBar}>
        <Image
          source={icon ? icon : icons.search}
          style={styles.icon}
          resizeMode="contain"
        />
        <TextInput
          style={[
            styles.textInput,
            textInputBackgroundColor
              ? { backgroundColor: textInputBackgroundColor }
              : undefined, // Fix: no empty string here
          ]}
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchPlacesAutocomplete(text);
          }}
        />
      </View>

      {/* Autocomplete list */}
      {places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectPlace(item)}>
              <Text style={styles.placeItem}>{item.properties.formatted}</Text>
            </TouchableOpacity>
          )}
          style={styles.listView}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#d4d4d4",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  listView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#d4d4d4",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    position: "absolute",
    top: 60,
    width: "100%",
    zIndex: 99,
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default GoogleTextInput;
