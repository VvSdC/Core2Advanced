import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Interfaces() {
  return (
    <LessonArticle>
      <Definition term="Interfaces">
        <p>
          An <strong className="text-white">interface</strong> names an object shape — much like a
          type alias — and is especially handy when you want to{' '}
          <strong className="text-white">extend</strong> shapes or{' '}
          <strong className="text-white">implement</strong> them on classes.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: an interface is a{' '}
          <span className="text-web-400">contract checklist</span> — &quot;must have these
          fields/methods&quot; — that many objects can satisfy.
        </p>
      </Definition>

      <Callout variant="beginner" title="interface vs type — practical guidance">
        For simple object shapes, both work. Prefer{' '}
        <span className="font-mono text-sm text-web-400">interface</span> for extendable object
        contracts; prefer <span className="font-mono text-sm text-web-400">type</span> for unions,
        tuples, and mapped tricks. Consistency in a codebase matters most.
      </Callout>

      <LessonSection title="Declaring and using an interface">
        <Example title="Basic interface">
{`interface User {
  id: number;
  email: string;
}

const me: User = {
  id: 1,
  email: 'me@example.com',
};

function printEmail(user: User) {
  console.log(user.email);
}

printEmail(me);`}
        </Example>
        <CodeBlock title="Optional and readonly in interfaces">
{`interface Article {
  readonly slug: string;
  title: string;
  tags?: string[];
}

const post: Article = {
  slug: 'ts-interfaces',
  title: 'Interfaces 101',
};

console.log(post.title);
// post.slug = 'other'; // Error`}
        </CodeBlock>
        <Flowchart
          title="Value must satisfy the interface"
          chart={`flowchart TB
  I[Interface User]
  O[Object literal / class instance]
  C[Type checker compares shapes]
  I --> C
  O --> C
  C --> OK[OK if compatible]
  C --> ERR[Error if not]`}
        />
      </LessonSection>

      <LessonSection title="Extending interfaces">
        <p className="text-slate-300">
          Build richer shapes from smaller ones with{' '}
          <span className="font-mono text-sm text-web-400">extends</span> — like inheritance for
          types.
        </p>
        <Example title="Admin extends User">
{`interface User {
  id: number;
  email: string;
}

interface Admin extends User {
  privileges: string[];
}

const admin: Admin = {
  id: 7,
  email: 'admin@example.com',
  privileges: ['edit', 'delete'],
};

console.log(admin.privileges);`}
        </Example>
        <CodeBlock title="Extend multiple interfaces">
{`interface Timestamped {
  createdAt: Date;
}

interface Identified {
  id: string;
}

interface Note extends Identified, Timestamped {
  body: string;
}

const note: Note = {
  id: 'n1',
  createdAt: new Date(),
  body: 'Learn interfaces',
};

console.log(note.id, note.body);`}
        </CodeBlock>
        <ContentStep number={1} title="Why extend?">
          <p className="text-slate-300">
            Share common fields once. Specialized types only add what is new.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Implementing interfaces on objects and classes">
        <p className="text-slate-300">
          Plain objects are checked structurally (duck typing). Classes can declare{' '}
          <span className="font-mono text-sm text-web-400">implements</span> so the class must
          provide the required members.
        </p>
        <Example title="Structural typing — no implements needed">
{`interface Greeter {
  greet(): string;
}

const bot: Greeter = {
  greet() {
    return 'Hello from bot';
  },
};

console.log(bot.greet());`}
        </Example>
        <CodeBlock title="class implements Interface">
{`interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log('[log]', message);
  }
}

const logger = new ConsoleLogger();
logger.log('ready');`}
        </CodeBlock>
        <Callout variant="tip" title="type can extend too">
          <span className="font-mono text-sm text-web-400">type Admin = User &amp; {'{'} ... {'}'}</span>{' '}
          intersects shapes. Interfaces shine when many declarations merge or when teaching
          class contracts.
        </Callout>
        <Callout variant="info" title="Declaration merging (awareness)">
          Two <span className="font-mono text-sm text-web-400">interface User</span> blocks in the
          same scope merge. Type aliases do not — useful for library typing, surprising in app
          code if accidental.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Interfaces name object shapes and method contracts.',
          'Use interface for extendable object APIs; type for unions and advanced forms.',
          'extends composes interfaces; classes can implements them.',
          'TypeScript is structural: matching the shape is enough for object literals.',
        ]}
      />
    </LessonArticle>
  )
}
