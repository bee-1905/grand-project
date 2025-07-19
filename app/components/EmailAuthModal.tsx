"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

interface EmailAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthState = "input" | "sending" | "sent";

export default function EmailAuthModal({ isOpen, onClose }: EmailAuthModalProps) {
  const [email, setEmail] = useState("");
  const [authState, setAuthState] = useState<AuthState>("input");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSend = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setAuthState("sending");
    setError(null);

    try {
      await authService.sendMagicLink(email);
      setAuthState("sent");
    } catch (err) {
      setAuthState("input");
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClose = () => {
    setEmail("");
    setAuthState("input");
    setError(null);
    onClose();
  };

  // Handle magic link verification on redirect
  const handleVerifyToken = async (token: string) => {
    try {
      const { token: jwtToken } = await authService.verifyToken(token);
      authService.setToken(jwtToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Token verification failed");
      setAuthState("input");
    }
  };

  // Check for token in URL on component mount
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token && authState === "input") {
      handleVerifyToken(token);
    }
  }

  const isEmailValid = email.trim() && isValidEmail(email);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-orange-500" />
            Sign in to continue
          </DialogTitle>
          <DialogDescription>Enter your email address to receive a secure login link</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {authState === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isEmailValid) {
                        handleSend();
                      }
                    }}
                    className="w-full"
                  />
                  {(error || (email && !isValidEmail(email))) && (
                    <p className="text-sm text-red-500 mt-1">
                      {error || "Please enter a valid email address"}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!isEmailValid}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </motion.div>
            )}

            {authState === "sending" && (
              <motion.div
                key="sending"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sending login link...</h3>
                <p className="text-gray-600">Please wait while we prepare your secure login link</p>
              </motion.div>
            )}

            {authState === "sent" && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Check className="h-8 w-8 text-green-600" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-semibold text-gray-900 mb-2"
                >
                  Login link sent!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-4"
                >
                  A login link has been sent to <span className="font-medium text-gray-900">{email}</span>
                  <br />
                  Please click it to proceed.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}