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

export function UtilityTypes() {
  return (
    <LessonArticle>
      <Definition term="Utility types">
        <p>
          TypeScript ships built-in helpers that transform existing types — make every field
          optional, pick a subset, build a dictionary, and more.
        </p>
        <p className="mt-2 text-slate-300">
          You already know object types; utilities are shortcuts so you do not rewrite shapes by
          hand.
        </p>
      </Definition>

      <Callout variant="beginner" title="Start from one base type">
        Define a full model once, then derive &quot;update payload&quot;, &quot;readonly view&quot;,
        and &quot;public DTO&quot; with utilities.
      </Callout>

      <LessonSection title="Partial, Required, Readonly">
        <Flowchart
          title="Transform a type"
          chart={`flowchart TB
  A[User] --> B[Partial — all optional]
  A --> C[Required — all required]
  A --> D[Readonly — cannot reassign]`}
        />
        <CodeBlock title="Partial — update forms">
{`type User = {
  id: string;
  name: string;
  email: string;
};

// All fields optional — perfect for PATCH-style updates
type UserUpdate = Partial<User>;

function updateUser(id: string, patch: UserUpdate) {
  console.log("update", id, patch);
}

updateUser("u1", { name: "Ada" }); // email not required`}
        </CodeBlock>
        <ContentStep number={1} title="Required">
          <p className="text-slate-300">
            Opposite of Partial — every property must be present (even ones that were optional).
          </p>
        </ContentStep>
        <CodeBlock title="Required and Readonly">
{`type Draft = {
  title?: string;
  body?: string;
};

type Published = Required<Draft>;
// { title: string; body: string }

type FrozenUser = Readonly<User>;
const u: FrozenUser = { id: "1", name: "Ada", email: "a@ex.com" };
// u.name = "Lin"; // error — readonly`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Pick, Omit, Record">
        <ContentStep number={2} title="Pick">
          <p className="text-slate-300">
            Keep only the keys you list — great for public API views.
          </p>
        </ContentStep>
        <CodeBlock title="Pick — keep only some keys">
{`type User = {
  id: string;
  name: string;
  email: string;
};

type UserPublic = Pick<User, "id" | "name">;
// { id: string; name: string }

function toPublic(user: User): UserPublic {
  return { id: user.id, name: user.name };
}`}
        </CodeBlock>
        <ContentStep number={3} title="Omit">
          <p className="text-slate-300">
            Drop keys you do not want to expose (passwords, emails, internal ids).
          </p>
        </ContentStep>
        <CodeBlock title="Omit — drop secrets">
{`type UserSafe = Omit<User, "email">;
// { id: string; name: string }

const safe: UserSafe = { id: "1", name: "Ada" };`}
        </CodeBlock>
        <Example title="Record — keyed map">
{`type Role = "admin" | "editor" | "viewer";

type Permissions = Record<Role, boolean>;

const access: Permissions = {
  admin: true,
  editor: true,
  viewer: false,
};

// access.guest = true; // error — not a Role key`}
        </Example>
        <Callout variant="tip" title="Practical pairing">
          <span className="font-mono text-sm text-web-400">Pick</span> /{' '}
          <span className="font-mono text-sm text-web-400">Omit</span> shape API responses;{' '}
          <span className="font-mono text-sm text-web-400">Record</span> types lookup tables and
          config maps.
        </Callout>
        <CodeBlock title="Compose utilities">
{`type CreateUser = Omit<User, "id">;
type UserPatch = Partial<CreateUser>;

const patch: UserPatch = { email: "new@ex.com" };`}
        </CodeBlock>
        <Callout variant="insight" title="One source of truth">
          Change <span className="font-mono text-sm text-web-400">User</span> once; derived types
          update automatically. That is the main win of utilities.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-web-400">Partial</span> / <span className="font-mono text-sm text-web-400">Required</span> / <span className="font-mono text-sm text-web-400">Readonly</span> tweak optionality and mutability.</>,
          <><span className="font-mono text-sm text-web-400">Pick</span> keeps keys; <span className="font-mono text-sm text-web-400">Omit</span> removes them.</>,
          <><span className="font-mono text-sm text-web-400">Record&lt;K, V&gt;</span> builds typed dictionaries.</>,
          <>Derive variants from one source of truth — do not duplicate shapes.</>,
        ]}
      />
    </LessonArticle>
  )
}
