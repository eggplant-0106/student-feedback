"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// 👇 sonnerのtoastをインポート
import { Toaster, toast } from "sonner"

export default function SubmitFeedback() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublic, setIsPublic] = useState(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模擬API呼び出し
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 👇 sonnerのtoast呼び出し
    toast("フィードバックを送信しました", {
      description: "運営チームが確認次第、回答いたします。",
    })

    setIsSubmitting(false)
    router.push("/dashboard")
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>フィードバックを送信</CardTitle>
              <CardDescription>
                団体に対するご意見、ご提案、質問などをお寄せください。
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">タイトル</Label>
                  <Input
                    id="title"
                    placeholder="タイトルを入力してください"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">内容</Label>
                  <Textarea
                    id="content"
                    placeholder="ご意見の詳細を記入してください"
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">
                    このフィードバックを公開する（運営の判断により変更される場合があります）
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "送信中..." : "送信する"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      {/* 👇 これが必要！通知描画用 */}
      <Toaster />
    </>
  )
}

