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

export function FileIo() {
  return (
    <LessonArticle>
      <Definition term="File I/O">
        <p>
          Python reads and writes files through <strong className="text-white">file objects</strong> returned by{' '}
          <code className="font-mono text-sm">open()</code>. Text mode deals with strings; binary mode deals with
          raw bytes. Always close files — <code className="font-mono text-sm">with</code> is the safe default.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Reading a file safely"
          chart={`
flowchart TB
  A["open(path, mode)"]
  B["with block"]
  C["read / write"]
  D["close on exit"]

  A --> B
  B --> C
  C --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="open() modes">
        <StepSequence
          steps={[
            {
              title: '"r" — read (default)',
              description: 'Text read. File must exist. Raises FileNotFoundError if missing.',
            },
            {
              title: '"w" — write',
              description: 'Creates or truncates file. Overwrites existing content.',
            },
            {
              title: '"a" — append',
              description: 'Writes at end. Creates file if it does not exist.',
            },
            {
              title: '"rb" / "wb" — binary',
              description: 'Bytes in/out — images, pickles, network payloads.',
            },
            {
              title: '"r+" / "w+"',
              description: 'Read and write. Know what you need before picking a mode.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="Reading files">
        <Example
          title="Common read patterns"
          caption="Assume data.txt contains two lines: hello and world"
        >{`# Entire file as one string
with open("data.txt", encoding="utf-8") as f:
    content = f.read()

# List of lines (includes \\n unless stripped)
with open("data.txt", encoding="utf-8") as f:
    lines = f.readlines()

# Memory-efficient iteration
with open("data.txt", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())`}</Example>
        <Callout variant="info">
          Always pass <code className="font-mono text-sm">encoding=&quot;utf-8&quot;</code> on text files in
          Python 3 — avoids platform-dependent defaults on Windows.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Writing files">
        <Example
          title="Write and append"
        >{`lines = ["first\\n", "second\\n"]

with open("out.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)

with open("log.txt", "a", encoding="utf-8") as f:
    f.write("new entry\\n")`}</Example>
      </ContentStep>

      <ContentStep number={5} title="pathlib — modern path handling">
        <Example
          title="Path objects instead of string paths"
        >{`from pathlib import Path

p = Path("data") / "report.txt"
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text("Hello", encoding="utf-8")
print(p.read_text(encoding="utf-8"))
print(p.suffix, p.stem, p.exists())`}</Example>
        <p>
          <code className="font-mono text-sm">pathlib.Path</code> is preferred in new code — cleaner than{' '}
          <code className="font-mono text-sm">os.path.join</code> for most tasks.
        </p>
      </ContentStep>

      <ContentStep number={6} title="JSON and CSV — interview staples">
        <Example
          title="Structured file formats"
        >{`import json
import csv

# JSON
data = {"name": "Ada", "scores": [95, 87]}
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

with open("data.json") as f:
    loaded = json.load(f)

# CSV
with open("rows.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age"])
    writer.writerow(["Ada", 30])`}</Example>
      </ContentStep>

      <ContentStep number={7} title="Common pitfalls">
        <ul className="space-y-2 text-slate-300">
          <li>Forgetting <code className="font-mono text-sm">encoding</code> on text files → mojibake on Windows.</li>
          <li>
            Reading a huge file with <code className="font-mono text-sm">read()</code> → memory blowup; iterate line
            by line instead.
          </li>
          <li>
            <code className="font-mono text-sm">"w"</code> truncates silently — use <code className="font-mono text-sm">"x"</code>{' '}
            to fail if file exists.
          </li>
          <li>Not using <code className="font-mono text-sm">with</code> → leaked file handles until GC.</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Use with open(...) as f — files close even on exceptions.',
          'Text: encoding="utf-8". Binary: "rb" / "wb" for bytes.',
          'pathlib.Path is the modern way to handle paths.',
          'json and csv modules for structured data — know dump/load vs reader/writer.',
        ]}
      />
    </LessonArticle>
  )
}
