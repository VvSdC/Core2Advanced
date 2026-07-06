import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function Encapsulation() {
  return (
    <LessonArticle>
      <Definition term="Encapsulation">
        <p>
          <strong className="text-white">Encapsulation</strong> means bundling data and the methods that operate on
          it together, and controlling who can access what. The object is responsible for its own consistency —
          outside code should not freely corrupt internal state.
        </p>
        <p>
          Languages like Java have <code className="font-mono text-sm">public</code>,{' '}
          <code className="font-mono text-sm">protected</code>, and{' '}
          <code className="font-mono text-sm">private</code> keywords. Python does not — it uses{' '}
          <strong className="text-white">naming conventions</strong> instead. Same idea, softer enforcement.
        </p>
      </Definition>

      <Callout variant="beginner" title="Real-world analogy">
        A ATM machine encapsulates banking logic. You press "Withdraw $50" — you do not reach into the vault and
        move cash yourself. The interface is simple; the internals are hidden.
      </Callout>

      <ContentStep number={1} title="Public, protected, and private in Python">
        <p>
          Python has no access modifiers that block code at compile time. Instead, developers agree on what the
          leading underscores mean:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Style</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 font-mono text-slate-200">name</td>
                <td className="px-4 py-3 text-white">Public</td>
                <td className="px-4 py-3">Part of the public API. Anyone can read and write.</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 font-mono text-slate-200">_name</td>
                <td className="px-4 py-3 text-white">Protected (by convention)</td>
                <td className="px-4 py-3">Internal use. Subclasses may use it. Still accessible from outside — a hint, not a lock.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-slate-200">__name</td>
                <td className="px-4 py-3 text-white">Private (name mangling)</td>
                <td className="px-4 py-3">Python renames to <code className="font-mono text-sm">_ClassName__name</code>. Harder to access accidentally — not true security.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          In Java, <code className="font-mono text-sm">private</code> is enforced by the compiler. In Python, you
          can still reach "private" data if you try hard enough. Python trusts you to respect conventions.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="Public — the default">
        <Example
          title="Anyone can access public attributes"
          output={`Ada
100`}
        >{`class Player:
    def __init__(self, name):
        self.name = name      # public
        self.health = 100     # public

p = Player("Ada")
print(p.name)
p.health = 50
print(p.health)`}</Example>
        <p>
          No underscore means public. Fine for simple data. Risky for fields that need validation (balance,
          health) — prefer methods or <code className="font-mono text-sm">@property</code> for those.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Protected — single underscore _">
        <Example
          title="Signal: internal, not for outside callers"
          output={`100`}
          caption="_health is still reachable as p._health — the underscore is a warning, not a wall."
        >{`class Player:
    def __init__(self, name):
        self.name = name
        self._health = 100    # protected by convention

    def take_damage(self, amount):
        self._health = max(0, self._health - amount)

    def is_alive(self):
        return self._health > 0

p = Player("Ada")
p.take_damage(30)
print(p._health)   # works, but you should not rely on this`}</Example>
        <StepSequence
          steps={[
            {
              title: 'When to use _',
              description: 'Internal helpers, storage behind @property, fields subclasses might need in inheritance.',
            },
            {
              title: 'Who should access _attrs',
              description: 'The class itself, its methods, and sometimes child classes. External code should use public methods.',
            },
            {
              title: 'from module import *',
              description: 'Names starting with _ are not imported by star-import — one place Python actually enforces the convention.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={4} title="Private — double underscore __">
        <Example
          title="Name mangling in action"
          output={`42
AttributeError if accessing w.__pin from outside`}
        >{`class BankAccount:
    def __init__(self, pin):
        self.__pin = pin        # "private" — mangled to _BankAccount__pin
        self._balance = 0       # protected

    def verify(self, entered):
        return entered == self.__pin

acct = BankAccount(1234)
print(acct.verify(1234))
# print(acct.__pin)           # AttributeError
# print(acct._BankAccount__pin)  # still possible — not encryption!`}</Example>
        <p>
          Python renames <code className="font-mono text-sm">__pin</code> to{' '}
          <code className="font-mono text-sm">_BankAccount__pin</code> so subclasses do not accidentally override it.
          Use <code className="font-mono text-sm">__</code> when you want to avoid name clashes in inheritance, not
          for hiding secrets.
        </p>
      </ContentStep>

      <ContentStep number={5} title="Properties — the Pythonic way to control access">
        <p>
          Instead of public fields or raw <code className="font-mono text-sm">__private</code> attrs, many Python
          developers use a <strong className="text-white">public property</strong> backed by a{' '}
          <strong className="text-white">protected</strong> <code className="font-mono text-sm">_field</code>:
        </p>
        <Example
          title="Validated temperature"
          output={`25
ValueError on -300`}
        >{`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

t = Temperature(25)
print(t.celsius)
# t.celsius = -300  # ValueError`}</Example>
        <p>
          Outside code sees <code className="font-mono text-sm">celsius</code> (public). Inside,{' '}
          <code className="font-mono text-sm">_celsius</code> (protected) holds the real value with validation.
        </p>
      </ContentStep>

      <ContentStep number={6} title="Putting it together — BankAccount">
        <Example
          title="Public API, protected storage"
          output={`Balance: 150`}
        >{`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner           # public
        self._balance = balance      # protected

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Positive amount only")
        self._balance += amount

    def get_balance(self):
        return self._balance

acct = BankAccount("Ada", 100)
acct.deposit(50)
print(f"Balance: {acct.get_balance()}")`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Python has no public/protected/private keywords — underscores convey intent.',
          'Public: name — open API. Protected: _name — internal convention. Private: __name — name mangling.',
          'Underscores are not security — they are signals to other developers.',
          'Use @property + _field for validated, controlled access — the idiomatic Python pattern.',
        ]}
      />
    </LessonArticle>
  )
}
