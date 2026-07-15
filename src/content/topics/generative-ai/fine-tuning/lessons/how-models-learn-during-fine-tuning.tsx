import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HowModelsLearnDuringFineTuning() {
  return (
    <LessonArticle>
      <Definition term="A training step">
        <p>
          During fine-tuning the model sees an example, guesses the next tokens, measures how wrong it was (the{' '}
          <strong className="text-white">loss</strong>), then slightly adjusts its weights so the next guess is
          better. Repeat this thousands of times and behavior drifts toward your dataset.
        </p>
      </Definition>

      <LessonSection title="Zero linear algebra: the four beats of one step">
        <ContentStep number={1} title="Forward pass — make a prediction">
          <p className="text-slate-300">
            Tokens enter the model; activations flow layer by layer; the model outputs probabilities for “what
            token comes next.” Analogy: a student reads the question and writes an answer before looking at the
            answer key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Loss — score how wrong">
          <p className="text-slate-300">
            <strong className="text-white">Loss</strong> is a single number: lower means closer to the desired
            tokens. Analogy: exam score inverted — 0 is perfect, big numbers mean large mistakes. No need to know
            the formula yet; treat loss as an error thermometer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Backward pass — who to blame">
          <p className="text-slate-300">
            The framework computes how each weight contributed to the error (gradients). Analogy: after grading,
            the coach rewinds the play tape to see which habits caused the miss — not which player to fire.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Optimizer step — nudge the weights">
          <p className="text-slate-300">
            An <strong className="text-white">optimizer</strong> (often AdamW) moves weights a tiny bit opposite to
            the error direction. Analogy: after practice, adjust footing slightly — not reinvent the sport overnight.
          </p>
        </ContentStep>
        <Flowchart
          title="One training step"
          chart={`flowchart LR
  A[Batch of examples] --> B[Forward pass<br/>predict tokens]
  B --> C[Compute loss<br/>error score]
  C --> D[Backward pass<br/>gradients]
  D --> E[Optimizer step<br/>update weights]
  E --> F[Next batch]`}
        />
      </LessonSection>

      <LessonSection title="Epochs, batches, and learning rate">
        <div className="mt-2 space-y-3">
          {[
            [
              'Batch',
              'A small group of examples processed together before one weight update. Mini-batches keep GPUs busy and stabilize training.',
            ],
            [
              'Epoch',
              'One full pass through your training set. Two epochs = every example seen about twice (order usually shuffled).',
            ],
            [
              'Learning rate',
              'How big each nudge is. Too high: wild jumps, loss spikes, forgotten skills. Too low: glacially slow learning. Analogy: step size when walking toward a destination in fog.',
            ],
          ].map(([term, body]) => (
            <div key={term} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-genai-400">{term}</p>
              <p className="mt-1 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
        <Callout variant="beginner" title="Picture the knobs">
          More epochs ≈ more practice rounds. Larger batches ≈ averaging feedback from more students at once.
          Learning rate ≈ how aggressively you rewrite the study guide after each quiz.
        </Callout>
      </LessonSection>

      <LessonSection title="Overfitting intuition">
        <Definition term="Overfitting">
          <p>
            The model <strong className="text-white">memorizes training examples</strong> instead of learning the
            general pattern — great scores on training loss, poor answers on new prompts. Like a student who
            memorizes last year&apos;s exam answers and fails a new test.
          </p>
        </Definition>
        <p className="text-slate-300 mt-4">
          Warning signs: training loss keeps dropping while a held-out <strong className="text-white">validation</strong>{' '}
          set stops improving or gets worse. Cures include more diverse data, fewer epochs, smaller learning rates,
          regularization, and parameter-efficient methods (LoRA) that constrain how much can change.
        </p>
        <Flowchart
          title="Healthy learning vs overfitting"
          chart={`flowchart TD
  A[Train longer] --> B{Val loss still improving?}
  B -->|Yes| C[Keep going carefully]
  B -->|No — train better, val worse| D[Stop / reduce LR / more data]
  D --> E[You were overfitting]`}
        />
      </LessonSection>

      <Callout variant="tip">
        You do not need to derive gradients by hand. Libraries run forward / loss / backward / step for you. Your
        job as a practitioner is choosing data, learning rate, epochs, and watching validation metrics.
      </Callout>

      <KeyTakeaways
        items={[
          'Each step: forward (predict) → loss (score) → backward (blame) → optimizer (nudge weights).',
          'Batches group examples; epochs are full dataset passes; learning rate is step size.',
          'Overfitting = memorize train, fail on new prompts — watch validation loss.',
          'Frameworks do the math; you steer data and hyperparameters.',
        ]}
      />
    </LessonArticle>
  )
}
