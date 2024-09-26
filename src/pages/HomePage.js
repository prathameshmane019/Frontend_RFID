import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, ClipboardCheckIcon, CalendarIcon, ChartBarIcon } from 'lucide-react';

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
    <Icon className="w-12 h-12 text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Student Management System</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in-down">
            Welcome to the Future of Education Management
          </h2>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-up">
            Streamline your educational processes with our comprehensive student management system.
          </p>
          <Link
            to="/login"
            className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 animate-bounce"
          >
            Get Started
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Feature
            icon={UsersIcon}
            title="Student Management"
            description="Efficiently manage student records and information."
          />
          <Feature
            icon={ClipboardCheckIcon}
            title="Attendance Tracking"
            description="Easily record and monitor student attendance."
          />
          <Feature
            icon={CalendarIcon}
            title="Session Planning"
            description="Organize and schedule educational sessions."
          />
          <Feature
            icon={ChartBarIcon}
            title="Performance Analytics"
            description="Generate insightful reports on student performance."
          />
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Your Institution?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of educational institutions already benefiting from our system.
          </p>
          <Link
            to="/contact"
            className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors duration-300 animate-pulse"
          >
            Contact Us
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Student Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;