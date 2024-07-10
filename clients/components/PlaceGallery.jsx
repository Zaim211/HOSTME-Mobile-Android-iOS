import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";

const PlaceGallery = ({ place }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  return (
    <View style={styles.container}>
      <Modal visible={showAllPhotos} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.title}>Photos of {place?.title}</Text>
            <TouchableOpacity
              onPress={() => setShowAllPhotos(false)}
              style={styles.closeButton}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/material-rounded/24/000000/close-window.png",
                }}
                style={styles.closeIcon}
              />
              <Text style={styles.closeButtonText}>Close photos</Text>
            </TouchableOpacity>
            {place?.photos?.length > 0 &&
              place.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              ))}
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.imageGrid}>
        <View style={styles.sideImages}>
          {place?.photos?.[0] && (
            <TouchableOpacity onPress={() => setShowAllPhotos(true)}>
              <Image
                source={{ uri: place.photos[0] }}
                style={styles.sideImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setShowAllPhotos(true)}
        style={styles.showMoreButton}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/material-rounded/24/000000/image-gallery.png",
          }}
          style={styles.showMoreIcon}
        />
        <Text style={styles.showMoreButtonText}>Check photos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollView: {
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  closeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  closeButtonText: {
    color: "red",
    fontSize: 16,
    marginTop: 60,
  },
  fullScreenImage: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: "row",
    gap: 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  mainImage: {
    flex: 2,
    aspectRatio: 1,
  },
  sideImages: {
    flex: 1,
    gap: 2,
  },
  sideImage: {
    aspectRatio: 1,
    flex: 1,
  },
  topImage: {
    marginTop: 2,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  showMoreIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  showMoreButtonText: {
    color: "black",
    fontSize: 16,
  },
});

export default PlaceGallery;
