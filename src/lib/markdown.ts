import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    if (!markdown || markdown.trim() === '') {
      return ''
    }

    const result = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown support (tables, strikethrough, etc.)
      .use(remarkBreaks) // Convert line breaks to <br> tags
      .use(html, { sanitize: false }) // Allow HTML (be careful in production)
      .process(markdown)
    
    return result.toString()
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    // Return the original markdown wrapped in a paragraph for safety
    return `<p>${markdown.replace(/\n/g, '<br>')}</p>`
  }
}
