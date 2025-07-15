import { remark } from 'remark'
import html from 'remark-html'

export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark().use(html).process(markdown)
    return result.toString()
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    return markdown
  }
}
