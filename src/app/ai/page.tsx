"use client"

import React, { useState } from 'react'
import { generateArticle, GeneratedArticle } from './ai';
import Genai from './Genai';
import { set } from 'zod';
import Loader from '@/components/Loader';
import Page from '@/components/Page';
import { Button } from '@/components/ui/button';

export default function AiPage() {

    const [article, setArticle] = useState<GeneratedArticle>();
    const [importGen, setImportGen] = useState<boolean>(true);
    const close = () => {
        setImportGen(false);
    }

  return (
    <Page>
        <div>

            <Button onClick={() => setImportGen(true)}>Generate with ai</Button><br/>

            {importGen && <Genai setter={setArticle} close={close} img={false}></Genai>}
            <br/>

          <br/><span className="font-bold">(Article form)</span>
          <br/><br/>
          Headline: {article?.headline}
          <br/><br/>
          Category: {article?.category}
          <br/><br/>
          Summery: {article?.summery}
          <br/><br/>
          Content: {article?.content}
          <br/><br/>
          Img: {article?.imageUrl}
          
        </div>
    </Page>
  )
}
