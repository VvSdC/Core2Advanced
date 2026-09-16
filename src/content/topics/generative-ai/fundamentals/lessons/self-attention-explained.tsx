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

export function SelfAttentionExplained() {
  return (
    <LessonArticle>
      <Definition term="Self-Attention">
        <p>
          <strong className="text-white">Self-attention</strong> is the mechanism that lets each token gather information
          from other tokens in the sequence. For every token, the model asks: "which other tokens are relevant to me?"
          and then blends their information together, weighted by relevance.
        </p>
        <p>
          It does this using three vectors per token — <strong className="text-white">Query</strong>,{' '}
          <strong className="text-white">Key</strong>, and <strong className="text-white">Value</strong> — the famous
          Q, K, V.
        </p>
      </Definition>

      <Callout variant="beginner">
        Analogy: a <strong className="text-white">Query</strong> is what a token is looking for. A{' '}
        <strong className="text-white">Key</strong> is a label advertising what each token offers. A{' '}
        <strong className="text-white">Value</strong> is the actual information a token will hand over. A token compares
        its Query against everyone's Keys to decide whose Values to take.
      </Callout>

      <LessonSection title="The library analogy">
        <p>Picture searching a library:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Query</strong> = your search request ("books about space travel").
          </li>
          <li>
            <strong className="text-white">Key</strong> = the label on each book's spine ("Astronomy", "Cooking").
          </li>
          <li>
            <strong className="text-white">Value</strong> = the actual content inside each book.
          </li>
        </ul>
        <p className="mt-3">
          You match your <em>query</em> against every <em>key</em>, and the better the match, the more of that book's{' '}
          <em>value</em> you read. Self-attention does exactly this — with numbers — for every token, against every
          token, all at once.
        </p>
      </LessonSection>

      <LessonSection title="Where Q, K, V come from">
        <p>
          Each token already has an input vector (embedding + position). The model multiplies that vector by three
          learned weight matrices — <code className="font-mono text-sm">W_Q</code>,{' '}
          <code className="font-mono text-sm">W_K</code>, <code className="font-mono text-sm">W_V</code> — to produce its
          Query, Key, and Value. These three matrices are just more <em>parameters</em> learned during training.
        </p>
        <Flowchart
          title="One token produces Q, K, V"
          chart={`flowchart TB
  A["Token vector x"] --> Q["Q = x . W_Q"]
  A --> K["K = x . W_K"]
  A --> V["V = x . W_V"]`}
        />
      </LessonSection>

      <LessonSection title="The four steps of attention">
        <ContentStep number={1} title="Score: compare each Query with every Key">
          <p>
            For a given token, take its Query and compute a dot product with the Key of every token (including itself). A
            higher dot product = more relevant. This produces one raw score per token.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scale and softmax: turn scores into weights">
          <p>
            Divide the scores by <code className="font-mono text-sm">√(dimension)</code> to keep them stable, then apply
            softmax so they become positive weights that sum to 1. These are the{' '}
            <strong className="text-white">attention weights</strong> — the fraction of attention this token pays to each
            other token.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Weighted sum: blend the Values">
          <p>
            Multiply each token's Value by its attention weight and add them up. The result is the token's new vector — a
            custom blend of information pulled from the most relevant tokens.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Repeat for every token, in parallel">
          <p>
            All tokens do this simultaneously as big matrix multiplications, which is why GPUs make it fast.
          </p>
        </ContentStep>

        <Example
          title="Self-attention for one token, by hand"
          output={`raw scores (query . key):  it->animal=9.0, it->street=2.0, it->tired=1.0
attention weights (softmax): animal=0.94, street=0.04, tired=0.02
=> 'it' pulls ~94% of its new meaning from 'animal'`}
          caption="Numbers simplified. The mechanism is exactly this: score, softmax, weighted blend."
        >{`import math

# Query for the token "it"; keys for candidate tokens.
scores = {"animal": 9.0, "street": 2.0, "tired": 1.0}

def softmax(s):
    m = max(s.values())
    exp = {k: math.exp(v - m) for k, v in s.items()}
    total = sum(exp.values())
    return {k: v / total for k, v in exp.items()}

weights = softmax(scores)
for tok, w in weights.items():
    print(f"{tok:7} attention = {w:.2f}")`}</Example>
        <Callout variant="insight">
          This is the "it → animal" link in action. The model <em>learned</em> weight matrices that make "it"'s Query
          match "animal"'s Key, so attention routes meaning from animal into it. No rules were written — it emerged from
          training.
        </Callout>
      </LessonSection>

      <LessonSection title="Multi-head attention: many perspectives at once">
        <p>
          One set of Q/K/V can only capture one kind of relationship. So Transformers run several attention
          computations in parallel — called <strong className="text-white">heads</strong> — each with its own W_Q/W_K/W_V.
          One head might track grammar (subject↔verb), another might track what pronouns refer to, another might track
          topic.
        </p>
        <Flowchart
          title="Multi-head attention"
          chart={`flowchart TB
  A["Token vectors"] --> H1["Head 1: subject-verb links"]
  A --> H2["Head 2: pronoun references"]
  A --> H3["Head 3: topic / meaning"]
  H1 --> C["Concatenate all heads"]
  H2 --> C
  H3 --> C
  C --> O["Mix with W_O -> output"]`}
        />
        <Callout variant="info">
          The heads' outputs are concatenated and passed through one more weight matrix{' '}
          <code className="font-mono text-sm">W_O</code>. "Multi-head" is just "look at the sentence from several angles,
          then combine".
        </Callout>
      </LessonSection>

      <LessonSection title="Causal masking: no peeking at the future">
        <p>
          In a chat model, when predicting the next token the model must not look at tokens that come <em>after</em> the
          current position — otherwise it would cheat during training. A <strong className="text-white">causal
          mask</strong> sets the attention weights for all future tokens to zero, so each token can only attend to itself
          and earlier tokens.
        </p>
        <Example
          title="What a token can attend to"
          output={`Predicting token 3 ("sat"):
  can see: "The", "cat", "sat"     (positions 1-3)
  masked : "on", "the", "mat"       (future -> weight 0)`}
        >{`# Causal mask: allowed = current and earlier positions only.
sentence = ["The", "cat", "sat", "on", "the", "mat"]
current = 2  # predicting from position index 2 ("sat")
visible = sentence[: current + 1]
masked  = sentence[current + 1 :]
print("can see:", visible)
print("masked :", masked)`}</Example>
        <Callout variant="tip">
          This mask is the difference between a text <em>generator</em> (decoder-only, causal) and a text{' '}
          <em>understander</em> like BERT (sees everything). Same attention math, different visibility.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Self-attention lets each token gather relevant information from other tokens using Query, Key, and Value vectors.',
          'Q/K/V come from multiplying each token vector by learned matrices W_Q, W_K, W_V.',
          'Four steps: score (Q·K), scale, softmax into weights, then take a weighted sum of Values.',
          'Multi-head attention runs several attentions in parallel to capture different relationship types, then combines them.',
          'Causal masking hides future tokens so generation stays left-to-right — the core of decoder-only LLMs.',
        ]}
      />
    </LessonArticle>
  )
}
