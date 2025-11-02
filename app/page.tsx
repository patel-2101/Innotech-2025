'use client';

import Link from 'next/link';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Shield, 
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-linear-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl">
                <FileText className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
              Smart Complaint
              <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Empowering citizens to report issues and track their resolution in real-time
            </p>

            {/* CTA Button */}
            <Link 
              href="/signup"
              className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              About This Application
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">File Complaints</h3>
              <p className="text-gray-600">
                Citizens can easily file complaints with photos, videos, and detailed descriptions. Track status in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-linear-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Assign Workers</h3>
              <p className="text-gray-600">
                Officers can assign complaints to workers, set priorities, and monitor progress throughout the resolution process.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-linear-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Resolution</h3>
              <p className="text-gray-600">
                Workers upload proof of completion. Citizens receive updates and can verify that their issues are resolved.
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-4">How It Works</h3>
              <p className="text-lg opacity-90 mb-8">
                Our platform connects citizens with municipal authorities through a transparent, 
                efficient complaint management system. From filing to resolution, every step is tracked 
                and documented with AI-powered categorization and real-time notifications.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  ✓ AI-Powered Categorization
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  ✓ Real-time Tracking
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  ✓ Photo/Video Evidence
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  ✓ Transparent Process
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Panels Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Login as
            </h2>
            <p className="text-xl text-gray-600">
              Choose your role to access the dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Citizen Login */}
            <Link href="/login/citizen">
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-blue-500">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Citizen</h3>
                <p className="text-gray-600 mb-6">File and track your complaints</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Login <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            {/* Officer Login */}
            <Link href="/login/officer">
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-purple-500">
                <div className="bg-linear-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Officer</h3>
                <p className="text-gray-600 mb-6">Manage and assign complaints</p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                  Login <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            {/* Worker Login */}
            <Link href="/login/worker">
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500">
                <div className="bg-linear-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Worker</h3>
                <p className="text-gray-600 mb-6">Complete assigned tasks</p>
                <div className="flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                  Login <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            {/* Admin Login */}
            <Link href="/login/admin">
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-orange-500">
                <div className="bg-linear-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin</h3>
                <p className="text-gray-600 mb-6">System administration</p>
                <div className="flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                  Login <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Left - Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Smart Complaint System</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Bridging the gap between citizens and municipal authorities for a better tomorrow.
              </p>
              <div className="flex gap-3">
                <Mail className="w-5 h-5" />
                <span className="text-sm">support@smartcomplaint.com</span>
              </div>
              <div className="flex gap-3 mt-2">
                <Phone className="w-5 h-5" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
            </div>

            {/* Center - Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-blue-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-blue-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-blue-400 transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right - Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full hover:bg-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-400">
                  Subscribe to our newsletter for updates
                </p>
                <div className="mt-3 flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button className="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Smart Complaint System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
