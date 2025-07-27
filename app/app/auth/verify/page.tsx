"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { authService } from '@/services/auth-service'
import { useAuth } from '@/contexts/AuthContext'
import { PageTransition } from '@/components/page-transition'

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('No verification token provided')
        return
      }

      try {
        const result = await authService.verifyMagicLink(token)
        
        if (result.success && result.user && result.token) {
          login(result.user, result.token)
          setStatus('success')
          setMessage('Successfully verified! Redirecting to dashboard...')
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Verification failed. Please try again.')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('Invalid or expired magic link. Please request a new one.')
      }
    }

    verifyToken()
  }, [searchParams, login, router])

  const handleRetry = () => {
    router.push('/')
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            {status === 'loading' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <Loader2 className="h-16 w-16 text-orange-500 mx-auto animate-spin" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Verifying Magic Link</h1>
                <p className="text-gray-600">Please wait while we verify your magic link...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Successful!</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                
                <motion.div
                  className="w-full bg-gray-200 rounded-full h-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                </motion.div>
              </>
            )}

            {status === 'error' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Try Again
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
export const dynamic = 'force-dynamic'
