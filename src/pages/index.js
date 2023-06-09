import { useState } from 'react';
import Head from 'next/head'

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
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function handleOnGenerateText(e) {
    e.preventDefault();
    console.log('handleOnGenerateText');

    const { value: prompt } = getFieldFromFormByName({
      name: 'prompt-post',
      form: e.currentTarget
    });

    setIsLoading(true);
    
    //-----------

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
              <label>Enter Your Topic:</label>
              <FormInput type="text" name="prompt-post" />
            </FormRow>
            <FormRow>
              <Button disabled={isLoading}>Generate</Button>
            </FormRow>
          </Form>
          {post && (
            <div>
              <h1>{ post.title }</h1>
              <div dangerouslySetInnerHTML={{
                __html: post.content
              }} />
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  )
}