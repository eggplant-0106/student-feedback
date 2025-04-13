import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface FeedbackItemProps {
  title: string
  content: string
  author: string
  date: string
  response?: string
  responder?: string
  responseDate?: string
}

export function FeedbackItem({ title, content, author, date, response, responder, responseDate }: FeedbackItemProps) {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{author}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p>{content}</p>
      </CardContent>
      {response && (
        <>
          <Separator className="mx-4" />
          <CardFooter className="flex flex-col items-start pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">運営からの回答</span>
              <span>{responder}</span>
              <span>•</span>
              <span className="text-muted-foreground">{responseDate}</span>
            </div>
            <p className="mt-2 text-sm">{response}</p>
          </CardFooter>
        </>
      )}
    </Card>
  )
}