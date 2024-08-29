import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const Features = () => {
    const { isLoggedIn } = useContext(AuthContext);

  const featuresList = [
    {
      title: 'Real-Time Note Conversion',
      description: 'Convert your voice recordings into text in real-time, allowing you to focus on the conversation while we handle the notes.',
      icon: '📝',
    },
    {
      title: 'Customizable Output',
      description: 'Personalize the format and structure of your notes according to your needs, making them easier to review and understand.',
      icon: '⚙️',
    },
    {
      title: 'Multi-Language Support',
      description: 'Our AI can process recordings in multiple languages, making it accessible for a global audience.',
      icon: '🌍',
    },
    {
      title: 'Secure and Private',
      description: 'We prioritize your privacy. All recordings and notes are encrypted and securely stored.',
      icon: '🔒',
    },
    {
      title: 'Integrations',
      description: 'Easily integrate with popular tools like Google Drive, Dropbox, and more to store and share your notes seamlessly.',
      icon: '🔗',
    },
    {
      title: 'User-Friendly Interface',
      description: 'Enjoy a clean and intuitive interface that makes it easy to navigate and use all features without any learning curve.',
      icon: '💡',
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">Features</h2>
        <p className="text-lg mb-16 text-gray-600 max-w-2xl mx-auto">
          Explore the powerful features of our AI-based note maker, designed to make your life easier and more productive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuresList.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
        {!isLoggedIn ? (
                <Link to={'/signin'}>Login to Get Started</Link>
              ) : (
                <Link
            to="/ainotesmaker"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-full font-semibold text-lg shadow-lg transform transition hover:scale-105"
          >
            Get Started
          </Link>
              )}
        </div>
      </div>
    </section>
  );
};

export default Features;
