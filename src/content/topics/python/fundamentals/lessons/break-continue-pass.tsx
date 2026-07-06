import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BreakContinuePass() {
  return (
    <LessonArticle>
      <Definition term="break, continue, pass">
        <p>
          <code className="font-mono text-sm">break</code> exits a loop early.{' '}
          <code className="font-mono text-sm">continue</code> skips to the next iteration.{' '}
          <code className="font-mono text-sm">pass</code> does nothing — a placeholder where syntax requires a
          statement.
        </p>
      </Definition>

      <ContentStep number={1} title="break and continue">
        <Example
          title="Find first even number"
          output={`2`}
        >{`for n in [1, 2, 3, 4, 5]:
    if n % 2 != 0:
        continue
    print(n)
    break`}</Example>
      </ContentStep>

      <ContentStep number={2} title="pass">
        <Example title="Stub for later">{`def process_data(data):
    pass   # TODO: implement later`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'break leaves the innermost loop immediately.',
          'continue skips the rest of the current iteration.',
          'pass is a no-op for empty blocks.',
        ]}
      />
    </LessonArticle>
  )
}
