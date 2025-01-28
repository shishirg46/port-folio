import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import logo from "../../assets/photo.jpeg"
const About = () => {
  const [activeTab, setActiveTab] = useState('story');
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

  const tabs = [
    { id: 'story', label: 'My Story' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' }
  ];

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] },
    { category: 'Tools', items: ['Git', 'VS Code', 'Postman', 'Docker'] }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <style>{styles}</style>
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-0 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4"></div>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/50 shadow-xl">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
              {/* Image container with decorative elements */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-2xl group-hover:blur-3xl opacity-20 transition-all duration-500"></div>
                <div className="relative w-64 h-64 rounded-xl overflow-hidden border-2 border-purple-500/20">
                  <img 
                    src={logo}
                    alt="Shishir Ghimire"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-pink-500 rounded-br-xl"></div>
              </div>

              {/* Content section */}
              <div className="flex-1">
                {/* Tab navigation */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "outline"}
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-full px-6 transition-all duration-300 text-gray-400 ${
                        activeTab === tab.id 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'hover:border-purple-500'
                      }`}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="space-y-6">
                  {activeTab === 'story' && (
                    <div className="space-y-4  dark:text-gray-300">
                      <p className="text-lg leading-relaxed text-gray-400">
                        As a Full Stack Web Developer specializing in MERN stack development, 
                        I bring creativity and technical expertise to every project. My journey 
                        in web development started with a passion for creating seamless user experiences.
                      </p>
                      <p className="text-lg leading-relaxed text-gray-400">
                        I focus on building scalable and efficient web applications that solve 
                        real-world problems. My approach combines clean code practices with 
                        innovative solutions to deliver exceptional results.
                      </p>
                    </div>
                  )}

                  {activeTab === 'skills' && (
                    <div className="grid md:grid-cols-3 gap-6">
                      {skills.map((skill) => (
                        <div key={skill.category} className="space-y-3">
                          <h3 className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                            {skill.category}
                          </h3>
                          <ul className="space-y-2">
                            {skill.items.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-gray-400">
                                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'experience' && (
                    <div className="space-y-6">
                      <div className="border-l-2 border-purple-500 pl-4">
                        <h3 className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                          Web Developer
                        </h3>
                        <p className="text-sm text-gray-500">2024 - Present</p>
                        <p className="mt-2 text-gray-500">
                          Leading development of enterprise web applications using MERN stack.
                        </p>
                      </div>
                      {/* Add more experience items as needed */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default About;