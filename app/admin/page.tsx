"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("pending")
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState("")
  const [makePublic, setMakePublic] = useState(true)
  const [respondingTo, setRespondingTo] = useState(null)
  const [user, setUser] = useState(null)

  // ログイン状態と管理者権限を確認
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/auth/signin")
        return
      }

      // ユーザー情報を取得して管理者かどうか確認
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single()

      if (error || !userData || userData.role !== 'admin') {
        alert("管理者権限がありません")
        router.push("/")
        return
      }

      setUser(data.session.user)
      fetchFeedbacks()
    }
    checkAdmin()
  }, [router])

  // すべてのフィードバックを取得
  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`
          *,
          users (name, email),
          responses (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // データを整形
      const formattedData = data.map(item => {
        const response = item.responses[0] || null
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          author: item.users.name,
          email: item.users.email,
          date: new Date(item.created_at).toLocaleDateString('ja-JP'),
          status: item.status,
          isPublic: item.is_public,
          response: response ? response.content : null,
          responseDate: response ? new Date(response.created_at).toLocaleDateString('ja-JP') : null,
        }
      })

      setFeedbacks(formattedData)
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems =
    activeTab === "all"
      ? feedbacks
      : activeTab === "pending"
        ? feedbacks.filter((item) => item.status === "pending")
        : feedbacks.filter((item) => item.status === "responded")

  const handleRespond = (id) => {
    setRespondingTo(id)
    const item = feedbacks.find((item) => item.id === id)
    if (item) {
      setMakePublic(item.isPublic)
    }
  }

  const handleSubmitResponse = async (id) => {
    if (!responseText.trim()) {
      alert("回答を入力してください")
      return
    }

    try {
      // 回答を保存
      const { error: responseError } = await supabase
        .from('responses')
        .insert([
          {
            content: responseText,
            is_public: makePublic,
            feedback_id: id,
            responder: user.email,
          }
        ])

      if (responseError) throw responseError

      // フィードバックのステータスを更新
      const { error: updateError } = await supabase
        .from('feedbacks')
        .update({ status: 'responded' })
        .eq('id', id)

      if (updateError) throw updateError

      // メール通知を送信
      const feedbackItem = feedbacks.find(item => item.id === id)
      if (feedbackItem) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: feedbackItem.email,
            subject: `「${feedbackItem.title}」に回答がありました`,
            text: `あなたのフィードバック「${feedbackItem.title}」に回答がありました。\n\n回答内容：\n${responseText}\n\n詳細はダッシュボードでご確認ください。`,
            html: `
              <p>あなたのフィードバック「${feedbackItem.title}」に回答がありました。</p>
              <p>回答内容：</p>
              <p>${responseText}</p>
              <p>詳細はダッシュボードでご確認ください。</p>
              <a href="${window.location.origin}/dashboard">ダッシュボードを開く</a>
            `
          }),
        })
      }

      alert("回答を送信しました")
      fetchFeedbacks()
      setRespondingTo(null)
      setResponseText("")
    } catch (error) {
      console.error("Error submitting response:", error)
      alert("回答の送信中にエラーが発生しました")
    }
  }

  const handleCancelResponse = () => {
    setRespondingTo(null)
    setResponseText("")
  }

  if (loading) return <div className="container py-10 text-center">読み込み中...</div>

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
        <Badge variant="outline" className="text-base px-4 py-2">
          未回答: {feedbacks.filter((item) => item.status === "pending").length}件
        </Badge>
      </div>

      <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="pending">未回答</TabsTrigger>
          <TabsTrigger value="responded">回答済み</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">フィードバックがありません</p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription>
                        {item.author} ({item.email}) • {item.date}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {item.isPublic ? <Badge variant="outline">公開</Badge> : <Badge variant="outline">非公開</Badge>}
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

                  {respondingTo === item.id && (
                    <div className="mt-4 space-y-4">
                      <Textarea
                        placeholder="回答を入力してください"
                        className="min-h-[100px]"
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      />
                      <div className="flex items-center space-x-2">
                        <Switch id={`public-${item.id}`} checked={makePublic} onCheckedChange={setMakePublic} />
                        <Label htmlFor={`public-${item.id}`}>この回答を公開する</Label>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {respondingTo === item.id ? (
                    <>
                      <Button variant="outline" onClick={handleCancelResponse}>
                        キャンセル
                      </Button>
                      <Button onClick={() => handleSubmitResponse(item.id)}>回答を送信</Button>
                    </>
                  ) : (
                    item.status === "pending" && <Button onClick={() => handleRespond(item.id)}>回答する</Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
