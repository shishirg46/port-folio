// src/components/sections/Hero.jsx
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roles = ["Full Stack Developer", "MERN Expert", "UI/UX Enthusiast"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-300 dark:bg-purple-900/20 blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pink-300 dark:bg-pink-900/20 blur-3xl opacity-30 animate-pulse delay-700"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <Card className={`w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/70 dark:bg-gray-900/50 shadow-2xl 
          transform transition-all duration-700 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative p-8 md:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500 -translate-x-4 -translate-y-4"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-pink-500 translate-x-4 translate-y-4"></div>

            <div className="text-center space-y-8">
              {/* Name with gradient and animation */}
              <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent
                transform transition-all duration-500 hover:scale-105">
                Shishir Ghimire
              </h1>

              {/* Animated role text */}
              <div className="h-12"> {/* Fixed height to prevent layout shift */}
                <p className="text-xl md:text-3xl text-gray-600 dark:text-gray-300 transition-all duration-500 ease-in-out">
                  {roles[currentRoleIndex]}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Crafting exceptional digital experiences with modern technologies and creative solutions.
              </p>

              {/* Buttons with enhanced styling */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to='/projects'>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 
                  text-white font-medium px-8 transform hover:scale-105 transition-all duration-300
                  shadow-lg hover:shadow-xl rounded-full"
                  >
                  View Projects
                </Button>
                    </Link>
                    <Link to='contact' >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500 hover:border-pink-500 text-purple-600 hover:text-pink-600
                  font-medium px-8 transform hover:scale-105 transition-all duration-300 rounded-full"
                  >
                  Contact Me
                </Button>
                    </Link>
              </div>

              {/* Social links */}
              <div className="flex justify-center gap-6 mt-8">
  {[
    { platform: 'GitHub', url: 'https://github.com/shishirg46' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/shishir-ghimire-b2b0a32a7/' },
    { platform: 'Facebook', url: 'https://www.facebook.com/ghimire.shishir7' },
  ].map(({ platform, url }) => (
    <a
      key={platform}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400
        transform hover:scale-110 transition-all duration-300"
    >
      {platform}
    </a>
  ))}
</div>

            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Hero;