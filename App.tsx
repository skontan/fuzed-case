import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { Camera } from "expo-camera";
import * as posedetection from "@tensorflow-models/pose-detection";
import { useSharedValue } from "react-native-reanimated";
import { useTensorDetection } from "./useTensorDetection";
import PoseCamera from "./components/PoseCamera";
import CameraControls from "./components/CameraControls";
import { styles } from "./App.styles";

export default function App() {
  // Camera permissions
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Shared value for the detected pose
  const pose = useSharedValue<posedetection.Pose | null>(null);

  // State for toggling pose detection
  const [isDetectingPoses, setIsDetectingPoses] = useState(true);
  const isDetectingPosesRef = useRef(true);

  // Direction the camera is facing
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("back");

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Custom hook for handling pose detection
  const { handleImageTensorReady, isTFInitialized } = useTensorDetection({
    pose,
    isDetectingRef: isDetectingPosesRef,
  });

  const handleSwitchCamera = () => {
    setCameraFacing((prev) => (prev === "front" ? "back" : "front"));
  };

  const handleTogglePoseDetection = () => {
    setIsDetectingPoses((prev) => !prev);
    isDetectingPosesRef.current = !isDetectingPosesRef.current;
    if (!isDetectingPosesRef.current) {
      pose.value = null;
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      {isTFInitialized ? (
        <PoseCamera
          cameraFacing={cameraFacing}
          onReady={isDetectingPoses ? handleImageTensorReady : () => {}}
          pose={pose}
        />
      ) : (
        <Text style={styles.infoText}>Initializing...</Text>
      )}
      <Text style={styles.overlayText}>
        Pose Detection {isDetectingPoses ? "Active" : "Inactive"}
      </Text>
      <CameraControls
        onSwitchCamera={handleSwitchCamera}
        onTogglePoseDetection={handleTogglePoseDetection}
        isDetectingPoses={isDetectingPoses}
      />
    </View>
  );
}
