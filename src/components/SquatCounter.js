import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const findAngle = (p1, p2, p3) => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
    Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

const AdvancedSquatCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [correctSquats, setCorrectSquats] = useState(0);
  const [incorrectSquats, setIncorrectSquats] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  // State tracking
  const stateRef = useRef({
    stateSeq: [],
    currentState: null,
    prevState: null,
    incorrectPosture: false
  });

  // Thresholds
  const THRESHOLDS = {
    HIP_KNEE_VERT: {
      NORMAL: [0, 45],    // Standing position
      TRANS: [45, 90],    // Transition
      PASS: [90, 135]     // Deep squat
    },
    HIP_THRESH: [60, 120],
    KNEE_THRESH: [50, 100, 130],
    ANKLE_THRESH: 80,
    OFFSET_THRESH: 30
  };

  // Add camera permission request function
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please grant permission to use this feature.');
      setHasPermission(false);
      setIsLoading(false);
      return false;
    }
  };

  const getSquatState = (kneeAngle) => {
    if (THRESHOLDS.HIP_KNEE_VERT.NORMAL[0] <= kneeAngle &&
      kneeAngle <= THRESHOLDS.HIP_KNEE_VERT.NORMAL[1]) {
      return 's1';
    } else if (THRESHOLDS.HIP_KNEE_VERT.TRANS[0] <= kneeAngle &&
      kneeAngle <= THRESHOLDS.HIP_KNEE_VERT.TRANS[1]) {
      return 's2';
    } else if (THRESHOLDS.HIP_KNEE_VERT.PASS[0] <= kneeAngle &&
      kneeAngle <= THRESHOLDS.HIP_KNEE_VERT.PASS[1]) {
      return 's3';
    }
    return null;
  };

  const updateStateSequence = (state) => {
    const stateTracker = stateRef.current;

    if (state === 's2') {
      if ((!stateTracker.stateSeq.includes('s3') &&
        stateTracker.stateSeq.filter(s => s === 's2').length === 0) ||
        (stateTracker.stateSeq.includes('s3') &&
          stateTracker.stateSeq.filter(s => s === 's2').length === 1)) {
        stateTracker.stateSeq.push(state);
      }
    } else if (state === 's3') {
      if (!stateTracker.stateSeq.includes(state) &&
        stateTracker.stateSeq.includes('s2')) {
        stateTracker.stateSeq.push(state);
      }
    }
  };

  const checkSquat = (landmarks) => {
    if (!landmarks) return;

    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    // Calculate vertical angles
    const leftKneeAngle = findAngle(
      leftHip,
      leftKnee,
      { x: leftKnee.x, y: 0 }
    );

    const rightKneeAngle = findAngle(
      rightHip,
      rightKnee,
      { x: rightKnee.x, y: 0 }
    );

    const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    const currentState = getSquatState(kneeAngle);

    // Update state sequence
    if (currentState) {
      updateStateSequence(currentState);
    }

    // Check if squat is complete
    if (currentState === 's1') {
      const stateTracker = stateRef.current;

      if (stateTracker.stateSeq.length === 3 &&
        !stateTracker.incorrectPosture) {
        setCorrectSquats(prev => prev + 1);
        setFeedback('Perfect squat! 🎉');
      } else if (stateTracker.incorrectPosture ||
        (stateTracker.stateSeq.includes('s2') &&
          stateTracker.stateSeq.length === 1)) {
        setIncorrectSquats(prev => prev + 1);
        setFeedback('Incorrect form! Check your posture.');
      }

      // Reset state
      stateTracker.stateSeq = [];
      stateTracker.incorrectPosture = false;
    } else {
      // Check form issues
      const hipAngle = findAngle(
        leftShoulder,
        leftHip,
        leftKnee
      );

      const ankleAngle = findAngle(
        leftKnee,
        leftAnkle,
        { x: leftAnkle.x, y: 0 }
      );

      if (hipAngle > THRESHOLDS.HIP_THRESH[1]) {
        setFeedback('Keep your back straight!');
        stateRef.current.incorrectPosture = true;
      } else if (ankleAngle > THRESHOLDS.ANKLE_THRESH) {
        setFeedback('Knees going too far over toes!');
        stateRef.current.incorrectPosture = true;
      } else if (kneeAngle > THRESHOLDS.KNEE_THRESH[2]) {
        setFeedback('Squat too deep!');
        stateRef.current.incorrectPosture = true;
      }
    }

    stateRef.current.prevState = currentState;
  };

  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        let camera;
        let isComponentMounted = true;
        const currentVideo = videoRef.current;

        const setupPose = async () => {
          try {
            // First request camera permission
            const permissionGranted = await requestCameraPermission();
            if (!permissionGranted) return;


            // Load dependencies only after camera permission is granted
            const [
              tf,
              tfBackend,
              mediapipePose,
              mediapipeCamera,
              mediapipeDrawing
            ] = await Promise.all([
              import('@tensorflow/tfjs-core'),
              import('@tensorflow/tfjs-backend-webgl'),
              import('@mediapipe/pose'),
              import('@mediapipe/camera_utils'),
              import('@mediapipe/drawing_utils')
            ]);

            // Ensure TensorFlow is ready
            await window.tf?.ready();

            // Initialize MediaPipe Pose
            const pose = new window.Pose({
              locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
              }
            });

            pose.setOptions({
              modelComplexity: 1,
              smoothLandmarks: true,
              minDetectionConfidence: 0.5,
              minTrackingConfidence: 0.5
            });

            pose.onResults((results) => {
              if (isComponentMounted) {
                drawPose(results);
                checkSquat(results.poseLandmarks);
              }
            });

            // Initialize camera only if we have permission and MediaPipe Camera is available
            if (window.Camera && hasPermission && currentVideo) {
              camera = new window.Camera(currentVideo, {
                onFrame: async () => {
                  if (currentVideo && isComponentMounted) {
                    await pose.send({ image: currentVideo });
                  }
                },
                width: 640,
                height: 480
              });

              try {
                await camera.start();
                setIsLoading(false);
              } catch (cameraError) {
                console.error('Error starting camera:', cameraError);
                setError('Failed to start camera. Please refresh and try again.');
                setIsLoading(false);
              }
            }
          } catch (error) {
            console.error('Error setting up pose detection:', error);
            setError(`Failed to initialize: ${error.message}`);
            setIsLoading(false);
          }
        };

        const drawPose = (results) => {
          const canvas = canvasRef.current;
          if (!canvas || !results.poseLandmarks) return;

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw landmarks
          for (const landmark of results.poseLandmarks) {
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#00ffff';
            ctx.fill();
          }

          // Draw connecting lines for legs and torso
          const connections = [
            [11, 13, 15], // left arm
            [12, 14, 16], // right arm
            [11, 23, 25, 27], // left leg
            [12, 24, 26, 28], // right leg
            [11, 12], // shoulders
            [23, 24]  // hips
          ];

          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;

          for (const connection of connections) {
            for (let i = 0; i < connection.length - 1; i++) {
              const start = results.poseLandmarks[connection[i]];
              const end = results.poseLandmarks[connection[i + 1]];

              ctx.beginPath();
              ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
              ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
              ctx.stroke();
            }
          }
        };

        if (typeof window !== 'undefined') {
          setupPose();
        }

        return () => {
          isComponentMounted = false;
          if (camera) {
            camera.stop();
          }
          if (currentVideo?.srcObject) {
            const tracks = currentVideo.srcObject.getTracks();
            tracks.forEach(track => track.stop());
          }
        };
      } catch (error) {
        console.error('Failed to load MediaPipe:', error);
      }
    };

    loadMediaPipe();
  }, [hasPermission, isLoading]);

  const getReady = () => {
    setIsLoading(!isLoading);
    setCorrectSquats(0);
    setIncorrectSquats(0);
  }

  useEffect(() => {
    if (correctSquats > 10) {
      window.alert("Your mission success!");
    }
    if (correctSquats + incorrectSquats > 20) {
      window.alert("Your mission failed!");
    }

  }, [correctSquats, incorrectSquats])

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 min-h-screen">
      <div>
        <button onClick={() => getReady()}>Start</button>
      </div>
      <div className="flex gap-8 mb-4">
        <h2 className="text-2xl font-bold text-green-400">
          Correct: {correctSquats}
        </h2>
        <h2 className="text-2xl font-bold text-red-400">
          Incorrect: {incorrectSquats}
        </h2>
      </div>

      {feedback && (
        <h2 className={`text-3xl font-semibold mb-4 ${feedback.includes('Perfect') ? 'text-green-400' : 'text-yellow-400'
          }`}>
          {feedback}
        </h2>
      )}

      {error && (
        <div className="text-red-400 text-xl mb-4">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-xl text-white">Click start button to start your exercise</div>
      ) : (
        <div className="relative w-[640px] h-[480px] transform-gpu">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            playsInline
            muted
            autoPlay
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            width={640}
            height={480}
            style={{
              transform: 'scaleX(-1)',
              zIndex: 1
            }}
          />
        </div>
      )}

      <div className="mt-4 text-gray-300 text-center">
        <p>Stand in front of the camera where your full body is visible.</p>
        <p>Perform squats with proper form to increase your count!</p>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(AdvancedSquatCounter), {
  ssr: false
});