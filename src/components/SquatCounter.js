import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const SquatCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [squatCount, setSquatCount] = useState(0);
  const [isSquatting, setIsSquatting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let camera;
    let isComponentMounted = true;
    // Capture the current video element reference
    const currentVideo = videoRef.current;
    
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const waitForVideoElement = () => {
      return new Promise((resolve) => {
        const checkVideo = () => {
          if (currentVideo) {
            resolve();
          } else {
            setTimeout(checkVideo, 100);
          }
        };
        checkVideo();
      });
    };

    const setupPose = async () => {
      try {
        await waitForVideoElement();
        
        if (!currentVideo) {
          throw new Error('Video element still not available');
        }

        // Initialize video element
        currentVideo.width = 640;
        currentVideo.height = 480;

        // Load TensorFlow.js
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl');
        
        if (window.tf) {
          await window.tf.ready();
        }

        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!window.Pose) {
          throw new Error('MediaPipe Pose not loaded');
        }

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

        pose.onResults(onResults);

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          
          if (!hasCamera) {
            throw new Error('No camera detected');
          }

          if (window.Camera) {
            camera = new window.Camera(currentVideo, {
              onFrame: async () => {
                if (currentVideo && isComponentMounted) {
                  await pose.send({image: currentVideo});
                }
              },
              width: 640,
              height: 480
            });

            await camera.start();
          } else {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                width: 640, 
                height: 480,
                facingMode: 'user'
              } 
            });

            if (currentVideo && isComponentMounted) {
              currentVideo.srcObject = stream;
              
              await new Promise((resolve) => {
                currentVideo.onloadedmetadata = () => {
                  currentVideo.play().then(resolve);
                };
              });
            }

            const processFrame = async () => {
              if (currentVideo && isComponentMounted) {
                await pose.send({image: currentVideo});
                requestAnimationFrame(processFrame);
              }
            };
            requestAnimationFrame(processFrame);
          }
        } catch (cameraError) {
          throw new Error(`Camera access failed: ${cameraError.message}`);
        }

        if (isComponentMounted) {
          setIsLoading(false);
          setError(null);
        }

      } catch (error) {
        console.error('Error setting up pose detection:', error);
        if (isComponentMounted) {
          setIsLoading(false);
          setError(error.message);
        }
      }
    };

    const onResults = (results) => {
      if (isComponentMounted) {
        drawPose(results);
        checkSquat(results.poseLandmarks);
      }
    };

    const drawPose = (results) => {
      const canvas = canvasRef.current;
      if (!canvas || !results.poseLandmarks) return;

      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const landmark of results.poseLandmarks) {
        const x = landmark.x * canvas.width;
        const y = landmark.y * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'aqua';
        ctx.fill();
      }
      
      ctx.restore();
    };

    const checkSquat = (landmarks) => {
      if (!landmarks) return;

      const leftKnee = landmarks[25];
      const rightKnee = landmarks[26];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      const leftAnkle = landmarks[27];
      const rightAnkle = landmarks[28];

      if (leftKnee && rightKnee && leftHip && rightHip && leftAnkle && rightAnkle) {
        const isCurrentlySquatting = 
          leftKnee.y > leftHip.y && 
          rightKnee.y > rightHip.y &&
          leftKnee.y < leftAnkle.y &&
          rightKnee.y < rightAnkle.y;

        if (isCurrentlySquatting !== isSquatting) {
          setIsSquatting(isCurrentlySquatting);
          if (isCurrentlySquatting) {
            setSquatCount(prev => prev + 1);
            setIsSuccess(true);
          } else {
            setIsSuccess(false);
          }
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
      // Use the captured video reference in cleanup
      if (currentVideo?.srcObject) {
        const tracks = currentVideo.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isSquatting]); // Keep isSquatting in dependencies

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-4">
        Squat Counter: {squatCount}
      </h1>
      
      {isSuccess !== null && (
        <h2 className={`text-xl font-semibold mb-4 ${
          isSuccess ? 'text-green-400' : 'text-red-400'
        }`}>
          {isSuccess ? '🎉 Perfect Squat!' : '⚠️ Check Your Form'}
        </h2>
      )}

      {error && (
        <div className="text-red-400 text-xl mb-4">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-xl text-white">
          Loading pose detection...
        </div>
      ) : (
        <div className="relative w-[640px] h-[480px] rounded-lg overflow-hidden shadow-xl">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ 
              transform: 'scaleX(-1)',
              width: '640px',
              height: '480px'
            }}
            playsInline
            muted
            autoPlay
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width={640}
            height={480}
            style={{ 
              transform: 'scaleX(-1)',
              width: '640px',
              height: '480px'
            }}
          />
        </div>
      )}
      
      <div className="mt-4 text-gray-300 text-center">
        <p>Stand in front of the camera and perform squats.</p>
        <p>Make sure your whole body is visible!</p>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SquatCounter), {
  ssr: false
});