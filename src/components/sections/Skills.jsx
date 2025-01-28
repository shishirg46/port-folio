import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Skills = () => {
  const styles = `
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `;

  const skills = [
    { 
      category: "Frontend",
      items: [
        { name: "React", level: "Advanced" },
        { name: "JavaScript", level: "Expert" },
        { name: "HTML/CSS", level: "Advanced" },
        { name: "Tailwind", level: "Intermediate" }
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: "Intermediate" },
        { name: "Express", level: "Intermediate" },
        { name: "MongoDB", level: "Intermediate" },
        { name: "REST APIs", level: "Intermediate" }
      ]
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <style>{styles}</style>
      
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-0 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-lg mx-auto">
            A curated collection of technologies I work with to build modern web applications
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <Card 
              key={skill.category} 
              className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/50 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
                
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                  {skill.category}
                </h3>
                
                <ul className="space-y-4">
                  {skill.items.map((item) => (
                    <li 
                      key={item.name} 
                      className="flex items-center justify-between group/item hover:bg-purple-50 dark:hover:bg-purple-900/10 p-2 rounded-lg transition-colors duration-200"
                    >
                      <span className="text-lg text-gray-700 dark:text-gray-200 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors duration-200">
                        {item.name}
                      </span>
                      <Badge 
                        variant="outline" 
                        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                      >
                        {item.level}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;