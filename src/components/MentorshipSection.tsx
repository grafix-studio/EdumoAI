
import React from "react";
import { Calendar, Mail, Phone, Clock, MessageCircle, Video, FileText, Globe, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MentorshipSection() {
  const availabilitySlots = [
    { day: "Monday", time: "3:00 PM - 5:00 PM" },
    { day: "Wednesday", time: "1:00 PM - 3:00 PM" },
    { day: "Friday", time: "9:00 AM - 11:00 AM" }
  ];

  return (
    <section id="mentorship" className="section">
      <div className="section-header">
        <span className="chip mb-2">Expert Guidance</span>
        <h1 className="text-balance">Realtime Consulting & Mentorship</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Connect with experienced mentors who provide personalized guidance
          to help you achieve your learning and professional goals.
        </p>
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Mentor Profile */}
          <div className="glass-card p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dr. Sarah Chen" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">Dr. Sarah Chen</h3>
              <p className="text-muted-foreground">Educational Psychology Ph.D.</p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="bg-primary/10">Learning Specialist</Badge>
                <Badge variant="outline" className="bg-primary/10">Cognitive Science</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">sarah.chen@edusense.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">www.sarahchen.edu</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-3">
              <Button variant="outline" size="icon">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mentorship Details */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">About Dr. Sarah</h3>
              <p className="text-muted-foreground">
                Dr. Sarah Chen specializes in optimizing learning strategies based on cognitive science. 
                With over 10 years of experience, she has helped thousands of students develop personalized 
                learning plans that work with their unique cognitive profiles. Her research focuses on 
                emotion-aware learning techniques and adaptive educational technologies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consultation Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <MessageCircle className="w-5 h-5 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Chat Session</p>
                        <p className="text-sm text-muted-foreground">30-minute text-based consultation</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Video className="w-5 h-5 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Video Call</p>
                        <p className="text-sm text-muted-foreground">45-minute personalized video session</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <FileText className="w-5 h-5 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Learning Plan Review</p>
                        <p className="text-sm text-muted-foreground">Detailed feedback on your study approach</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availabilitySlots.map((slot, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{slot.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{slot.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule a Consultation</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button>Chat Session</Button>
                <Button>Video Call</Button>
                <Button>Learning Plan</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
