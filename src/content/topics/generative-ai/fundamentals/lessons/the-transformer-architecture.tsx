import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TheTransformerArchitecture() {
  return (
    <LessonArticle>
      <Definition term="Transformer">
        <p>
          The <strong className="text-white">Transformer</strong> is the neural-network design behind every modern LLM
          (GPT, Claude, Gemini, LLaMA). Introduced in the 2017 paper <em>"Attention Is All You Need"</em>, its key idea
          is <strong className="text-white">self-attention</strong>: letting every token look at every other token and
          decide what to pay attention to when building meaning.
        </p>
        <p>
          This lesson is the map of the whole architecture. The next lesson zooms into attention itself.
        </p>
      </Definition>

      <Callout variant="beginner">
        Don't worry about memorising every box. Aim to leave with the story: <em>text → embeddings → add position → a
        stack of "attention + think" blocks → predict the next token.</em> Everything else is detail on those steps.
      </Callout>

      <LessonSection title="The problem it solved: reading in parallel">
        <p>
          Before Transformers, the best text models were <strong className="text-white">RNNs</strong> — they read one
          word at a time, left to right, passing a "memory" along. Two big problems:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Slow.</strong> Word-by-word processing can't use modern GPUs, which love doing
            thousands of things at once.
          </li>
          <li>
            <strong className="text-white">Forgetful.</strong> By the end of a long paragraph, the memory of the
            beginning has faded, so long-range connections get lost.
          </li>
        </ul>
        <p>
          The Transformer's fix: process <strong className="text-white">all tokens at once</strong>, and let each token
          directly connect to any other token — no matter how far apart — through attention.
        </p>
        <Callout variant="insight">
          "The animal didn't cross the street because <em>it</em> was too tired." What does "it" refer to? Attention lets
          the model link "it" straight back to "animal" in a single step, even across many words.
        </Callout>
      </LessonSection>

      <LessonSection title="The big picture (decoder-only LLM)">
        <p>
          Most chat LLMs are <strong className="text-white">decoder-only</strong> Transformers. Here is the full journey
          of your prompt, top to bottom:
        </p>
        <Flowchart
          title="A decoder-only Transformer, end to end"
          chart={`flowchart TB
  A["Text prompt"] --> B["Tokenize -> token IDs"]
  B --> C["Token embeddings (meaning vectors)"]
  C --> D["+ Positional encoding (order info)"]
  D --> E["Transformer Block x N"]
  E --> F["Final layer norm"]
  F --> G["Output head -> score every vocab token"]
  G --> H["Softmax -> probabilities"]
  H --> I["Pick next token"]
  I --> B`}
        />
        <p className="mt-3">
          Notice the loop back to the top: after picking a token, it is appended and the whole thing runs again for the
          next token. Modern models stack <strong className="text-white">N = 32, 80, or more</strong> of those blocks.
        </p>
      </LessonSection>

      <LessonSection title="Step 1 — Embeddings + positional encoding">
        <p>
          As we saw, tokens become meaning vectors (embeddings). But processing all tokens at once creates a problem:{' '}
          the model would have <em>no idea what order</em> the words came in. "Dog bites man" and "Man bites dog" would
          look identical.
        </p>
        <p>
          The fix is <strong className="text-white">positional encoding</strong>: add a second vector that encodes each
          token's <em>position</em>. Now every token carries both "what I mean" and "where I am".
        </p>
        <Example
          title="Meaning + position combined"
          output={`token ' cat' meaning:  [ 0.2, -0.4, 0.9, ...]
position #2 encoding:  [ 0.0,  0.8, 0.1, ...]
final input vector:    [ 0.2,  0.4, 1.0, ...]  (added together)`}
          caption="Real models use rotary (RoPE) or learned position encodings, but the goal is always the same: inject order."
        >{`# Conceptually: input = meaning_embedding + position_encoding
meaning  = [0.2, -0.4, 0.9]
position = [0.0,  0.8, 0.1]
combined = [m + p for m, p in zip(meaning, position)]
print(combined)  # [0.2, 0.4, 1.0]`}</Example>
      </LessonSection>

      <LessonSection title="Step 2 — The Transformer block (the heart)">
        <p>
          The model repeats one block many times. Each block has two main parts, each wrapped with two helper
          mechanisms:
        </p>
        <Flowchart
          title="Inside one Transformer block"
          chart={`flowchart TB
  A["Input vectors (one per token)"] --> B["Multi-Head Self-Attention"]
  B --> C["Add & Norm (residual + layer norm)"]
  C --> D["Feed-Forward Network (per token)"]
  D --> E["Add & Norm"]
  E --> F["Output vectors -> next block"]`}
        />
        <ContentStep number={1} title="Self-attention — mixing information between tokens">
          <p>
            This is where tokens <em>talk to each other</em>. Each token looks at the others and pulls in the
            information it needs. "it" gathers meaning from "animal"; a verb gathers its subject. After this step, each
            token's vector is <strong className="text-white">context-aware</strong>. (Full mechanics next lesson.)
          </p>
        </ContentStep>
        <ContentStep number={2} title="Feed-forward network — thinking about each token">
          <p>
            After tokens have shared information, each token vector is passed <em>independently</em> through a small
            neural network (the primer's neurons at work). This is where much of the model's stored{' '}
            <strong className="text-white">knowledge</strong> lives — it transforms and enriches each token's meaning.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Add & Norm — the two quiet heroes">
          <p>
            <strong className="text-white">Residual connections</strong> ("Add") add each sublayer's input back to its
            output, giving information a shortcut so very deep stacks can still be trained.{' '}
            <strong className="text-white">Layer normalization</strong> ("Norm") keeps the numbers in a healthy range so
            training stays stable. Without these two, deep Transformers simply wouldn't learn.
          </p>
        </ContentStep>
        <Callout variant="insight">
          A clean way to remember it: <strong className="text-white">attention mixes information across tokens</strong>,
          and the <strong className="text-white">feed-forward network processes each token on its own</strong>. Alternate
          these dozens of times and understanding builds up layer by layer.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 3 — Turning the final vectors into a next token">
        <p>
          After the last block, each token has a rich, context-aware vector. To predict the next token, the model takes
          the vector at the <em>last</em> position and runs it through the{' '}
          <strong className="text-white">output head</strong> — a layer that produces one score (a "logit") for every
          token in the vocabulary. <strong className="text-white">Softmax</strong> turns those scores into probabilities
          that sum to 1.
        </p>
        <Example
          title="From final vector to probabilities"
          output={`logits (raw scores): mat=8.1, floor=7.5, moon=1.2, ...
after softmax:       mat=0.35, floor=0.22, moon=0.001, ...
sum of all probs = 1.0`}
        >{`import math

logits = {"mat": 8.1, "floor": 7.5, "couch": 7.1, "moon": 1.2}

def softmax(scores):
    m = max(scores.values())
    exp = {k: math.exp(v - m) for k, v in scores.items()}
    total = sum(exp.values())
    return {k: v / total for k, v in exp.items()}

for tok, p in softmax(logits).items():
    print(f"{tok:6} -> {p:.3f}")`}</Example>
        <Callout variant="info">
          This connects straight back to the "How Language Models Work" idea: the Transformer is the machine that{' '}
          <em>produces</em> that probability distribution over the next token.
        </Callout>
      </LessonSection>

      <LessonSection title="Two flavours you'll hear about">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">Sees</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Decoder-only', 'Only tokens to the left (past)', 'Generating text', 'GPT, Claude, LLaMA'],
                ['Encoder-only', 'All tokens (full context)', 'Understanding / embeddings', 'BERT'],
                ['Encoder–decoder', 'Encode input, decode output', 'Translation, summarization', 'T5, original Transformer'],
              ].map(([variant, sees, best, ex]) => (
                <tr key={variant} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{variant}</td>
                  <td className="px-4 py-3 text-slate-400">{sees}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Chat assistants are decoder-only and <strong className="text-white">causal</strong>: when predicting a token
          they may only look at earlier tokens, never peek at the future. That "masking" is what makes generation
          left-to-right and honest.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The Transformer processes all tokens in parallel and connects any two tokens directly via self-attention — fixing RNNs\' speed and forgetfulness.',
          'Flow: tokenize → embeddings → add positional encoding → N Transformer blocks → output head → softmax → next token.',
          'Each block = multi-head self-attention (mix info across tokens) + feed-forward network (process each token), wrapped in residual connections and layer norm.',
          'The feed-forward layers hold much of the model\'s knowledge; attention routes the right information to the right token.',
          'Chat LLMs are decoder-only and causal — they predict the next token using only past tokens.',
        ]}
      />
    </LessonArticle>
  )
}
