"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  // ログイン状態を確認
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/auth/signin")
      } else {
        fetchFeedbacks(data.session.user.id)
      }
    }
    checkUser()
  }, [router])

  // フィードバックを取得
  const fetchFeedbacks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("feedbacks")
        .select(`
          *,
          responses (*)
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedData = data.map(item => {
        const response = item.responses[0] || null
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          date: new Date(item.created_at).toLocaleDateString("ja-JP"),
          status: item.status,
          isPublic: item.is_public,
          response: response ? response.content : null,
          responseDate: response ? new Date(response.created_at).toLocaleDateString("ja-JP") : null,
        }
      })

      setFeedbacks(formattedData)
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedback =
    activeTab === "all"
      ? feedbacks
      : activeTab === "pending"
      ? feedbacks.filter((item) => item.status === "pending")
      : feedbacks.filter((item) => item.status === "responded")

  if (loading) return <div className="container py-10 text-center">読み込み中...</div>

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">マイダッシュボード</h1>
        <Button asChild>
          <Link href="/submit">新規フィードバックを送信</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="pending">未回答</TabsTrigger>
          <TabsTrigger value="responded">回答済み</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">フィードバックがありません</p>
              </CardContent>
            </Card>
          ) : (
            filteredFeedback.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription>{item.date}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {item.isPublic ? (
                        <Badge variant="outline">公開</Badge>
                      ) : (
                        <Badge variant="outline">非公開</Badge>
                      )}
                      {item.status === "pending" ? (
                        <Badge variant="secondary">未回答</Badge>
                      ) : (
                        <Badge variant="default">回答済み</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{item.content}</p>
                  {item.response && (
                    <div className="bg-muted p-4 rounded-md mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">運営からの回答</h4>
                        <span className="text-sm text-muted-foreground">{item.responseDate}</span>
                      </div>
                      <p>{item.response}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/feedback/${item.id}`}>詳細を見る</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}