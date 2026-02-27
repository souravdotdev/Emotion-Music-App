"use client"
import { useEffect, useRef, useState } from "react";
import React from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  FaceLandmarkerResult
} from "@mediapipe/tasks-vision";

export default function FaceDetection(): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [expression, setExpression] = useState<string>("Detecting...");

  const init = async (): Promise<void> => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1
    });

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    if (videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      await videoRef.current.play();
    }

    detectLoop();
  };

  const detectLoop = (): void => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const temp = performance.now();

    const results: FaceLandmarkerResult =
      landmarkerRef.current.detectForVideo(
        videoRef.current,
        temp,
      );

    if (results.faceBlendshapes?.length) {
      const blendshapes = results.faceBlendshapes[0].categories;

      const getScore = (name: string): number =>
        blendshapes.find((b) => b.categoryName === name)?.score ?? 0;

      const smileLeft = getScore("mouthSmileLeft");
      const smileRight = getScore("mouthSmileRight");
      const jawOpen = getScore("jawOpen");
      const browUp = getScore("browInnerUp");
      const frownLeft = getScore("mouthFrownLeft");
      const frownRight = getScore("mouthFrownRight");
      const browDown = getScore("browDownLeft") + getScore("browDownRight");
      const eyeSquintLeft = getScore("eyeSquintLeft");
      const eyeSquintRight = getScore("eyeSquintRight");

      let currentExpression = "Neutral";

      if (smileLeft > 0.5 && smileRight > 0.5) {
        currentExpression = "Happy 😄";
      } else if (jawOpen > 0.2 && browUp > 0.2) {
        currentExpression = "Surprised 😲";
      } else if (frownLeft > 0.01 && frownRight > 0.01) {
        currentExpression = "Sad 😢";
      } else if (browDown > 0.3 && (eyeSquintLeft > 0.2 || eyeSquintRight > 0.2)) {
        currentExpression = "Angry 😠";
      }

      setExpression(currentExpression);
    }

  };


  useEffect(() => {
    init();
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-5 bg-[#111]">
      <video
        ref={videoRef}
        className="w-100 rounded-2xl"
        playsInline
      />
      <h2 className="text-2xl font-bold text-white">{expression}</h2>
    <button className="cursor-pointer" onClick={detectLoop}>Analyse</button>
    </div>
  );
}