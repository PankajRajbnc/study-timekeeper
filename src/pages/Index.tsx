import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

const Index = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState<Array<{
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
  }>>([]);
  const { toast } = useToast();

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    toast({
      title: "Timer Started",
      description: "Your study session has begun!",
    });
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
      const newSession = {
        id: Date.now().toString(),
        startTime: new Date(Date.now() - time * 1000).toLocaleString(),
        endTime: new Date().toLocaleString(),
        duration: time,
      };
      setSessions((prevSessions) => [...prevSessions, newSession]);
      toast({
        title: "Session Saved",
        description: `Study session of ${formatTime(time)} recorded`,
      });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    toast({
      title: "Timer Reset",
      description: "Timer has been reset to 00:00:00",
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prevSessions) => prevSessions.filter(session => session.id !== sessionId));
    toast({
      title: "Session Deleted",
      description: "Study session has been removed",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-8xl font-mono mb-8">{formatTime(time)}</div>
      
      <div className="space-x-4 mb-12">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            className="bg-white text-black hover:bg-gray-200"
          >
            Start
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            className="bg-white text-black hover:bg-gray-200"
          >
            Pause
          </Button>
        )}
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-black"
        >
          Reset
        </Button>
      </div>

      {sessions.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl mb-4">Study Sessions</h2>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/10 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="text-sm text-gray-400">
                    {session.startTime} - {session.endTime}
                  </div>
                  <div className="text-lg">
                    Duration: {formatTime(session.duration)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSession(session.id)}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;