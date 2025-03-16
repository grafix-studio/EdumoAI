
import { useState, useRef, useEffect } from "react";
import { Camera, Mic, AlertCircle, X, Play, Info, Smile, Frown, Meh, Heart, HeartCrack, AlertTriangle, Brain, BookOpen, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function EmotionDetectionSection() {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<{emotion: string, timestamp: number, score: number}[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [stressLevel, setStressLevel] = useState<number>(0);
  const [engagementLevel, setEngagementLevel] = useState<number>(0);
  const [focusLevel, setFocusLevel] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("trends");

  // Face detection interval ref
  const faceDetectionIntervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      // Clear previous stream if it exists
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      console.log("Camera permission granted, setting up video stream");
      setCameraPermission(true);
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => console.log("Video playback started"))
            .catch(err => console.error("Error playing video:", err));
        };
      }
      
      return true;
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermission(false);
      toast.error("Camera access denied. Please enable camera permissions and try again.");
      return false;
    }
  };

  // Request microphone permission
  const requestMicPermission = async () => {
    try {
      console.log("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
      setMicPermission(true);
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMicPermission(false);
      toast.error("Microphone access denied. Please enable microphone permissions and try again.");
      return false;
    }
  };

  // Process frames to detect emotions (in a real app, would use actual ML model)
  const processVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isAnalyzing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Draw the current video frame onto the canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // In a real implementation, you would now pass this frame to an emotion detection API
    // For this demo, we'll simulate by detecting random emotions with weighted probabilities
    const emotions = ["happy", "neutral", "sad", "confused", "stressed", "focused"];
    const weights = [0.25, 0.2, 0.15, 0.15, 0.15, 0.1]; // Higher probability for happy/neutral
    
    // Weighted random selection
    let random = Math.random();
    let emotionIndex = 0;
    let cumulativeWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (random < cumulativeWeight) {
        emotionIndex = i;
        break;
      }
    }
    
    const detectedEmotion = emotions[emotionIndex];
    const confidenceScore = 0.5 + Math.random() * 0.5; // Random score between 0.5 and 1.0
    
    // Update state with the detected emotion
    if (detectedEmotion !== currentEmotion) {
      setCurrentEmotion(detectedEmotion);
      
      // Update emotion history
      setEmotionHistory(prev => [...prev, {
        emotion: detectedEmotion,
        timestamp: Date.now(),
        score: confidenceScore
      }].slice(-12)); // Keep last 12 emotions
      
      // Update stress level based on emotion (in a real app, would come from ML model)
      if (detectedEmotion === "stressed") {
        setStressLevel(75 + Math.floor(Math.random() * 25));
      } else if (detectedEmotion === "confused") {
        setStressLevel(50 + Math.floor(Math.random() * 25));
      } else if (detectedEmotion === "sad") {
        setStressLevel(40 + Math.floor(Math.random() * 30));
      } else if (detectedEmotion === "neutral") {
        setStressLevel(20 + Math.floor(Math.random() * 20));
      } else if (detectedEmotion === "focused") {
        setStressLevel(10 + Math.floor(Math.random() * 15));
      } else {
        setStressLevel(5 + Math.floor(Math.random() * 10));
      }
      
      // Update engagement level
      if (detectedEmotion === "focused" || detectedEmotion === "happy") {
        setEngagementLevel(80 + Math.floor(Math.random() * 20));
      } else if (detectedEmotion === "neutral") {
        setEngagementLevel(50 + Math.floor(Math.random() * 30));
      } else {
        setEngagementLevel(30 + Math.floor(Math.random() * 40));
      }
      
      // Update focus level
      if (detectedEmotion === "focused") {
        setFocusLevel(85 + Math.floor(Math.random() * 15));
      } else if (detectedEmotion === "happy") {
        setFocusLevel(70 + Math.floor(Math.random() * 20));
      } else if (detectedEmotion === "neutral") {
        setFocusLevel(50 + Math.floor(Math.random() * 20));
      } else {
        setFocusLevel(20 + Math.floor(Math.random() * 30));
      }
    }
  };

  // Start emotion analysis
  const startAnalysis = async () => {
    console.log("Starting analysis...");
    const hasCamera = cameraPermission || await requestCameraPermission();
    const hasMic = micPermission || await requestMicPermission();
    
    if (hasCamera && hasMic) {
      setIsAnalyzing(true);
      toast.success("Emotion detection started");
      
      // Initialize the first emotion if not set
      if (!currentEmotion) {
        setCurrentEmotion("neutral");
        setEmotionHistory([{
          emotion: "neutral", 
          timestamp: Date.now(),
          score: 0.8
        }]);
        setStressLevel(25);
        setEngagementLevel(60);
        setFocusLevel(55);
      }
      
      // Set up frame processing interval (30fps)
      if (faceDetectionIntervalRef.current === null) {
        faceDetectionIntervalRef.current = window.setInterval(processVideoFrame, 1000 / 30);
      }
    } else {
      toast.error("Both camera and microphone access are required for emotion detection");
    }
  };

  // Stop emotion analysis
  const stopAnalysis = () => {
    console.log("Stopping analysis...");
    setIsAnalyzing(false);
    
    // Clear the detection interval
    if (faceDetectionIntervalRef.current !== null) {
      clearInterval(faceDetectionIntervalRef.current);
      faceDetectionIntervalRef.current = null;
    }
    
    // Stop all tracks from the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    toast.info("Emotion detection stopped");
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (faceDetectionIntervalRef.current !== null) {
        clearInterval(faceDetectionIntervalRef.current);
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Get emotion recommendation
  const getEmotionRecommendation = () => {
    if (!currentEmotion) return null;
    
    switch (currentEmotion) {
      case "happy":
        return "Great mood detected! This is an optimal time for challenging material.";
      case "focused":
        return "You're in a focused state. Perfect for deep learning and complex topics.";
      case "confused":
        return "You seem a bit confused. Consider reviewing fundamentals or asking for clarification.";
      case "stressed":
        return "Stress detected. Try taking a short break or some deep breathing exercises.";
      case "sad":
        return "You seem a bit down. Consider a short break or switching to a more engaging topic.";
      default:
        return "Maintaining steady engagement. Continue your learning session.";
    }
  };

  // Get specific learning content recommendations based on emotion
  const getLearningContentRecommendations = () => {
    if (!currentEmotion) return [];
    
    switch (currentEmotion) {
      case "happy":
        return [
          { title: "Advanced Problem Solving", description: "Challenge yourself with complex problems that require critical thinking" },
          { title: "Project-Based Learning", description: "Work on creative projects that apply multiple concepts" },
          { title: "Peer Teaching", description: "Explain concepts to others to reinforce your understanding" }
        ];
      case "focused":
        return [
          { title: "Deep Dive Sessions", description: "Extended focus on a single complex topic" },
          { title: "Analytical Reading", description: "Critical analysis of challenging texts or research papers" },
          { title: "Technical Skill Building", description: "Practice specialized skills that require precision" }
        ];
      case "confused":
        return [
          { title: "Concept Mapping", description: "Create visual representations of relationships between concepts" },
          { title: "Simplified Tutorials", description: "Step-by-step guides covering fundamentals" },
          { title: "Interactive Demonstrations", description: "Watch visual explanations with examples" }
        ];
      case "stressed":
        return [
          { title: "Microlearning", description: "Short, focused lessons on one concept at a time" },
          { title: "Guided Practice", description: "Structured exercises with immediate feedback" },
          { title: "Review Sessions", description: "Revisit familiar material to build confidence" }
        ];
      case "sad":
        return [
          { title: "Engaging Multimedia", description: "Video-based learning with interactive elements" },
          { title: "Social Learning", description: "Collaborative activities with peers" },
          { title: "Interest-Driven Topics", description: "Focus on subjects you're personally interested in" }
        ];
      default:
        return [
          { title: "Balanced Learning Mix", description: "Alternate between reading, practice, and application" },
          { title: "Spaced Repetition", description: "Review material at optimal intervals" },
          { title: "Self-Assessment", description: "Regular quizzes to identify knowledge gaps" }
        ];
    }
  };

  // Get stress relief recommendations
  const getStressReliefRecommendations = () => {
    if (stressLevel < 30) return [];
    
    const baseRecommendations = [
      { title: "Deep Breathing", description: "Take 5 deep breaths, inhaling for 4 counts and exhaling for 6 counts" },
      { title: "Quick Stretch", description: "Stand up and stretch your arms, shoulders and neck for 30 seconds" },
      { title: "Mindful Minute", description: "Close your eyes and focus on your breathing for just one minute" }
    ];
    
    if (stressLevel >= 70) {
      return [
        ...baseRecommendations,
        { title: "Progressive Relaxation", description: "Tense and relax each muscle group from your toes to your head" },
        { title: "Guided Meditation", description: "Follow a short 5-minute guided meditation" },
        { title: "Change of Environment", description: "Take a 10-minute break in a different location" }
      ];
    } else if (stressLevel >= 50) {
      return [
        ...baseRecommendations,
        { title: "Positive Visualization", description: "Spend a moment imagining a peaceful, calming scene" },
        { title: "Gratitude Practice", description: "Quickly note three things you're grateful for right now" }
      ];
    }
    
    return baseRecommendations;
  };

  // Get emotion color
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "bg-success/20 text-success border-success/30";
      case "focused":
        return "bg-primary/20 text-primary border-primary/30";
      case "confused":
        return "bg-warning/20 text-warning border-warning/30";
      case "stressed":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "sad":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <section id="home" className="section">
      <div className="section-header">
        <span className="chip mb-2">AI-Powered</span>
        <h1 className="text-balance">Real-time Emotion Detection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Our advanced AI analyzes your facial expressions and voice to understand your emotional state,
          helping optimize your learning experience.
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Feed & Controls */}
          <div className="glass-card p-6 flex flex-col">
            <div className="relative aspect-video bg-black/10 dark:bg-white/5 rounded-lg overflow-hidden mb-4">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              <canvas 
                ref={canvasRef} 
                className="hidden" 
                width="640" 
                height="480"
              />
              {!isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  cameraPermission === true ? "bg-success" : 
                  cameraPermission === false ? "bg-destructive" : "bg-muted"
                }`} />
                <span className="text-sm font-medium">Camera</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  micPermission === true ? "bg-success" : 
                  micPermission === false ? "bg-destructive" : "bg-muted"
                }`} />
                <span className="text-sm font-medium">Microphone</span>
              </div>
            </div>
            
            <div className="mt-auto flex justify-center">
              {!isAnalyzing ? (
                <Button 
                  variant="default"
                  onClick={startAnalysis}
                  className="flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Detection</span>
                </Button>
              ) : (
                <Button 
                  variant="secondary"
                  onClick={stopAnalysis}
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Stop Detection</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Emotion Analysis</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="w-5 h-5" />
              </Button>
            </div>
            
            {showInfo && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>How it works</AlertTitle>
                <AlertDescription>
                  Our AI analyzes facial micro-expressions and voice patterns to detect emotions.
                  This helps provide personalized learning recommendations based on your current
                  emotional state.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Current Emotional State */}
            <div className="grid gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {currentEmotion ? (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getEmotionColor(currentEmotion)}`}>
                        {currentEmotion === "happy" && <Smile className="w-4 h-4" />}
                        {currentEmotion === "sad" && <Frown className="w-4 h-4" />}
                        {currentEmotion === "neutral" && <Meh className="w-4 h-4" />}
                        {currentEmotion === "focused" && <Brain className="w-4 h-4" />}
                        {currentEmotion === "confused" && <AlertTriangle className="w-4 h-4" />}
                        {currentEmotion === "stressed" && <HeartCrack className="w-4 h-4" />}
                        {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">Not analyzing</div>
                    )}
                    
                    <div className="grid gap-2">
                      <div className="flex justify-between text-sm">
                        <span>Stress Level</span>
                        <span>{stressLevel}%</span>
                      </div>
                      <Progress value={stressLevel} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Engagement</span>
                        <span>{engagementLevel}%</span>
                      </div>
                      <Progress value={engagementLevel} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Focus</span>
                        <span>{focusLevel}%</span>
                      </div>
                      <Progress value={focusLevel} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommendations based on emotional state */}
              {currentEmotion && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                    <CardDescription>{getEmotionRecommendation()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="learning" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="learning">Learning Content</TabsTrigger>
                        <TabsTrigger value="stress">Stress Relief</TabsTrigger>
                      </TabsList>
                      <TabsContent value="learning" className="mt-4">
                        <div className="grid gap-3">
                          {getLearningContentRecommendations().map((rec, i) => (
                            <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-secondary/20">
                              <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium">{rec.title}</h4>
                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="stress" className="mt-4">
                        <div className="grid gap-3">
                          {getStressReliefRecommendations().map((rec, i) => (
                            <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-secondary/20">
                              <Heart className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium">{rec.title}</h4>
                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        {/* Emotion History Visualization */}
        <div className="glass-card mt-8 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Emotion History & Trends</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="trends">Emotion Trends</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends" className="mt-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emotionHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{payload[0].payload.emotion}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">Score</span>
                                    <span className="text-xs text-muted-foreground">
                                      {(payload[0].payload.score * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Confidence"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="distribution" className="mt-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          emotionHistory.reduce((acc, { emotion }) => {
                            acc[emotion] = (acc[emotion] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([emotion, count]) => ({
                          name: emotion,
                          value: count
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {emotionHistory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${index * 45}, 70%, 50%)`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {payload[0].name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Count: {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </div>
    </section>
  );
}
