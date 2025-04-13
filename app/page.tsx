"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Leaf, MapPin, TruckIcon as TruckFront, Users, Heart, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HeroSlider } from "@/components/hero-slider"
import { StatsCounter } from "@/components/stats-counter"
import { FeatureCard } from "@/components/feature-card"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative">
        <HeroSlider />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 flex items-center justify-center">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter text-white"
            >
              Connecting Surplus Food with Those in Need
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/90 max-w-[800px]"
            >
              FoodBridge helps reduce food waste by connecting donors with NGOs and converting expired food into biogas
              energy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/donate">
                  Donate Food <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                asChild
              >
                <Link href="/collect">
                  Collect Food <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                asChild
              >
                <Link href="/track">
                  Track Donations <MapPin className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatsCounter value={25000} label="Meals Donated" icon="🍲" />
            <StatsCounter value={120} label="NGOs Registered" icon="🏢" />
            <StatsCounter value={500} label="Active Donors" icon="👨‍👩‍👧‍👦" />
            <StatsCounter value={15000} label="Kg Food Waste Converted" icon="♻️" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-50 rounded-full -z-10"></div>
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <Image
                  src="/images/volunteer.png"
                  alt="Volunteers distributing food"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Reducing Food Waste, Feeding Communities
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At FoodBridge, we believe that no good food should go to waste while people go hungry. Our platform
                connects food donors with local NGOs and community organizations to ensure surplus food reaches those
                who need it most.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Fighting Hunger</h3>
                    <p className="text-gray-500">Providing nutritious meals to vulnerable communities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Environmental Impact</h3>
                    <p className="text-gray-500">Reducing food waste and converting unusable food to energy</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Real-time Coordination</h3>
                    <p className="text-gray-500">Efficient logistics to ensure food is delivered while still fresh</p>
                  </div>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/about">
                  Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              A Simple Process for Maximum Impact
            </h2>
            <p className="mt-4 text-gray-500 md:text-xl max-w-[800px]">
              Our platform connects food donors with NGOs and manages the entire process from donation to delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-green-600" />}
              title="Donate & Collect"
              description="Donors can easily list surplus food, while NGOs can browse and claim available donations in their area."
            />
            <FeatureCard
              icon={<TruckFront className="h-10 w-10 text-green-600" />}
              title="Track & Deliver"
              description="Track food pickups in real-time with our integrated map system and efficient delivery routes."
            />
            <FeatureCard
              icon={<Leaf className="h-10 w-10 text-green-600" />}
              title="Convert & Sustain"
              description="Expired food is sent to biogas plants, converting food waste into renewable energy."
            />
          </div>
        </div>
      </section>

      {/* Food Waste Impact Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                The Problem
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Food Waste Has Serious Consequences</h2>
              <p className="text-gray-600 leading-relaxed">
                Globally, one-third of all food produced is wasted. This not only means millions go hungry
                unnecessarily, but also contributes to climate change through methane emissions from landfills.
              </p>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">1.3B</p>
                  <p className="text-sm text-gray-600">Tons of food wasted annually</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">8%</p>
                  <p className="text-sm text-gray-600">Of global greenhouse emissions</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">$1T</p>
                  <p className="text-sm text-gray-600">Economic cost worldwide</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">820M</p>
                  <p className="text-sm text-gray-600">People suffering from hunger</p>
                </div>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
                <Link href="/donate">
                  Help Reduce Waste <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-50 rounded-full -z-10"></div>
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <Image
                  src="/images/food-waste.png"
                  alt="Food waste problem"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              For Every Role
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tailored Experiences</h2>
            <p className="mt-4 text-gray-500 md:text-xl max-w-[800px]">
              FoodBridge offers tailored experiences for different users in the food donation ecosystem.
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="mt-4 text-gray-500 md:text-xl max-w-[800px]">
              Hear from the people and organizations making a difference with FoodBridge.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
              Join Our Community
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 max-w-[800px]">
              Join FoodBridge today and be part of the solution to food waste and hunger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FoodBridge</h3>
              <p className="text-gray-400 mb-4">
                Connecting surplus food with those in need while promoting sustainability.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">For Users</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Donors
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    NGOs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Truck Drivers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Biogas Plants
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Email: info@foodbridge.org
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Phone: +1 (123) 456-7890
                  </Link>
                </li>
                <li>
                  <form className="mt-4">
                    <p className="text-sm mb-2">Subscribe to our newsletter</p>
                    <div className="flex">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500 w-full"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-r-md"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FoodBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
