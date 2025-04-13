"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackItem } from "@/components/feedback-item"
import { supabase } from "@/lib/supabase"

export default function FeedbackPage() {
  const [publicFeedbacks, setPublicFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicFeedbacks()
  }, [])

  // 公開フィードバックを取得
  const fetchPublicFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`
          *,
          users (name),
          responses (*)
        `)
        .eq('is_public', true)
        .eq('status', 'responded')
        .order('created_at', { ascending: false })

      if (error) throw error

      // 公開設定の回答のみをフィルタリング
      const publicItems = data.filter(item => 
        item.responses.length > 0 && item.responses[0].is_public
      )

      // データを整形
      const formattedData = publicItems.map(item => {
        const response = item.responses[0]
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          author: item.users.name,
          date: new Date(item.created_at).toLocaleDateString('ja-JP'),
          response: response.content,
          responder: "運営チーム",
          responseDate: new Date(response.created_at).toLocaleDateString('ja-JP'),
        }
      })

      setPublicFeedbacks(formattedData)
    } catch (error) {
      console.error("Error fetching public feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container py-10 text-center">読み込み中...</div>

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">公開フィードボード</h1>
          <p className="text-muted-foreground">団体メンバーから寄せられた意見と運営からの回答を公開しています</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>フィードボードについて</CardTitle>
            <CardDescription>
              このページでは、団体の改善のために寄せられた意見と、それに対する運営からの回答を公開しています。
              個人情報保護の観点から、投稿者の許可を得た内容のみを掲載しています。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              あなたも意見を投稿したい場合は、ログイン後に「意見を投稿する」ボタンからフォームにアクセスしてください。
              投稿された意見は運営チームが確認し、適切な回答を提供します。
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {publicFeedbacks.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">公開されているフィードバックはありません</p>
              </CardContent>
            </Card>
          ) : (
            publicFeedbacks.map((item) => (
              <FeedbackItem
                key={item.id}
                title={item.title}
                content={item.content}
                author={item.author}
                date={item.date}
                response={item.response}
                responder={item.responder}
                responseDate={item.responseDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}