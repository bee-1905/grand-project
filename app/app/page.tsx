"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChefHat, Sparkles, Clock, Users, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagicLinkModal } from "@/components/magic-link-modal"
import { PageTransition } from "@/components/page-transition"
import { useAuth } from "@/contexts/AuthContext"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </PageTransition>
    )
  }

  // Don't render landing page if authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-orange-500" />,
      title: "AI-Powered Generation",
      description: "Our advanced AI creates unique recipes based on your ingredients and preferences.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Time-Based Cooking",
      description: "Get recipes that fit your schedule, from quick 15-minute meals to elaborate dishes.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Perfect Portions",
      description: "Automatically adjust ingredients for any number of servings you need.",
    },
    {
      icon: <Star className="h-8 w-8 text-purple-500" />,
      title: "Personalized Results",
      description: "Recipes tailored to your dietary preferences, skill level, and cuisine choices.",
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-red-50 to-pink-100" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg mb-6">
                  <ChefHat className="h-12 w-12 text-orange-500" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Create Amazing{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                    Recipes
                  </span>
                  <br />
                  in Seconds
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Transform your ingredients into culinary masterpieces with our AI-powered recipe generator. Perfect
                  for any skill level, any time constraint, and any craving.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsModalOpen(true)}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-16 relative"
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="h-32 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
                          alt="Delicious pasta dish"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="h-32 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center"
                          alt="Fresh pancakes with berries"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="h-32 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop&crop=center"
                          alt="Colorful salad bowl"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Recipe Generator?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of cooking with intelligent recipe generation that adapts to your needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-md mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Cooking?</h2>
              <p className="text-xl text-orange-100 mb-8">
                Join thousands of home cooks who have discovered the joy of effortless recipe creation.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        <MagicLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </PageTransition>
  )
}
