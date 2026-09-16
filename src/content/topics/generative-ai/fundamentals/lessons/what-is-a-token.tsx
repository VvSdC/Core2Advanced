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

export function WhatIsAToken() {
  return (
    <LessonArticle>
      <Definition term="Token">
        <p>
          A <strong className="text-white">token</strong> is the small chunk of text a language model actually reads and
          writes. A token is often a whole word, but it can also be part of a word, a single character, a space, or a
          piece of punctuation.
        </p>
        <p>
          Models never see letters or words directly. Before anything happens, your text is broken into tokens and each
          token is turned into a number. <strong className="text-white">Tokens are the model's alphabet.</strong>
        </p>
      </Definition>

      <Callout variant="beginner">
        Think of tokens like LEGO bricks. English has a fixed box of bricks (the vocabulary). To build any sentence, the
        model snaps together bricks from that box. Some words are a single brick; rarer words are built from several
        smaller bricks.
      </Callout>

      <LessonSection title="Why not just use words or letters?">
        <p>
          Two obvious ideas both fail, which is why tokens exist as a clever middle ground:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">Problem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['One token per letter', 'Sequences become enormous; the model wastes effort re-learning how letters form words.'],
                ['One token per word', 'Vocabulary explodes (millions of words + typos + names), and it can never handle a word it never saw.'],
                ['Subword tokens (the winner)', 'A fixed vocab (~50k–100k) of common words + word-pieces. Any text can be built, even new words.'],
              ].map(([approach, problem]) => (
                <tr key={approach} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{approach}</td>
                  <td className="px-4 py-3 text-slate-400">{problem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Subword tokenization gives the best of both worlds: common words stay as one efficient token, while rare words
          ("unhappiness", "Kubernetes", a random username) are assembled from smaller reusable pieces. Nothing is ever
          "out of vocabulary".
        </Callout>
      </LessonSection>

      <LessonSection title="Seeing tokenization in action">
        <ContentStep number={1} title="Common words vs rare words">
          <p>Frequent words become a single token. Rarer or compound words split into pieces:</p>
          <Example
            title="How different words tokenize"
            output={`"cat"          -> ["cat"]                      (1 token)
"tokenization" -> ["token", "ization"]         (2 tokens)
"unhappiness"  -> ["un", "happiness"]          (2 tokens)
"Kubernetes"   -> ["K", "ubernetes"]           (2 tokens)
"ChatGPT"      -> ["Chat", "G", "PT"]          (3 tokens)`}
          >{`# Illustration of subword splitting (real tokenizers vary).
# Common words = 1 token. Rare/compound words = several pieces.
examples = {
    "cat":          ["cat"],
    "tokenization": ["token", "ization"],
    "unhappiness":  ["un", "happiness"],
    "Kubernetes":   ["K", "ubernetes"],
    "ChatGPT":      ["Chat", "G", "PT"],
}
for word, toks in examples.items():
    print(f"{word:14} -> {toks}  ({len(toks)} tokens)")`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Spaces and case matter">
          <p>
            A leading space is usually part of the token, and capitalisation changes the token. To a model,{' '}
            <code className="font-mono text-sm">"cat"</code>, <code className="font-mono text-sm">" cat"</code>, and{' '}
            <code className="font-mono text-sm">"Cat"</code> can be three <em>different</em> tokens.
          </p>
          <Example
            title="Same letters, different tokens"
            output={`" cat"  -> token 3797   (with leading space)
"cat"   -> token 9246   (no space)
"Cat"   -> token 14140  (capitalised)`}
          >{`# The exact IDs are illustrative, but the idea is real:
# spacing and case produce different token IDs.
tokens = {
    " cat": 3797,   # most common form (word inside a sentence)
    "cat":  9246,   # start of text, no leading space
    "Cat":  14140,  # capitalised
}
for text, tid in tokens.items():
    print(f"{text!r:8} -> token {tid}")`}</Example>
          <Callout variant="tip">
            This is why prompts are sometimes sensitive to tiny formatting changes — a trailing space or odd
            capitalisation can change the tokens the model sees.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How the vocabulary is built: BPE in plain English">
        <p>
          The most common recipe is <strong className="text-white">Byte-Pair Encoding (BPE)</strong>. You do not need
          the math — the idea is delightfully simple: <em>repeatedly merge the most frequent pair of pieces into one new
          piece.</em>
        </p>
        <ContentStep number={1} title="Start with characters">
          <p>
            Begin by treating every character as its own token. The word <code className="font-mono text-sm">"lower"</code>{' '}
            is <code className="font-mono text-sm">l · o · w · e · r</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Merge the most common pair, over and over">
          <p>
            If <code className="font-mono text-sm">e · r</code> is the most common adjacent pair across your whole
            dataset, merge it into a new token <code className="font-mono text-sm">er</code>. Then find the next most
            common pair and merge that. Repeat tens of thousands of times.
          </p>
          <Flowchart
            title="BPE merging (simplified)"
            chart={`flowchart TB
  A["Start: l o w e r  (5 char tokens)"] --> B["'e'+'r' is common -> merge to 'er'"]
  B --> C["l o w er  (4 tokens)"]
  C --> D["'l'+'o' common -> merge to 'lo'"]
  D --> E["lo w er  (3 tokens)"]
  E --> F["... keep merging most frequent pairs ..."]
  F --> G([Final vocab: ~50k-100k tokens])`}
          />
        </ContentStep>
        <Callout variant="insight">
          The result is automatic and data-driven: pieces that appear together a lot (like{' '}
          <code className="font-mono text-sm">ing</code>, <code className="font-mono text-sm">tion</code>, or{' '}
          <code className="font-mono text-sm">the</code>) become single tokens, while rare strings stay split. Nobody
          hand-writes the vocabulary — it emerges from the text.
        </Callout>
      </LessonSection>

      <LessonSection title="From tokens to numbers (token IDs)">
        <p>
          Every token in the vocabulary has an integer <strong className="text-white">ID</strong>. Tokenizing is really
          two steps: split into token strings, then look up each string's ID. Those IDs are what actually flow into the
          model.
        </p>
        <Flowchart
          title="The full pipeline for one prompt"
          chart={`flowchart TB
  A["Text: 'I love AI'"] --> B["Split into tokens: ['I', ' love', ' AI']"]
  B --> C["Look up IDs: [40, 1842, 9552]"]
  C --> D["Model works with the numbers"]
  D --> E["Predicts next token ID, e.g. 13"]
  E --> F["Convert back to text: '.'"]`}
        />
        <Callout variant="info">
          Decoding is just the reverse: the model outputs a token ID, and the tokenizer maps it back to its text piece.
          Glue the pieces together and you get readable output.
        </Callout>
      </LessonSection>

      <LessonSection title="Why tokens matter to you in practice">
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Cost.</strong> APIs charge per token, not per word. Roughly{' '}
            <strong className="text-white">1 token ≈ 4 characters ≈ ¾ of a word</strong> in English, so ~100 tokens ≈
            75 words.
          </li>
          <li>
            <strong className="text-white">Context limits.</strong> A model's "context window" is measured in tokens
            (e.g. 128k). Long documents can quietly blow past the limit.
          </li>
          <li>
            <strong className="text-white">Speed.</strong> Generation happens one token at a time, so more output tokens
            = more latency.
          </li>
          <li>
            <strong className="text-white">Languages & code.</strong> English is token-efficient; many other languages
            and some code use more tokens for the same meaning, making them cost more.
          </li>
        </ul>
        <Example
          title="Estimating tokens and cost"
          output={`Words: 500
Estimated tokens: ~667
At $0.50 / 1M input tokens: $0.000334`}
          caption="A rough rule of thumb — always confirm with the provider's real tokenizer for billing."
        >{`words = 500
# English rule of thumb: ~1.33 tokens per word
est_tokens = round(words * 1.33)
price_per_million = 0.50  # USD per 1,000,000 input tokens
cost = est_tokens / 1_000_000 * price_per_million

print(f"Words: {words}")
print(f"Estimated tokens: ~{est_tokens}")
print(f"At $0.50 / 1M input tokens: \${cost:.6f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A token is a chunk of text — a word, word-piece, character, space, or punctuation — and it is what the model actually reads.',
          'Subword tokenization (e.g. BPE) keeps a fixed vocabulary yet can represent any text, including new words.',
          'BPE builds the vocabulary by repeatedly merging the most frequent adjacent pairs — no hand-crafting needed.',
          'Each token maps to an integer ID; models work with IDs and convert back to text when generating.',
          'Tokens drive cost, context limits, and speed — ~1 token ≈ 4 characters ≈ ¾ of an English word.',
        ]}
      />
    </LessonArticle>
  )
}
