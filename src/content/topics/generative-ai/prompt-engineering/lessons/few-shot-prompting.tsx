import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FewShotPrompting() {
  return (
    <LessonArticle>
      <Definition term="Few-Shot Prompting">
        <p>
          <strong className="text-white">Few-shot prompting</strong> includes 1–10 input→output examples in the
          prompt before the real question. The model picks up the pattern via in-context learning and applies it
          to the new input.
        </p>
      </Definition>

      <LessonSection title="When to use few-shot">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Format-sensitive tasks</strong> — you need a specific JSON shape, label set, or style.</li>
          <li><strong className="text-white">Classification</strong> — sentiment, intent detection, spam filtering with your labels.</li>
          <li><strong className="text-white">Data extraction</strong> — pulling fields from emails, invoices, or logs.</li>
          <li><strong className="text-white">Unusual tasks</strong> — things the model rarely saw phrased your way.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When NOT to use few-shot">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Simple questions where zero-shot already works — examples waste context window.</li>
          <li>When examples are misleading or contradictory — the model copies the wrong pattern.</li>
          <li>Very long examples — they eat context that the actual input needs.</li>
        </ul>
      </LessonSection>

      <ContentStep number={1} title="How to pick good examples">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Diverse</strong> — cover edge cases, not just easy ones.</li>
          <li><strong className="text-white">Consistent format</strong> — same labels, same structure in every example.</li>
          <li><strong className="text-white">Correct</strong> — one wrong example can poison the pattern.</li>
          <li><strong className="text-white">3–5 examples</strong> is often enough; more helps diminishingly on strong models.</li>
        </ul>
        <Example
          title="Few-shot sentiment classification"
          output={`Review: "Delivery was late but the product is excellent."
Sentiment: Mixed`}
        >{`prompt = """Classify sentiment as Positive, Negative, or Mixed.

Review: "Absolutely love it, best purchase ever!"
Sentiment: Positive

Review: "Broken on arrival, requesting a refund."
Sentiment: Negative

Review: "Decent quality but overpriced."
Sentiment: Mixed

Review: "Delivery was late but the product is excellent."
Sentiment:"""`}</Example>
      </ContentStep>

      <Callout variant="insight">
        Few-shot works best on <strong className="text-white">large models</strong> (70B+). Small models often
        ignore examples or copy surface patterns without understanding. See the GPT-3 paper in Research Papers.
      </Callout>

      <KeyTakeaways
        items={[
          'Few-shot = include 3–5 input→output examples before the real question.',
          'Best for format-sensitive tasks, classification, and extraction.',
          'Examples must be diverse, consistent, and correct.',
          'Works best on large models; SLMs may need fine-tuning instead.',
        ]}
      />
    </LessonArticle>
  )
}
