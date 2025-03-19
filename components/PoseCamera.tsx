import React, { memo, useState } from "react";
import { View, StyleSheet } from "react-native";
import Svg from "react-native-svg";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { CameraView } from "expo-camera";
import AnimatedKeypoint from "./AnimatedKeypoint";
import * as posedetection from "@tensorflow-models/pose-detection";
import { SharedValue } from "react-native-reanimated";
import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  KEYPOINT_LABELS,
  TENSOR_DIMS,
} from "../utils/constants";

const TensorCamera = cameraWithTensors(CameraView);

type PoseCameraProps = {
  cameraFacing: "front" | "back";
  onReady: (
    images: IterableIterator<any>,
    updateCameraPreview: () => void,
    gl: ExpoWebGLRenderingContext,
    cameraTexture: WebGLTexture
  ) => void;
  pose: SharedValue<posedetection.Pose | null>;
};

const PoseCamera = memo(({ cameraFacing, onReady, pose }: PoseCameraProps) => {
  const [cameraLayout, setCameraLayout] = useState({ width: 0, height: 0 });

  const scaleX = cameraLayout.width / TENSOR_DIMS.width;
  const scaleY = cameraLayout.height / TENSOR_DIMS.height;
  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setCameraLayout({ width, height });
      }}
    >
      <TensorCamera
        style={styles.camera}
        cameraTextureHeight={CAMERA_HEIGHT}
        cameraTextureWidth={CAMERA_WIDTH}
        facing={cameraFacing}
        resizeHeight={TENSOR_DIMS.height}
        resizeWidth={TENSOR_DIMS.width}
        resizeDepth={3}
        onReady={onReady}
        autorender={false}
        useCustomShadersToResize={false}
      />
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${cameraLayout.width} ${cameraLayout.height}`}
        width={cameraLayout.width}
        height={cameraLayout.height}
      >
        {KEYPOINT_LABELS.map((label, i) => (
          <AnimatedKeypoint
            key={`keypoint-${i}`}
            index={i}
            label={label}
            scaleX={scaleX}
            scaleY={scaleY}
            pose={pose}
            flipHorizontal={cameraFacing === "front"}
          />
        ))}
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    aspectRatio: CAMERA_WIDTH / CAMERA_HEIGHT,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
});

export default PoseCamera;
