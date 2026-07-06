import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Dictionaries() {
  return (
    <LessonArticle>
      <Definition term="Dictionaries">
        <p>
          A <strong className="text-white">dictionary</strong> maps unique <strong className="text-white">keys</strong> to
          <strong className="text-white"> values</strong>. Look up by key in constant time on average — ideal for
          configs, caches, counting, and JSON-like data.
        </p>
      </Definition>

      <ContentStep number={1} title="Creating and accessing">
        <Example
          title="Dict operations"
          output={`Ada
30
30
['name', 'age', 'lang']`}
        >{`user = {"name": "Ada", "age": 30, "lang": "Python"}

print(user["name"])
print(user.get("age"))
print(user.get("email", "unknown"))

user["email"] = "ada@example.com"
print(list(user.keys()))`}</Example>
        <Callout variant="beginner">
          <code className="font-mono text-sm">d[key]</code> raises KeyError if missing.{' '}
          <code className="font-mono text-sm">d.get(key, default)</code> does not.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="Iterating dicts">
        <Example
          title="items(), keys(), values()"
          output={`name: Ada
age: 30`}
        >{`user = {"name": "Ada", "age": 30}
for key, value in user.items():
    print(f"{key}: {value}")`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Keys must be hashable — strings, numbers, tuples (not lists).',
          'Use .get() for safe lookups with defaults.',
          'items() loops over key-value pairs.',
        ]}
      />
    </LessonArticle>
  )
}
