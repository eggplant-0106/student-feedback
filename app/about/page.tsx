import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">フィードバックシステムについて</h1>
          <p className="text-muted-foreground">団体をより良くするためのフィードバックプラットフォームの使い方</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>フィードバックシステムの目的</CardTitle>
              <CardDescription>団体の活動をより良くするための意見交換の場</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                このフィードバックシステムは、団体メンバーの皆さんからの意見や提案を集め、
                運営チームが迅速に対応するためのプラットフォームです。
                皆さんの声を活動に反映させ、より良い団体づくりを目指しています。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>フィードバックの流れ</CardTitle>
              <CardDescription>投稿から回答までのプロセス</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>メンバーがフィードバックを投稿（公開/非公開を選択可能）</li>
                <li>運営チームが内容を確認</li>
                <li>適切な担当者が回答を作成</li>
                <li>回答が投稿者に通知（メール）</li>
                <li>運営チームが公開/非公開を決定（投稿者の希望を尊重）</li>
                <li>公開設定の場合、フィードボードに掲載</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>公開/非公開について</CardTitle>
              <CardDescription>プライバシーと透明性のバランス</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                フィードバックを投稿する際、公開/非公開を選択できます。
                公開を選択した場合でも、運営チームが内容を確認し、適切と判断した場合のみ公開されます。
                非公開を選択した場合は、投稿者と運営チームのみが閲覧できます。
              </p>
              <p>
                公開されたフィードバックは、他のメンバーも閲覧できるため、
                同様の疑問や提案を持つメンバーにとって参考になります。 また、団体の透明性向上にも貢献します。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>利用にあたってのお願い</CardTitle>
              <CardDescription>建設的なフィードバックのために</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>具体的な内容を心がけてください</li>
                <li>建設的な提案を歓迎します</li>
                <li>個人を攻撃するような内容は避けてください</li>
                <li>機密情報や個人情報の投稿はお控えください</li>
                <li>回答には時間がかかる場合があります。ご了承ください</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button asChild size="lg">
              <Link href="/submit">フィードバックを投稿する</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
