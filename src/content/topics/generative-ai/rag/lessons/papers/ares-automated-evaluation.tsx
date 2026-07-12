import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2311.09476'

export function AresAutomatedEvaluation() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems"
        authors="Saad-Falcon et al. (Stanford)"
        year="2023"
        url={PAPER_URL}
      >
        <strong className="text-white">ARES</strong> — train lightweight judge models on synthetic data to evaluate
        RAG context relevance, answer faithfulness, and answer relevance at scale without expensive LLM calls.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAGAS</em> (previous paper) and <em>Generation & Faithfulness Metrics</em>. ARES improves on
        RAGAS by replacing per-query LLM judge calls with fine-tuned lightweight judges.
      </Callout>

      <LessonSection title="The cost problem with RAGAS">
        <p>
          RAGAS uses a large LLM (GPT-4) as judge for every evaluation call — expensive at scale. ARES asks:
          can we train a <strong className="text-white">small fine-tuned judge</strong> that correlates with
          human ratings but costs 100× less per evaluation?
        </p>
      </LessonSection>

      <LessonSection title="How ARES works">
        <ContentStep number={1} title="Synthetic training data">
          <p>
            GPT-4 generates labelled examples of good/bad context relevance, faithfulness, and answer
            relevance — creating a training set without human annotation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fine-tuned judge models">
          <p>
            Small models (DeBERTa-based) are fine-tuned on synthetic labels to predict the three RAG quality
            dimensions. Inference is milliseconds, not seconds.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prediction-powered inference">
          <p>
            Statistical correction ensures judge predictions align with human preferences even with imperfect
            synthetic labels — confidence intervals on final scores.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>ARES judges correlated with human ratings as well as GPT-4 judges.</li>
          <li>100× cheaper per evaluation — enables continuous monitoring in production.</li>
          <li>Evaluated across KILT, SuperGLUE, and domain-specific RAG benchmarks.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ARES trains lightweight judge models on synthetic GPT-4-labelled data.',
          'Scores context relevance, faithfulness, and answer relevance at 100× lower cost than RAGAS.',
          'Enables continuous production RAG monitoring without expensive LLM judge calls.',
        ]}
      />
    </LessonArticle>
  )
}
