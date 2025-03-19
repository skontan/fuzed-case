import { StyleSheet } from "react-native";
import { CAMERA_HEIGHT, CAMERA_WIDTH } from "./utils/constants";

export const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    backgroundColor: "#000",
    alignSelf: "center",
    aspectRatio: CAMERA_WIDTH / CAMERA_HEIGHT,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  infoText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  overlayText: {
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
  },
  switchCameraButton: {
    top: 40,
    right: 20,
  },
  togglePoseDetectionButton: {
    top: 40,
    left: 20,
  },
});
