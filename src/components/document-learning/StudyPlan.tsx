
import { Calendar, Clock, ExternalLink, Plus } from "lucide-react";

interface StudyPlanProps {
  studyPlan: {day: number, title: string, description: string, isComplete: boolean}[];
  setStudyPlan: (plan: {day: number, title: string, description: string, isComplete: boolean}[]) => void;
  isProcessing: boolean;
}

export default function StudyPlan({ studyPlan, setStudyPlan, isProcessing }: StudyPlanProps) {
  if (isProcessing) {
    return (
      <div className="p-8 text-center">
        <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
        <p className="text-muted-foreground">
          Creating your personalized study plan...
        </p>
      </div>
    );
  }
  
  if (studyPlan.length === 0) {
    return (
      <div className="p-8 text-center">
        <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">
          Upload and process a document to generate a study plan.
        </p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-medium">Your Personalized Study Plan</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Based on the document content, we've created a study plan to help you 
        learn the material efficiently.
      </p>
      
      <div className="space-y-3">
        {studyPlan.map((day, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${day.isComplete ? 'bg-success/10 border-success/30' : 'bg-secondary/30 border-border/50'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="chip">Day {day.day}</span>
                  <h4 className="font-medium">{day.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {day.description}
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={day.isComplete}
                onChange={() => {
                  const newPlan = [...studyPlan];
                  newPlan[index].isComplete = !newPlan[index].isComplete;
                  setStudyPlan(newPlan);
                }}
                className="w-5 h-5 rounded-md border-2"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Estimated time: 30 mins</span>
              </div>
              
              <button className="text-primary flex items-center space-x-1">
                <span>Start learning</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full py-2 border border-dashed border-border/70 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 transition-all flex items-center justify-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Add Custom Study Session</span>
      </button>
    </>
  );
}
