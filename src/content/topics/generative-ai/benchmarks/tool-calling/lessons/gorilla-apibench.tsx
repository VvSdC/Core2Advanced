import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function GorillaApibench() {
  return (
    <LessonArticle>
      <Definition term="Gorilla APIBench">
        <p>
          <strong className="text-white">Gorilla APIBench</strong> comes from the{' '}
          <strong className="text-white">Gorilla</strong> project: models that call APIs by grounding in{' '}
          <strong className="text-white">documentation</strong>, not by inventing endpoints from memory.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: open the manual for <span className="font-mono text-sm text-genai-400">get_weather</span>,
          then dial the documented parameters — do not invent a fake{' '}
          <span className="font-mono text-sm text-genai-400">weather_magic()</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="What Gorilla APIBench measures">
        Accuracy of generating correct API calls when the model can use (or is trained with) API
        documentation — reducing hallucinated endpoints and arguments.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="API calling with docs">
          <p className="text-slate-300">
            Given a user intent and API docs, produce a valid call. Docs are the source of truth for names and
            parameters.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hallucination pressure">
          <p className="text-slate-300">
            Without grounding, models invent plausible but wrong APIs. APIBench checks whether the call matches
            a real documented API.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Gorilla project context">
          <p className="text-slate-300">
            Gorilla showed that retrieval-augmented / doc-grounded training improves API calling — the bench
            is how that claim is measured.
          </p>
        </ContentStep>
        <Flowchart
          title="Doc-grounded calling"
          chart={`flowchart TB
  U[User intent] --> D[API documentation]
  D --> M[Model]
  U --> M
  M --> C[API call]
  C --> J{Matches docs?}
  J -->|Yes| OK[Credit]
  J -->|No / hallucinated| BAD[Fail]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — calls match documented APIs more often; fewer
            invented endpoints.
          </li>
          <li>
            <strong className="text-white">Low</strong> — frequent hallucinated tools/args even when docs are
            available.
          </li>
          <li>
            Compare under the <strong className="text-white">same doc retrieval setup</strong> — changing
            retrievers changes scores.
          </li>
        </ul>
        <Example title="Hallucination vs grounded (fictional)">
{`Docs list: get_weather(city), search_docs(query)

Bad:  weather_oracle(place="Austin")     ← not in docs
Good: get_weather(city="Austin")         ← matches docs`}
        </Example>
      </LessonSection>

      <LessonSection title="What Gorilla APIBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Long multi-turn <strong className="text-white">customer workflows</strong> with policies (τ-bench).
          </li>
          <li>
            Whether the model should <strong className="text-white">abstain</strong> from tools (MetaTool).
          </li>
          <li>
            Toxicity or jailbreak safety of the surrounding chat.
          </li>
          <li>
            Every possible third-party API on the internet — it uses its evaluation API sets.
          </li>
        </ul>
        <Callout variant="tip" title="Product link">
          If your agent retrieves OpenAPI/docs before calling, Gorilla-style evals are especially relevant.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Gorilla APIBench scores API calls grounded in documentation.',
          'High = fewer hallucinated endpoints; low = inventing APIs.',
          'Retriever / doc setup must stay fixed when comparing models.',
          'Complements BFCL; focuses on doc-faithful API generation.',
        ]}
      />
    </LessonArticle>
  )
}
