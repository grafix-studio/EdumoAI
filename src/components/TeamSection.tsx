import React from "react";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Gurubalaji M",
      role: "Team Lead & Developer",
      image: "src/assets/images/gurubalaji.jpg",
      email: "gurubalaji@EdumoAi.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Dhaanya Shree V",
      role: "UX/UI Designer",
      image: "src/assets/images/dhanya.jpg",
      email: "dhaanya@EdumoAi.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Hema Kumar RA",
      role: "Frontend developer",
      image: "src/assets/images/hemaimg.jpg",
      email: "hemakumar@EdumoAi.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Dharsan Sakthivel D",
      role: "Technical Specialist & Business Analystt",
      image: "src/assets/images/dharshan.jpg",
      email: "dharsan@EdumoAi.ai",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
  ];

  return (
    <section id="team" className="section">
      <div className="section-header">
        <span className="chip mb-2">Our Team</span>
        <h1 className="text-balance">Meet The Team</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Our diverse team of experts is committed to revolutionizing education
          through AI-powered learning solutions.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {member.role}
              </p>

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
