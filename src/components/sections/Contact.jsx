import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import emailjs from 'emailjs-com'; // Import emailjs

const Contact = () => {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send the form data to email using EmailJS
    emailjs.send('service_i4mz7ic', 'template_dso565l', formData, 'z1W5oUK1RGzAfCF5r')
      .then(
        (response) => {
          console.log('Message sent successfully', response);
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 3000);
          setFormData({ name: '', email: '', message: '' }); // Clear the form fields after submission
        },
        (error) => {
          console.error('Failed to send message', error);
        }
      );
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <style>{styles}</style>
      
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-0 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-2xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block">
            Get in Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-lg mx-auto">
            Have a project in mind? Let's create something amazing together
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/50 shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-32 -mt-32"></div>
          
          {isSubmitted && (
            <Alert className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
              <AlertDescription>
                Thank you for your message! I'll get back to you soon.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800 focus:ring-purple-500 focus:border-purple-500"
                required 
              />
            </div>

            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={5}
                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
