
import React from "react";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "alex@edusense.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Maya Rodriguez",
      role: "UX/UI Designer",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      email: "maya@edusense.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "David Kim",
      role: "AI Specialist",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      email: "david@edusense.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Priya Patel",
      role: "Educational Content",
      image: "https://randomuser.me/api/portraits/women/66.jpg",
      email: "priya@edusense.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    }
  ];

  return (
    <section id="team" className="section">
      <div className="section-header">
        <span className="chip mb-2">Our Team</span>
        <h1 className="text-balance">Meet The Team</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Our diverse team of experts is committed to revolutionizing education through
          AI-powered learning solutions.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
              
              <div className="flex items-center justify-center gap-1 mb-4">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs">{member.email}</span>
              </div>
              
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="icon" className="w-8 h-8">
                  <Linkedin className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="icon" className="w-8 h-8">
                  <Twitter className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="icon" className="w-8 h-8">
                  <Github className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
