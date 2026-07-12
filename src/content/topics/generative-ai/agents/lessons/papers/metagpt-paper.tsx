import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2308.00352'

export function MetaGptPaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework"
        authors="Hong et al."
        year="2023"
        url={PAPER_URL}
      >
        Software company as multi-agent system — <strong className="text-white">SOPs (Standard Operating Procedures)</strong>{' '}
        encoded as agent workflows for structured output.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete <em>Hierarchical Multi-Agent</em> and <em>Sequential Multi-Agent</em>. MetaGPT shows how
        fixed role pipelines produce reliable structured deliverables.
      </Callout>

      <LessonSection title="Software company as agents">
        <Flowchart
          title="MetaGPT SOP pipeline"
          chart={`flowchart LR
  Req[Requirement] --> PM[Product Manager]
  PM --> Arch[Architect]
  Arch --> Eng[Engineer]
  Eng --> QA[QA Engineer]
  QA --> Code[Working codebase]`}
        />
        <p className="mt-4 text-slate-300">
          Each role is an agent with a fixed SOP — Product Manager writes PRD, Architect designs APIs, Engineer
          writes code, QA tests. This is a <strong className="text-white">hierarchical sequential pipeline</strong>{' '}
          with no dynamic routing.
        </p>
      </LessonSection>

      <LessonSection title="Why SOPs matter">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Structured outputs (PRD → design doc → code) reduce hallucination and scope creep.</li>
          <li>Each agent only sees its role's context — limits token bloat.</li>
          <li>Maps directly to LangGraph: fixed edges, no conditional routing between roles.</li>
          <li>Trade-off: inflexible — bad for exploratory tasks; excellent for repeatable software generation.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MetaGPT encodes software team SOPs as a fixed multi-agent pipeline.',
          'Best for structured deliverables — PRD, design, code — not open-ended research.',
          'Implement as LangGraph with fixed sequential edges between role nodes.',
        ]}
      />
    </LessonArticle>
  )
}
