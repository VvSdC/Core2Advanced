import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Comprehensions() {
  return (
    <LessonArticle>
      <Definition term="Comprehensions Deep Dive">
        <p>
          Comprehensions build collections from a single expression — lists, dicts, and sets each have their own
          syntax with optional filtering.
        </p>
      </Definition>

      <ContentStep number={1} title="All three forms">
        <Example
          title="List, dict, and set comprehensions"
          output={`[0, 2, 4]
{'a': 1, 'b': 2, 'c': 3}
{'PYTHON', 'JAVA'}`}
        >{`evens = [x for x in range(6) if x % 2 == 0]

word_lens = {ch: ord(ch) - 96 for ch in "abc"}

tags = {"python", "Python", "java"}
lower_tags = {t.lower() for t in tags}
print(evens)
print(word_lens)
print(lower_tags)`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'List: [expr for x in it if cond]',
          'Dict: {k: v for ...}',
          'Set: {expr for ...}',
          'Keep comprehensions readable — complex logic belongs in a loop.',
        ]}
      />
    </LessonArticle>
  )
}
