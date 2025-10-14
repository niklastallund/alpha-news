"use client"

import React, { useState } from 'react'
import { generateArticle, GeneratedArticle } from './ai';
import Genai from './Genai';
import { set } from 'zod';
import Loader from '@/components/Loader';

export default function Page() {

    const [prompt, setPrompt] = useState("ai in school");
    const [category, setCategory] = useState("education");
    const [loading, setLoading] = useState<boolean>(false);

    const [article, setArticle] = useState<GeneratedArticle | undefined >();


    const testGen = async () => {
        setLoading(true);
        const art: GeneratedArticle = await generateArticle(prompt, category, 0.7);

        setArticle(art);
        setLoading(false);
    }


  return (
    <div>
        AI TEST PAGE<br/><br/>
    prompt:
    <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
    <br/><br/>
    category:
    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
    <br/><br/>
    <button onClick={async () => { await testGen(); }}>Test</button>
    <br/><br/>
    {loading ? <Loader /> : <Genai article={article} />}
    </div>
  )
}
