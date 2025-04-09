"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Restaurant Owner",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "FoodBridge has transformed how we handle excess food. Instead of throwing it away, we can now easily donate it to those in need. The process is seamless and the impact is real.",
  },
  {
    id: 2,
    name: "Helping Hands NGO",
    role: "Food Distribution Organization",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "As an NGO, finding consistent food sources was always a challenge. FoodBridge connects us with quality food donations in our area, allowing us to serve more people with dignity.",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Truck Driver",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "The route optimization feature saves me time and fuel. I can pick up and deliver more donations efficiently, knowing I'm part of something meaningful.",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-10 pb-10">
              <div className="flex flex-col items-center text-center">
                <Quote className="h-12 w-12 text-green-600 mb-6 opacity-50" />
                <p className="text-xl md:text-2xl mb-8 max-w-3xl font-light italic">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex items-center flex-col">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-green-100">
                    <Image
                      src={testimonials[currentIndex].image || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-bold">{testimonials[currentIndex].name}</h4>
                  <p className="text-gray-500">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-8 gap-2">
        <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {testimonials.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 p-0 rounded-full ${index === currentIndex ? "bg-green-600" : "bg-gray-300"}`}
          />
        ))}
        <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

