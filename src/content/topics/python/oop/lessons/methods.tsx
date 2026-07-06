import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Methods() {
  return (
    <LessonArticle>
      <Definition term="Methods">
        <p>
          A <strong className="text-white">method</strong> is a function defined inside a class. It describes what
          an object can <em>do</em>. Methods almost always take <code className="font-mono text-sm">self</code> as
          the first parameter so they can read and update the object's state.
        </p>
      </Definition>

      <ContentStep number={1} title="Instance methods — the default">
        <Example
          title="BankAccount with behavior"
          output={`Balance: 120`}
        >{`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

    def show_balance(self):
        print(f"Balance: {self.balance}")

acct = BankAccount("Ada", 100)
acct.deposit(50)
acct.withdraw(30)
acct.show_balance()`}</Example>
        <p>
          Notice how <code className="font-mono text-sm">deposit</code> and{' '}
          <code className="font-mono text-sm">withdraw</code> validate rules. The object protects its own data
          instead of letting outside code set <code className="font-mono text-sm">balance</code> incorrectly.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Method chaining (return self)">
        <Example
          title="Fluent interface"
          output={`Balance: 200`}
          caption="Returning self from methods allows chaining calls on one line."
        >{`class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self

    def show(self):
        print(f"Balance: {self.balance}")
        return self

BankAccount().deposit(100).deposit(100).show()`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Private-by-convention helpers">
        <p>
          Prefix internal helpers with <code className="font-mono text-sm">_</code> to signal "for internal use."
          Full encapsulation is covered in the next lesson.
        </p>
        <Example title="Internal validation method">{`class User:
    def __init__(self, email):
        self.email = self._normalize_email(email)

    def _normalize_email(self, email):
        return email.strip().lower()`}</Example>
      </ContentStep>

      <Callout variant="beginner">
        Functions defined outside classes are <strong className="text-white">functions</strong>. Functions inside
        classes are <strong className="text-white">methods</strong>. The difference is <code className="font-mono text-sm">self</code> and
        being called on an object.
      </Callout>

      <KeyTakeaways
        items={[
          'Methods are functions on objects — first param is self.',
          'Use methods to enforce rules when changing state.',
          'Return self to enable method chaining.',
          'Prefix with _ for internal helper methods.',
        ]}
      />
    </LessonArticle>
  )
}
