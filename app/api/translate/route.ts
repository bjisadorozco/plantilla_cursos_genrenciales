import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text') || ''
  const lang = searchParams.get('lang') || 'en'

  if (!text) {
    return NextResponse.json({ translatedText: '' })
  }

  try {
    const encodedText = encodeURIComponent(text)
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${encodeURIComponent(lang)}&dt=t&q=${encodedText}`
    )

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = Array.isArray(data?.[0])
      ? data[0].map((item: any) => item[0]).join('')
      : text

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation proxy error:', error)
    return NextResponse.json({ translatedText: text })
  }
}
