import { useState } from 'react';
import Head from 'next/head'
import { createParser } from 'eventsource-parser'

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Form from '@/components/Form';
import FormRow from '@/components/FormRow';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';

import styles from '@/styles/Home.module.scss'

function getFieldFromFormByName({ name, form } = {}) {
  const fields = Array.from(form?.elements);
  return fields.find(el => el?.name === name);
}

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleOnGenerateText(e) {
    e.preventDefault();
    console.log('handleOnGenerateText');

    const { value: prompt } = getFieldFromFormByName({
      name: 'prompt-post',
      form: e.currentTarget
    });

    setIsLoading(true);
    setText('');
    
    const response = await fetch("api/chat-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    
    function onParse(event) {
      if(event.type === 'event') {
        try {
          const data = JSON.parse(event.data);
          data.choices.filter(({ delta }) => !!delta.content).forEach(({ delta }) => {
            setText(prev => {
              return `${prev || ''}${delta.content}`
            })
          });
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    
    const parser = createParser(onParse);

    while(true) {
      const { done, value } = await reader.read();
      const text = decoder.decode(value);
      console.log(text);
      if (done || text.includes("[DONE]")) break;
      parser.feed(text)
    }

    setIsLoading(false);
  }

  return (
    <Layout>
      <Head>
        <title>Image Generator</title>
        <meta name="description" content="Generate an image!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Section>
        <Container size="content">
          <Form className={styles.form} onSubmit={handleOnGenerateText}>
            <h2>Generate Post</h2>
            <FormRow>
              <label>Enter Your Topic1:</label>
              <FormInput type="text" name="prompt-post" />
            </FormRow>
            <FormRow>
              <Button disabled={isLoading}>Generate</Button>
            </FormRow>
          </Form>
          {text && (<p key={text}>{text}</p>)}
        </Container>
      </Section>
    </Layout>
  )
}
