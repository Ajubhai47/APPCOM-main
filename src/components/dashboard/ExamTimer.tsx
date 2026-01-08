
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  examStarted: boolean;
  startExam: () => void;
  endExam: () => void;
  onTimeUpdate?: (timeString: string) => void;
}

export const ExamTimer = ({ examStarted, startExam, endExam, onTimeUpdate }: ExamTimerProps) => {
  const [examTime] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0
  });

  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let timer: number;

    if (examStarted && timeElapsed < (examTime.hours * 3600 + examTime.minutes * 60 + examTime.seconds)) {
      timer = window.setInterval(() => {
        setTimeElapsed(prevTime => {
          const newTime = prevTime + 1;
          // Provide formatted time string to parent
          if (onTimeUpdate) {
            // Calculate time elapsed (counting up) string
            // Note: The UI displays Time Remaining, but backend expects Time Elapsed.
            // The current component calculates `timeElapsed` (seconds passed).
            const hrs = Math.floor(newTime / 3600);
            const mins = Math.floor((newTime % 3600) / 60);
            const secs = newTime % 60;
            const timeString = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            onTimeUpdate(timeString);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examStarted, timeElapsed, examTime, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTimeInSeconds = examTime.hours * 3600 + examTime.minutes * 60 + examTime.seconds;
  const timeProgress = (timeElapsed / totalTimeInSeconds) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">TIME REMAINING</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold">{formatTime(totalTimeInSeconds - timeElapsed)}</span>
          <Clock size={20} className="text-gray-400" />
        </div>
        <Progress value={timeProgress} className="h-2" />
        <div className="mt-4">
          {!examStarted ? (
            <Button
              onClick={startExam}
              className="w-full bg-ethicproc-700 hover:bg-ethicproc-800"
            >
              Start Exam
            </Button>
          ) : (
            <Button
              onClick={endExam}
              variant="outline"
              className="w-full border-ethicproc-700 text-ethicproc-700"
            >
              End Exam
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
