import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PromptTemplates() {
  return (
    <LessonArticle>
      <LessonSection title="Why templates?">
        <p>
          Hard-coding prompts as f-strings breaks the moment you need system messages, multiple variables, or
          chat history. <strong className="text-white">Prompt templates</strong> separate structure from data —
          define the skeleton once, fill variables at runtime.
        </p>
      </LessonSection>

      <LessonSection title="ChatPromptTemplate">
        <ContentStep number={1} title="Messages with roles">
          <p>
            Chat models expect a list of messages with roles: <code className="font-mono text-sm">system</code>,{' '}
            <code className="font-mono text-sm">human</code> (user), and <code className="font-mono text-sm">ai</code>{' '}
            (assistant). <code className="font-mono text-sm">ChatPromptTemplate</code> builds this list from a template.
          </p>
          <Example
            title="Basic chat prompt template"
            output={`System: You are a helpful coding tutor.
Human: Explain recursion in Python`}
          >{`from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful coding tutor."),
    ("human", "{question}"),
])

# Fill variables at runtime
messages = prompt.invoke({"question": "Explain recursion in Python"})
print(messages)`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Multiple variables">
          <Example
            title="Template with several placeholders"
          >{`prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert in {domain}."),
    ("human", "Explain {topic} at a {level} level."),
])

chain_input = prompt.invoke({
    "domain": "machine learning",
    "topic": "gradient descent",
    "level": "beginner",
})`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="String templates for RAG">
        <Example
          title="PromptTemplate for single-string prompts"
        >{`from langchain_core.prompts import PromptTemplate

rag_template = PromptTemplate.from_template(
    """Answer using only the context below.
If you don't know, say "I don't know."

Context: {context}

Question: {question}

Answer:"""
)`}</Example>
        <Callout variant="tip">
          Use <code className="font-mono text-sm">ChatPromptTemplate</code> for chat models and{' '}
          <code className="font-mono text-sm">PromptTemplate</code> for completion-style or RAG prompts.
        </Callout>
      </LessonSection>

      <LessonSection title="Template in a chain">
        <Flowchart
          title="Template → model flow"
          chart={`flowchart LR
  A["variables: {question}"] --> B[ChatPromptTemplate]
  B --> C[Formatted messages]
  C --> D[ChatOpenAI]
  D --> E[Response]`}
        />

        <Example
          title="Prompt piped into a model (preview of LCEL)"
          output="Recursion is when a function calls itself..."
        >{`from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
chain = prompt | llm

response = chain.invoke({"question": "Explain recursion in Python"})
print(response.content)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Prompt templates separate prompt structure from runtime variables.',
          'ChatPromptTemplate builds system/human/ai message lists for chat models.',
          'PromptTemplate works for single-string prompts (common in RAG).',
          'Templates are the first component in almost every LangChain chain.',
        ]}
      />
    </LessonArticle>
  )
}
