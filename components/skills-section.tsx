"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Database, Wrench } from "lucide-react";

export function SkillsSection() {
  const skillCategories = [
    {
      icon: Code2,
      title: "Languages & Frameworks",
      color: "from-blue-500/20 to-cyan-500/10",
      skills: [
        "Python",
        "Java",
        "C",
        "C#",
        "JavaScript",
        "TypeScript",
        "HTML/CSS",
        "React",
        "Swift",
        "Flask",
        "Next.js",
        "Node/Express",
        "Pandas",
        "BeautifulSoup",
        "Selenium",
        ".NET"
      ]
    },
    {
      icon: Database,
      title: "Databases",
      color: "from-purple-500/20 to-pink-500/10",
      skills: [
        "SQL",
        "MongoDB",
        "Neo4j",
        "PostgreSQL",
        "Firebase"
      ]
    },
    {
      icon: Wrench,
      title: "Tools & Technologies",
      color: "from-green-500/20 to-emerald-500/10",
      skills: [
        "RESTful APIs",
        "Docker",
        "AWS",
        "Git",
        "CI/CD"
      ]
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {skillCategories.map((category, idx) => {
        const Icon = category.icon;
        return (
          <Card 
            key={idx} 
            className="hover-lift relative overflow-hidden glass border-2 border-white/10 hover:border-primary/50 transition-all duration-500 group"
          >
            {/* Background gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${category.color} blur-3xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500`} />
            <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr ${category.color} blur-2xl opacity-30 group-hover:opacity-70 group-hover:scale-125 transition-all duration-700`} />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIdx) => (
                  <Badge 
                    key={skillIdx} 
                    variant="secondary" 
                    className="text-xs hover:bg-primary/20 hover:scale-110 transition-all duration-200 cursor-default"
                    style={{ 
                      animationDelay: `${skillIdx * 50}ms`
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

