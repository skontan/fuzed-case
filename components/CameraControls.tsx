import React, { memo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles as appStyles } from "../App.styles";

type CameraControlsProps = {
  onSwitchCamera: () => void;
  onTogglePoseDetection: () => void;
  isDetectingPoses: boolean;
};

const CameraControls = memo(
  ({
    onSwitchCamera,
    onTogglePoseDetection,
    isDetectingPoses,
  }: CameraControlsProps) => (
    <>
      <TouchableOpacity
        style={[appStyles.button, appStyles.switchCameraButton]}
        onPress={onSwitchCamera}
      >
        <MaterialIcons name="flip-camera-ios" size={40} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[appStyles.button, appStyles.togglePoseDetectionButton]}
        onPress={onTogglePoseDetection}
      >
        <MaterialIcons
          name={isDetectingPoses ? "stop" : "run-circle"}
          size={40}
          color="#fff"
        />
      </TouchableOpacity>
    </>
  )
);

export default CameraControls;
