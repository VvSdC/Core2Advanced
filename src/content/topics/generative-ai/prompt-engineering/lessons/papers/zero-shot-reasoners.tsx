import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2205.11916'

export function ZeroShotReasoners() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Large Language Models are Zero-Shot Reasoners"
        authors="Kojima et al. (University of Tokyo / Google)"
        year="2022"
        url={PAPER_URL}
      >
        Discovered that adding <strong className="text-white">"Let's think step by step"</strong> to a prompt
        triggers chain-of-thought reasoning — with zero examples.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        The Chain-of-Thought lesson showed two ways to trigger reasoning. This paper explains the zero-shot
        variant — the simplest CoT technique you can use today.
      </Callout>

      <LessonSection title="Background">
        <p>
          The original CoT paper used few-shot examples with worked reasoning steps. That works well but costs
          tokens and requires crafting good examples. Kojima et al. asked:{' '}
          <em>can we trigger reasoning with no examples at all?</em>
        </p>
      </LessonSection>

      <LessonSection title="The discovery">
        <ContentStep number={1} title="One phrase changes everything">
          <Example
            title="Without vs with the trigger phrase"
          >{`# Before — direct answer, often wrong on hard problems
prompt = "Q: A juggler can juggle 16 balls. Half are golf balls. How many golf balls?"
# Model might answer: 8 (correct) or jump straight to wrong answer on harder variants

# After — model writes reasoning steps first
prompt = """Q: A juggler can juggle 16 balls. Half are golf balls, and half of
the golf balls are blue. How many blue golf balls?
A: Let's think step by step."""`}</Example>
          <p className="mt-3">
            The phrase <code className="font-mono text-sm">Let's think step by step.</code> acts as a trigger —
            the model has seen this pattern millions of times in training data (textbooks, tutorials, forums).
          </p>
        </ContentStep>

        <ContentStep number={2} title="Results across model sizes">
          <p>
            Tested on PaLM and InstructGPT variants. Gains were largest on instruction-tuned models and on
            reasoning benchmarks (MultiArith, GSM8K, Last Letter). Smaller models saw little benefit — consistent
            with the CoT technique lesson.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When to use this technique">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Use</strong> — math, logic, planning on large instruction-tuned models.</li>
          <li><strong className="text-white">Skip</strong> — simple recall, creative writing, small models.</li>
          <li><strong className="text-white">Upgrade to few-shot CoT</strong> — when zero-shot CoT is inconsistent on your specific task.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          '"Let\'s think step by step" triggers CoT reasoning with no examples.',
          'Works on large instruction-tuned models; minimal extra prompt engineering.',
          'Free upgrade over plain zero-shot for reasoning tasks.',
          'If inconsistent, add few-shot CoT examples from the CoT paper.',
        ]}
      />
    </LessonArticle>
  )
}
