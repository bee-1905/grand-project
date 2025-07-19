"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Clock, Users, Sparkles, ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import EmailAuthModal from "@/components/EmailAuthModal";
import { useState } from "react";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                Create Amazing{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                  Recipes
                </span>{" "}
                with AI
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Transform your ingredients into culinary masterpieces. Our AI-powered recipe generator creates
                personalized recipes based on what you have in your kitchen.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 opacity-20">
            <ChefHat className="h-16 w-16 text-orange-500" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-20">
            <Sparkles className="h-12 w-12 text-red-500" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Recipe Generator?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the perfect blend of technology and culinary expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <ChefHat className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>AI-Powered Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our advanced AI analyzes your ingredients and preferences to create unique, delicious recipes
                    tailored just for you.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Quick & Easy</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Generate recipes in seconds. Simply input your ingredients, cooking time, and serving size to get
                    instant results.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Personalized</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Every recipe is customized to your specific needs, dietary preferences, and available cooking time.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Start Cooking?</h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of home cooks who are already creating amazing meals with our AI recipe generator.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Start Generating Recipes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
      <EmailAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </PageTransition>
  );
}