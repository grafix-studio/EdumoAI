
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

interface EmotionChartsProps {
  emotionHistory: {
    emotion: string;
    timestamp: number;
    score: number;
  }[];
}

export default function EmotionCharts({ emotionHistory }: EmotionChartsProps) {
  const [activeTab, setActiveTab] = useState<string>("trends");

  return (
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
  );
}
