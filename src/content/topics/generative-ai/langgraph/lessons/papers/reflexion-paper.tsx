import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2303.11366'

export function ReflexionPaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Reflexion: Language Agents with Verbal Reinforcement Learning"
        authors="Shinn et al. (Northeastern / MIT)"
        year="2023"
        url={PAPER_URL}
      >
        Agents that <strong className="text-white">reflect on failure</strong>, store lessons in episodic memory,
        and retry — a natural LangGraph cycle with a reflection node.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        <em>Edges & Routing</em> and <em>State Reducers</em> lessons. Reflexion is a graph with a reflection
        branch on failure.
      </Callout>

      <LessonSection title="How Reflexion works">
        <ContentStep number={1} title="Act">
          <p>Agent attempts the task (code, reasoning, decision).</p>
        </ContentStep>
        <ContentStep number={2} title="Evaluate">
          <p>Check success — tests pass, answer correct, or environment feedback.</p>
        </ContentStep>
        <ContentStep number={3} title="Reflect">
          <p>On failure, LLM generates a <strong className="text-white">verbal reflection</strong>: "I failed because I forgot to handle edge case X." Stored in episodic memory.</p>
        </ContentStep>
        <ContentStep number={4} title="Retry with memory">
          <p>Next attempt includes prior reflections in context — agent learns without weight updates.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="LangGraph implementation pattern">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><code className="font-mono text-sm">reflections: Annotated[list, add]</code> in state</li>
          <li>Conditional edge: success → END, failure → reflect node → retry node</li>
          <li><code className="font-mono text-sm">retry_count</code> cap to prevent infinite loops</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Reflexion: act → evaluate → verbal reflection → retry with memory.',
          'Maps to LangGraph conditional edges + reflection node + state channel.',
          'No fine-tuning — learning happens through prompt context.',
        ]}
      />
    </LessonArticle>
  )
}
