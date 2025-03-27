
import React from "react";
import { Mail, Phone, Globe, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MentorshipSection() {
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
        <div className="flex justify-center">
          {/* Featured Mentor Profile */}
          <div className="glass-card p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="src\assets\images\ap.jpg" alt="Mr. Ramesh Kalyan G" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">Mr. Ramesh Kalyan G</h3>
              <p className="text-muted-foreground">Assistant Professor</p>
              <div className="flex items-center gap-1 mt-2 flex-wrap justify-center">
                <Badge variant="outline" className="bg-primary/10 m-1">Learning Specialist</Badge>
                <Badge variant="outline" className="bg-primary/10 m-1">Cognitive Science</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">rameshkalyan@edusence.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">+91 99650 10394</span>
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
        </div>
      </div>
    </section>
  );
}
