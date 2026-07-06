import {
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ChoosingACollection() {
  return (
    <LessonArticle>
      <Definition term="Choosing a Collection">
        <p>Pick the structure that matches how you need to access and modify data.</p>
      </Definition>

      <ContentStep number={1} title="Decision guide">
        <Flowchart
          title="Which collection?"
          chart={`
flowchart TB
  A["What do you need?"]
  B{"Key-value lookup?"}
  C["dict"]
  D{"Unique items only?"}
  E["set"]
  F{"Ordered and mutable?"}
  G["list"]
  H["tuple"]

  A --> B
  B -->|Yes| C
  B -->|No| D
  D -->|Yes| E
  D -->|No| F
  F -->|Yes| G
  F -->|No| H
        `}
        />
        <ul className="mt-4 space-y-2 text-slate-300">
          <li><strong className="text-white">list</strong> — ordered sequence you will change</li>
          <li><strong className="text-white">tuple</strong> — ordered data that should not change</li>
          <li><strong className="text-white">dict</strong> — look up by key</li>
          <li><strong className="text-white">set</strong> — unique items, membership tests</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'No single best collection — match the access pattern.',
          'Lists for sequences, dicts for mappings, sets for uniqueness.',
          'Tuples when immutability matters (keys, fixed records).',
        ]}
      />
    </LessonArticle>
  )
}
