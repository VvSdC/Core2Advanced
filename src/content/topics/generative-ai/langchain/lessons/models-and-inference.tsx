import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ModelsAndInference() {
  return (
    <LessonArticle>
      <LessonSection title="Chat model wrappers">
        <p>
          LangChain wraps provider APIs (OpenAI, Anthropic, Google, local models) behind a common interface.
          Every chat model supports <code className="font-mono text-sm">.invoke()</code>,{' '}
          <code className="font-mono text-sm">.stream()</code>, and{' '}
          <code className="font-mono text-sm">.batch()</code> — swap providers by changing one import.
        </p>
        <Example
          title="Basic model invocation"
          output="Paris is the capital of France."
        >{`from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,       # deterministic — good for factual tasks
    max_tokens=256,
)

response = llm.invoke("What is the capital of France?")
print(response.content)`}</Example>
      </LessonSection>

      <LessonSection title="Inference parameters in LangChain">
        <ContentStep number={1} title="Parameters map to API knobs">
          <p>
            The parameters you learned in <em>Inference Parameters</em> are set directly on the model constructor
            or per-call via <code className="font-mono text-sm">.bind()</code>.
          </p>
          <Example
            title="All common inference parameters"
          >{`llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,          # creativity vs predictability
    top_p=0.9,                # nucleus sampling
    max_tokens=500,           # output length limit
    frequency_penalty=0.5,    # discourage repetition
    presence_penalty=0.3,     # encourage new topics
    stop=["END", "\\n\\n"],    # halt sequences
    seed=42,                  # reproducibility
)`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Override per call with .bind()">
          <Example
            title="Same model, different settings per chain"
          >{`factual_llm = llm.bind(temperature=0, max_tokens=100)
creative_llm = llm.bind(temperature=1.2, max_tokens=1000)

factual_chain = prompt | factual_llm
creative_chain = prompt | creative_llm`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Streaming">
        <Example
          title="Stream tokens as they arrive"
          output="The → capital → of → France → is → Paris..."
        >{`for chunk in llm.stream("Explain quantum computing briefly."):
    print(chunk.content, end="", flush=True)`}</Example>
        <Callout variant="tip">
          Use streaming for chat UIs — users see tokens appear immediately instead of waiting for the full response.
        </Callout>
      </LessonSection>

      <LessonSection title="Swapping providers">
        <Example
          title="Same interface, different backend"
        >{`# OpenAI
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini")

# Anthropic
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")

# Local via Ollama
from langchain_ollama import ChatOllama
llm = ChatOllama(model="llama3")

# Chains work identically — only the import changes`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ChatOpenAI (and siblings) wrap provider APIs behind .invoke() / .stream() / .batch().',
          'temperature, top_p, max_tokens, penalties, stop, seed — all set on the constructor.',
          '.bind() overrides parameters per chain without creating a new model instance.',
          'Swap providers by changing the import — chains stay the same.',
        ]}
      />
    </LessonArticle>
  )
}
