import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function StructuredOutputPrompting() {
  return (
    <LessonArticle>
      <Definition term="Structured Output Prompting">
        <p>
          <strong className="text-white">Structured output prompting</strong> asks the model to respond in a
          machine-readable format — JSON, XML, CSV, or a fixed template — so downstream code can parse the
          result reliably.
        </p>
      </Definition>

      <LessonSection title="When to use structured output">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">API integrations</strong> — model output feeds into another system.</li>
          <li><strong className="text-white">Data extraction</strong> — pull names, dates, amounts from unstructured text.</li>
          <li><strong className="text-white">Multi-field responses</strong> — summary + sentiment + keywords in one call.</li>
          <li><strong className="text-white">Tool use / agents</strong> — model must emit valid JSON for function calls.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When NOT to rely on prompt-only structure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Critical production pipelines — use the API's native JSON mode or schema enforcement when available.</li>
          <li>Deeply nested schemas — models may drop fields or add extras.</li>
          <li>When 100% parse success is required — add validation and retry logic.</li>
        </ul>
      </LessonSection>

      <ContentStep number={1} title="JSON output prompting">
        <Example
          title="Extract structured data"
          output={`{"name": "Ada Lovelace", "born": 1815, "field": "computing"}`}
        >{`prompt = """Extract person info from the text. Respond with ONLY valid JSON, no markdown.

Schema:
{"name": string, "born": integer, "field": string}

Text: Ada Lovelace, born in 1815, is considered the first computer programmer.

JSON:"""`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Tips for reliable structured output">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Show the <strong className="text-white">exact schema</strong> in the prompt.</li>
          <li>Say <strong className="text-white">"ONLY JSON, no explanation"</strong> to reduce preamble.</li>
          <li>Use <strong className="text-white">few-shot examples</strong> of valid JSON for your schema.</li>
          <li>Validate with a JSON parser; on failure, retry with the error message in the prompt.</li>
          <li>Prefer native <strong className="text-white">JSON mode</strong> / structured output APIs when available.</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Structured output = JSON, XML, or fixed templates for machine-readable responses.',
          'Best for extraction, APIs, and multi-field answers.',
          'Show schema, forbid extra text, validate and retry on parse failure.',
          'Use native JSON mode APIs for production reliability.',
        ]}
      />
    </LessonArticle>
  )
}
