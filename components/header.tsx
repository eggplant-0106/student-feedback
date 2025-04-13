import Link from "next/link"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            学生団体フィードバック
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/feedback" className="text-sm font-medium">
              フィードボード
            </Link>
            <Link href="/about" className="text-sm font-medium">
              使い方
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/signin" className="text-sm font-medium">
            ログイン
          </Link>
          <Link href="/auth/signup" className="text-sm font-medium">
            登録
          </Link>
        </div>
      </div>
    </header>
  )
}