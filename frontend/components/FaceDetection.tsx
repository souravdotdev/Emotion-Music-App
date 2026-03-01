"use client"
import { useEffect, useRef, useState } from "react";
import React from "react";
  import {
    FaceLandmarker,
  } from "@mediapipe/tasks-vision";
  import { init, detectLoop } from "@/utils/FaceDetection";
import { Button } from "./ui/button";

export default function FaceDetection(): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [expression, setExpression] = useState<string>("Detecting...");

  useEffect(() => {
    init({videoRef, landmarkerRef, streamRef});
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-5 bg-[#111]">
      <video
        ref={videoRef}
        className="w-100 rounded-2xl"
        playsInline
      />
      <h2 className="text-2xl font-bold text-white">{expression}</h2>
    <Button className="cursor-pointer" onClick={()=>detectLoop({landmarkerRef, videoRef,setExpression})}>Analyse</Button>
    </div>
  );
}