import React from 'react'
import { GeneratedArticle } from './ai';
import Markdown from 'react-markdown'

interface Props {
  article: GeneratedArticle | undefined;
}

export default function Genai( { article }: Props ) {
  return (
    <div>
      <Markdown>
        {`# AI Generated Article
        ${article?.headline ?? ""}
        ![image](${article?.imageUrl ?? ""})
        ${article?.summery ?? ""}
        ${article?.content ?? ""}`}
      </Markdown>
    </div>
  )
}
