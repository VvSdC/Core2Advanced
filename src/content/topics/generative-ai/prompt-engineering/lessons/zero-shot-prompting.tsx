import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ZeroShotPrompting() {
  return (
    <LessonArticle>
      <Definition term="Zero-Shot Prompting">
        <p>
          <strong className="text-white">Zero-shot</strong> means you give the model a task description and
          input with <em>no examples</em> of the desired input→output behaviour. The model relies entirely on
          patterns learned during pre-training.
        </p>
      </Definition>

      <LessonSection title="When to use zero-shot">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Simple, well-known tasks</strong> — summarisation, translation, definition lookup.</li>
          <li><strong className="text-white">General knowledge questions</strong> — "What is photosynthesis?"</li>
          <li><strong className="text-white">Fast prototyping</strong> — test whether the model can do something before investing in few-shot examples.</li>
          <li><strong className="text-white">Long context budget</strong> — no examples means more room for your actual input.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When NOT to use zero-shot">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Unusual output formats the model has not seen often (custom JSON schemas, niche markup).</li>
          <li>Domain-specific classification with company-specific labels.</li>
          <li>Multi-step reasoning — use chain-of-thought instead.</li>
          <li>When zero-shot gives inconsistent results — upgrade to few-shot.</li>
        </ul>
      </LessonSection>

      <ContentStep number={1} title="How to write a good zero-shot prompt">
        <Example
          title="Weak vs strong zero-shot"
          output={`Weak: vague instruction, inconsistent format
Strong: clear role, task, constraints, and output format`}
        >{`# Weak
prompt = "Tell me about climate change"

# Strong
prompt = """You are a science educator explaining to a high school student.

Task: Explain the greenhouse effect in 3 short paragraphs.
Constraints: Use simple language. No jargon without defining it.
Do not include political opinions."""`}</Example>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>State the <strong className="text-white">role</strong> or audience.</li>
          <li>State the <strong className="text-white">task</strong> explicitly.</li>
          <li>Add <strong className="text-white">constraints</strong> — length, tone, what to avoid.</li>
          <li>Specify <strong className="text-white">output format</strong> if structure matters.</li>
        </ul>
      </ContentStep>

      <Callout variant="tip">
        Zero-shot chain-of-thought: append <code className="font-mono text-sm">Let's think step by step.</code>{' '}
        to reasoning questions — no examples needed. Covered in the Chain-of-Thought lesson and the Zero-Shot
        Reasoners paper.
      </Callout>

      <KeyTakeaways
        items={[
          'Zero-shot = instruction only, no examples. Fast and simple.',
          'Best for well-known tasks and general knowledge.',
          'Be explicit about role, task, constraints, and format.',
          'Upgrade to few-shot or CoT when results are inconsistent or reasoning is needed.',
        ]}
      />
    </LessonArticle>
  )
}
