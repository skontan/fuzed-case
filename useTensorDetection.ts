import { useCallback, useEffect, useRef, useState } from "react";
import { ExpoWebGLRenderingContext } from "expo-gl";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import { SharedValue } from "react-native-reanimated";

type HandleImageTensorReady = (
  images: IterableIterator<tf.Tensor3D>,
  updateCameraPreview: () => void,
  gl: ExpoWebGLRenderingContext,
  cameraTexture: WebGLTexture
) => void;

type UseTensorDetectionProps = {
  pose: SharedValue<posedetection.Pose | null>;
  isDetectingRef: React.MutableRefObject<boolean>;
};

export function useTensorDetection({
  pose,
  isDetectingRef,
}: UseTensorDetectionProps) {
  const detectorRef = useRef<posedetection.PoseDetector | null>(null);
  const [isTFInitialized, setIsTFInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      await tf.ready();
      detectorRef.current = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        { modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER }
      );
      setIsTFInitialized(true);
    })();
  }, [detectorRef]);

  const handleImageTensorReady: HandleImageTensorReady = useCallback(
    (
      images: IterableIterator<tf.Tensor3D>,
      updateCameraPreview: () => void,
      gl: ExpoWebGLRenderingContext,
      cameraTexture: WebGLTexture
    ) => {
      const poseDetectionLoop = async () => {
        const imageTensor = images.next().value;
        if (imageTensor && detectorRef.current && isDetectingRef.current) {
          try {
            const detectedPoses = await detectorRef.current.estimatePoses(
              imageTensor,
              { flipHorizontal: false }
            );
            pose.value = detectedPoses[0];
          } catch (error) {
            console.error("Pose detection error:", error);
          }
          imageTensor.dispose();
        }

        gl.endFrameEXP();
        requestAnimationFrame(poseDetectionLoop);
      };

      poseDetectionLoop();
    },
    [detectorRef, isDetectingRef, pose]
  );

  return { handleImageTensorReady, isTFInitialized };
}
