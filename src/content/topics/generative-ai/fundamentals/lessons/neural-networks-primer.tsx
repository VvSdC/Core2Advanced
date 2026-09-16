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

export function NeuralNetworksPrimer() {
  return (
    <LessonArticle>
      <Definition term="Neural Network">
        <p>
          A <strong className="text-white">neural network</strong> is a big mathematical function made of many tiny,
          simple units called <strong className="text-white">neurons</strong>. Each neuron multiplies its inputs by some
          numbers, adds them up, and passes the result through a simple curve. Stack thousands of these together and the
          whole thing can learn astonishingly complex patterns.
        </p>
        <p>
          That's the entire secret: <em>simple parts, arranged in layers, tuned by data.</em> A Large Language Model is
          just a very large neural network.
        </p>
      </Definition>

      <Callout variant="beginner">
        No calculus needed here. If you can picture "multiply some numbers, add them, repeat" you can understand what a
        neural network does. We only need enough intuition to make the Transformer lessons click.
      </Callout>

      <LessonSection title="One neuron: the smallest building block">
        <p>
          A single neuron takes some input numbers, gives each one an importance called a{' '}
          <strong className="text-white">weight</strong>, adds them up together with an offset called a{' '}
          <strong className="text-white">bias</strong>, and then squashes the result. That's it.
        </p>
        <Example
          title="A single neuron computing an output"
          output={`inputs:  [0.5, 0.9]     (e.g. 'rooms', 'location score')
weights: [0.4, 0.7]     (learned importance)
bias:    -0.2
sum = 0.5*0.4 + 0.9*0.7 + (-0.2) = 0.63
activation(0.63) = 0.652   (squashed to 0..1)`}
        >{`import math

def neuron(inputs, weights, bias):
    total = sum(x * w for x, w in zip(inputs, weights)) + bias
    # 'activation' adds a gentle curve so the network can
    # learn non-straight-line patterns. Here: the sigmoid.
    return 1 / (1 + math.exp(-total))

inputs  = [0.5, 0.9]
weights = [0.4, 0.7]
bias    = -0.2
print(round(neuron(inputs, weights, bias), 3))  # 0.652`}</Example>
        <Callout variant="insight">
          The <strong className="text-white">weights</strong> and <strong className="text-white">bias</strong> are the
          "knobs". Learning = finding good values for every knob. A model with 7 billion parameters simply has 7 billion
          of these knobs.
        </Callout>
      </LessonSection>

      <LessonSection title="Why the 'squash' (activation) matters">
        <p>
          Without that little curve, stacking neurons would be pointless — a pile of straight-line operations is still
          just one straight line. The <strong className="text-white">activation function</strong> bends the output
          slightly, and bending at every layer is what lets the network model curves, corners, and rich real-world
          relationships (like sarcasm, or whether code compiles).
        </p>
        <Callout variant="info">
          Common activations you'll hear about: <code className="font-mono text-sm">ReLU</code> (keep positives, zero
          out negatives), <code className="font-mono text-sm">GELU</code> (a smooth ReLU used in Transformers), and{' '}
          <code className="font-mono text-sm">sigmoid</code>/<code className="font-mono text-sm">softmax</code> (squash
          into probabilities). You don't need the formulas — just know they add a helpful bend.
        </Callout>
      </LessonSection>

      <LessonSection title="Layers: from one neuron to a network">
        <p>
          Put many neurons side by side and you get a <strong className="text-white">layer</strong>. Feed one layer's
          outputs into the next and you get a <strong className="text-white">deep</strong> network. Information flows from
          the input, through hidden layers that build up more and more abstract features, to the output.
        </p>
        <Flowchart
          title="A small feed-forward network"
          chart={`flowchart TB
  I1([input 1]) --> H1[hidden neuron]
  I2([input 2]) --> H1
  I1 --> H2[hidden neuron]
  I2 --> H2
  I1 --> H3[hidden neuron]
  I2 --> H3
  H1 --> O[output]
  H2 --> O
  H3 --> O`}
        />
        <Callout variant="insight">
          Early layers learn simple things (in text: spelling, basic grammar); deeper layers combine those into abstract
          ideas (tone, intent, logic). This "simple → abstract" build-up is why <em>depth</em> is powerful.
        </Callout>
      </LessonSection>

      <LessonSection title="How does it learn? Training in three moves">
        <ContentStep number={1} title="Guess (forward pass)">
          <p>
            Run the input through the network with the current knob values and produce an output — at first, a random
            guess.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Measure the error (loss)">
          <p>
            Compare the guess to the correct answer using a <strong className="text-white">loss</strong> — a single
            number that says how wrong the network was. Big loss = very wrong.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Nudge the knobs (backpropagation + gradient descent)">
          <p>
            Work out which direction to nudge each weight to make the loss a little smaller, and take a tiny step.
            Repeat this billions of times over billions of examples, and the knobs slowly settle into values that make
            good predictions.
          </p>
        </ContentStep>
        <Flowchart
          title="The training loop"
          chart={`flowchart TB
  A([Input example]) --> B[Forward pass: make a prediction]
  B --> C[Compare to correct answer -> loss]
  C --> D[Backprop: find how to adjust each weight]
  D --> E[Nudge weights a tiny step]
  E --> F{Loss low enough?}
  F -- no --> A
  F -- yes --> G([Trained model])`}
        />
        <Callout variant="tip">
          You will meet these words again — <strong className="text-white">loss</strong>,{' '}
          <strong className="text-white">gradient</strong>, <strong className="text-white">backpropagation</strong>. For
          now, just remember: <em>predict, measure the error, nudge the knobs, repeat.</em>
        </Callout>
      </LessonSection>

      <LessonSection title="Where language models fit">
        <p>
          A language model is this same machinery with one specific job: given the tokens so far, output a probability
          for every possible next token. The "correct answer" during training is simply{' '}
          <em>the token that actually came next</em> in real text — so the internet itself becomes the answer key, no
          human labelling required.
        </p>
        <Callout variant="insight">
          This is why LLMs can be trained on trillions of tokens cheaply: every sentence is its own quiz. The Transformer
          (next two lessons) is just a particularly clever <em>arrangement</em> of these neurons, designed for text.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A neuron multiplies inputs by weights, adds a bias, and applies an activation (a gentle curve).',
          'Weights and biases are the tunable "knobs" — parameters. Billions of them make an LLM.',
          'Activations let stacked layers model complex, non-linear patterns instead of one straight line.',
          'Layers build simple features into abstract ones; depth is what makes networks powerful.',
          'Training = predict, measure error (loss), nudge weights (backprop), repeat — for LLMs the answer key is just the real next token.',
        ]}
      />
    </LessonArticle>
  )
}
