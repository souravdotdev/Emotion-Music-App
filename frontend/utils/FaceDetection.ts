  import {
    FaceLandmarker,
    FilesetResolver,
    FaceLandmarkerResult
  } from "@mediapipe/tasks-vision";

  interface initOptions{
    videoRef: React.RefObject<HTMLVideoElement | null>;
    landmarkerRef: React.RefObject<FaceLandmarker | null>;
    streamRef: React.RefObject<MediaStream | null>;
  }

  interface detectLoopOptions{
    landmarkerRef: React.RefObject<FaceLandmarker | null>;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    setExpression: React.Dispatch<React.SetStateAction<string>>;
  }
  
  export const init = async ({videoRef, landmarkerRef, streamRef}: initOptions): Promise<void> => {
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
  };

  export const detectLoop = ({landmarkerRef, videoRef,setExpression}: detectLoopOptions): void => {
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