import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ResourceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

export function ResourceCard({ title, description, icon, href, color }: ResourceCardProps) {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={cn("absolute top-0 left-0 w-full h-1", color)} />
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-lg text-white", color)}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>
            Access {title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}