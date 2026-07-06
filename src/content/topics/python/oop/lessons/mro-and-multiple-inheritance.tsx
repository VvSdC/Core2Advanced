import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function MroAndMultipleInheritance() {
  return (
    <LessonArticle>
      <Definition term="MRO & Multiple Inheritance">
        <p>
          When a class inherits from multiple parents, Python uses the{' '}
          <strong className="text-white">Method Resolution Order (MRO)</strong> — C3 linearization — to decide
          which method runs. The <strong className="text-white">diamond problem</strong> is when two parents share
          a grandparent.
        </p>
      </Definition>

      <ContentStep number={1} title="The diamond problem">
        <Flowchart
          title="Diamond inheritance"
          chart={`
flowchart TB
  A["Base"]
  B["Left(Base)"]
  C["Right(Base)"]
  D["Child(Left, Right)"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <p>Which <code className="font-mono text-sm">Base.__init__</code> does <code className="font-mono text-sm">Child()</code> call?</p>
      </ContentStep>

      <ContentStep number={2} title="Inspecting MRO">
        <Example
          title="Child.mro() or Child.__mro__"
          output={`[<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>]`}
        >{`class A:
    def greet(self):
        return "A"

class B(A):
    def greet(self):
        return "B"

class C(A):
    def greet(self):
        return "C"

class D(B, C):
    pass

print(D.mro())
print(D().greet())   # "B" — left parent wins`}</Example>
      </ContentStep>

      <ContentStep number={3} title="super() follows MRO">
        <Example
          title="super calls next in MRO chain"
        >{`class A:
    def __init__(self):
        print("A")

class B(A):
    def __init__(self):
        print("B")
        super().__init__()

class C(A):
    def __init__(self):
        print("C")
        super().__init__()

class D(B, C):
    def __init__(self):
        print("D")
        super().__init__()

D()   # D, B, C, A — each super() follows MRO`}</Example>
        <p><code className="font-mono text-sm">super()</code> is not "call parent" — it calls the <em>next</em> class in MRO.</p>
      </ContentStep>

      <ContentStep number={4} title="Interview guidance">
        <Callout variant="insight">
          Prefer composition over deep multiple inheritance. If you must use it, keep hierarchies shallow, always
          use <code className="font-mono text-sm">super()</code> cooperatively, and verify with{' '}
          <code className="font-mono text-sm">ClassName.mro()</code>.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'MRO defines method lookup order — C3 linearization.',
          'Diamond problem: shared ancestor reached once in MRO.',
          'super() calls next class in MRO, not necessarily direct parent.',
          'Left-to-right base order matters: class D(B, C) vs D(C, B).',
        ]}
      />
    </LessonArticle>
  )
}
