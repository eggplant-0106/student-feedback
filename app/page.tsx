import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackItem } from "@/components/feedback-item"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">学生団体フィードバックプラットフォーム</h1>
        <p className="text-muted-foreground max-w-[700px]">
          団体の改善のためのご意見をお寄せください。あなたの声が私たちの活動をより良くします。
        </p>
        <div className="flex gap-4 mt-4">
          <Button asChild size="lg">
            <Link href="/submit">意見を投稿する</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">マイダッシュボード</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>意見箱</CardTitle>
            <CardDescription>あなたの意見や提案を共有しましょう</CardDescription>
          </CardHeader>
          <CardContent>団体の活動に関する意見、提案、質問を投稿できます。匿名での投稿も可能です。</CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/submit">投稿する</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>回答システム</CardTitle>
            <CardDescription>運営からの回答をチェック</CardDescription>
          </CardHeader>
          <CardContent>投稿された意見に対して、運営側が直接回答します。質問への回答は迅速に行われます。</CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/feedback">回答を見る</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>公開/非公開設定</CardTitle>
            <CardDescription>プライバシーを尊重</CardDescription>
          </CardHeader>
          <CardContent>
            投稿は公開または非公開を選択できます。運営側が適切に判断し、共有すべき内容は全体に公開されます。
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/about">詳細を見る</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">最近の公開フィードバック</h2>
      <div className="space-y-4">
        <FeedbackItem
          title="活動時間について"
          content="週末の活動時間をもう少し遅くできないでしょうか？"
          author="田中太郎"
          date="2025年4月10日"
          response="次回のミーティングで検討します。ご意見ありがとうございます。"
          responder="運営チーム"
          responseDate="2025年4月12日"
        />
        <FeedbackItem
          title="新入生歓迎会の提案"
          content="新入生向けのオンラインイベントを増やしてはどうでしょうか？"
          author="佐藤花子"
          date="2025年4月5日"
          response="素晴らしい提案です！5月に新たなオンラインイベントを計画中です。"
          responder="イベント担当"
          responseDate="2025年4月8日"
        />
      </div>
    </div>
  )
}