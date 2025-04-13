import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// SendGrid APIキーを設定
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function POST(request) {
  try {
    const { to, subject, text, html } = await request.json()

    const msg = {
      to,
      from: process.env.EMAIL_FROM, // 送信元メールアドレス
      subject,
      text,
      html,
    }

    await sgMail.send(msg)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({ error: 'メール送信中にエラーが発生しました' }, { status: 500 })
  }
}