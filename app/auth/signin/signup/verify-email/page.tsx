export default function VerifyEmail() {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">メールを確認してください</h1>
            <p className="text-sm text-muted-foreground">
              アカウントを有効化するためのリンクを記載したメールを送信しました。メールボックスを確認してください。
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              メールが届かない場合は、迷惑メールフォルダを確認するか、別のメールアドレスで再度登録してください。
            </p>
          </div>
        </div>
      </div>
    )
  }