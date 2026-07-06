import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function WhyOop() {
  return (
    <LessonArticle>
      <Definition term="Why Object Oriented Programming?">
        <p>
          So far you have written code as a sequence of steps: assign variables, call functions, use loops. That
          works well for small scripts. But as programs grow — a game with players and enemies, a shop with products
          and orders, a social app with users and posts — you need a better way to <strong className="text-white">organize</strong> code.
        </p>
        <p>
          <strong className="text-white">Object Oriented Programming (OOP)</strong> groups related{' '}
          <strong className="text-white">data</strong> (attributes) and{' '}
          <strong className="text-white">behavior</strong> (methods) into units called{' '}
          <strong className="text-white">objects</strong>. Each object represents one "thing" in your program.
        </p>
        <p>
          OOP is not magic and it is not always the answer — but when you are modeling real-world entities, it
          makes code easier to read, reuse, and extend.
        </p>
      </Definition>

      <Callout variant="beginner" title="In simple terms">
        Procedural code asks: <em>"What steps do I run?"</em> OOP asks: <em>"What things exist, and what can each thing do?"</em>
      </Callout>

      <ContentStep number={1} title="The problem without OOP">
        <p>Imagine building a simple game with three players. Without classes, you might write:</p>
        <Example title="Scattered variables — hard to maintain">{`player1_name = "Ada"
player1_health = 100
player1_score = 0

player2_name = "Bob"
player2_health = 100
player2_score = 0

def damage_player1(amount):
    global player1_health
    player1_health -= amount`}</Example>
        <p>
          Every new player means more variables and more functions. Copy-paste grows. Bugs creep in when you update
          one player but forget another. There is no clear bundle that says "this is everything about one player."
        </p>
      </ContentStep>

      <ContentStep number={2} title="The OOP mental model">
        <Flowchart
          title="From chaos to objects"
          chart={`
flowchart TB
  A["Many loose variables"]
  B["One Player blueprint"]
  C["player1 object"]
  D["player2 object"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <StepSequence
          steps={[
            {
              title: 'Identify the things',
              description: 'Ask: what nouns exist in my problem? Player, Enemy, Product, Order, BankAccount.',
            },
            {
              title: 'Define a class (blueprint)',
              description: 'Write one template that describes what every Player has (name, health) and can do (take damage, heal).',
            },
            {
              title: 'Create objects (instances)',
              description: 'Each actual player in the game is an object created from the Player class. Ada is one object, Bob is another.',
            },
            {
              title: 'Send messages (call methods)',
              description: 'Instead of damage_player1(10), you write player1.take_damage(10). The object handles its own data.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="The four pillars (preview)">
        <p>You will meet these ideas in depth in later lessons. For now, just recognize the names:</p>
        <ul className="space-y-3 text-slate-300">
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <strong className="text-white">Encapsulation</strong> — bundle data + behavior together; hide internals when needed.
          </li>
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <strong className="text-white">Abstraction</strong> — expose a simple interface; hide complex implementation.
          </li>
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <strong className="text-white">Inheritance</strong> — build specialized classes from general ones (Dog is an Animal).
          </li>
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <strong className="text-white">Polymorphism</strong> — treat different objects the same way when they share behavior.
          </li>
        </ul>
      </ContentStep>

      <ContentStep number={4} title="When OOP helps — and when it does not">
        <Callout variant="tip" title="Use OOP when">
          <ul className="list-inside list-disc space-y-1">
            <li>You have several entities with similar structure (users, products, messages)</li>
            <li>State and behavior belong together (a bank account that knows how to deposit)</li>
            <li>You want to reuse code through inheritance or composition</li>
          </ul>
        </Callout>
        <Callout variant="info" title="Skip heavy OOP when">
          <ul className="list-inside list-disc space-y-1">
            <li>A short script does one linear task (rename files, parse a CSV once)</li>
            <li>Functions and dicts are enough — do not force classes everywhere</li>
          </ul>
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'OOP organizes code around objects — things with data and behavior.',
          'A class is a blueprint; an object is one concrete instance.',
          'OOP shines when modeling many similar entities in a growing program.',
          'The four pillars: encapsulation, abstraction, inheritance, polymorphism.',
        ]}
      />
    </LessonArticle>
  )
}
