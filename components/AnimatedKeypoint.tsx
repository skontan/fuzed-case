import React, { useState, memo } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";
import { Text as SvgText, Circle } from "react-native-svg";
import * as posedetection from "@tensorflow-models/pose-detection";
import { CONFIDENCE_THRESHOLD, TENSOR_DIMS } from "../utils/constants";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);

type AnimatedKeypointProps = {
  index: number;
  label: string;
  scaleX: number;
  scaleY: number;
  pose: SharedValue<posedetection.Pose | null>;
  flipHorizontal?: boolean;
};

const AnimatedKeypoint = memo(
  ({
    index,
    label,
    scaleX,
    scaleY,
    pose,
    flipHorizontal = false,
  }: AnimatedKeypointProps) => {
    const labelX = useSharedValue(0);
    const labelY = useSharedValue(0);
    const labelOpacity = useSharedValue(0);

    const animatedProps = useAnimatedProps(() => {
      let cx = 0;
      let cy = 0;
      let visible = 0;

      const kp = pose.value?.keypoints?.[index];

      if (kp && kp.score && kp.score > CONFIDENCE_THRESHOLD) {
        // Adjust x position based on flipHorizontal
        const adjustedX = flipHorizontal ? kp.x : TENSOR_DIMS.width - kp.x;

        cx = adjustedX * scaleX;
        cy = kp.y * scaleY;
        visible = 1;
      }

      // Update label positions based on computed cx, cy
      labelX.value = cx;
      labelY.value = cy + 15;
      labelOpacity.value = visible;
      return { cx, cy, opacity: visible };
    });

    const textAnimatedProps = useAnimatedProps(() => ({
      x: labelX.value,
      y: labelY.value,
      opacity: labelOpacity.value,
    }));

    return (
      <>
        <AnimatedCircle animatedProps={animatedProps} r={5} fill={"red"} />
        <AnimatedText
          animatedProps={textAnimatedProps}
          fill="white"
          fontSize="10"
          textAnchor="middle"
        >
          {label}
        </AnimatedText>
      </>
    );
  }
);

export default AnimatedKeypoint;
