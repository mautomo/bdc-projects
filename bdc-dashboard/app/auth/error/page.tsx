'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircle, Home, LogIn } from 'lucide-react'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
  CredentialsSignin: 'Invalid credentials provided.',
  OAuthAccountNotLinked: 'This email is already associated with another account.',
  OAuthCallback: 'Error in OAuth callback. Please try again.',
  OAuthCreateAccount: 'Could not create OAuth account.',
  EmailCreateAccount: 'Could not create account with this email.',
  Callback: 'Error in OAuth callback.',
  OAuthSignin: 'Error signing in with OAuth provider.',
  EmailSignin: 'Error sending email verification.',
  CredentialsSignUp: 'Error creating account with credentials.',
  SessionRequired: 'You must be signed in to access this page.',
}

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'

  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            We encountered an issue while trying to sign you in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/auth/signin')} 
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/')} 
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          {error === 'AccessDenied' && (
            <div className="text-center text-sm text-muted-foreground">
              <p>If you believe this is an error, please contact your administrator.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}