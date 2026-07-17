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
} from '../../../../components/content'

export function PuttingItTogetherDocker() {
  return (
    <LessonArticle>
      <Definition term="Docker mastery checklist">
        <p>
          You now connect the path: <strong className="text-white">concepts</strong> →{' '}
          <strong className="text-white">architecture</strong> (image/container/network/volume) →{' '}
          <strong className="text-white">Dockerfile</strong> → <strong className="text-white">run</strong> →{' '}
          <strong className="text-white">Compose</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a final map — use it to self-check before you move on to harder topics.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to use this page">
        Skim the checklist. Anything fuzzy → revisit that lesson and run the commands once on a practice
        project.
      </Callout>

      <LessonSection title="Mastery checklist">
        <Flowchart
          title="Concepts → Compose"
          chart={`flowchart TB
  A[Concepts: image vs container] --> B[Architecture: net + volume]
  B --> C[Dockerfile: FROM…CMD]
  C --> D[build -t / run / logs]
  D --> E[compose up stack]
  E --> F[Clean up safely]`}
        />
        <ContentStep number={1} title="Concepts">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Image = blueprint; container = running instance</li>
            <li>
              Registry holds images; <span className="font-mono text-sm text-docker-400">pull</span> /
              <span className="font-mono text-sm text-docker-400"> push</span> move them
            </li>
            <li>Containers are processes with isolated filesystems</li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="Architecture">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>User networks + DNS by container/service name</li>
            <li>
              <span className="font-mono text-sm text-docker-400">-p host:container</span> for host access
            </li>
            <li>Named volumes keep DB data across recreates</li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="Dockerfile">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <span className="font-mono text-sm text-docker-400">FROM</span>,{' '}
              <span className="font-mono text-sm text-docker-400">WORKDIR</span>,{' '}
              <span className="font-mono text-sm text-docker-400">COPY</span>,{' '}
              <span className="font-mono text-sm text-docker-400">RUN</span>,{' '}
              <span className="font-mono text-sm text-docker-400">EXPOSE</span>,{' '}
              <span className="font-mono text-sm text-docker-400">CMD</span>
            </li>
            <li>CMD vs ENTRYPOINT: default command vs fixed binary</li>
            <li>
              Always ship a <span className="font-mono text-sm text-docker-400">.dockerignore</span>
            </li>
          </ul>
        </ContentStep>
        <ContentStep number={4} title="Run and debug">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <span className="font-mono text-sm text-docker-400">run -d --name -p -e</span>
            </li>
            <li>
              Debug: <span className="font-mono text-sm text-docker-400">logs -f</span> →{' '}
              <span className="font-mono text-sm text-docker-400">exec -it</span> →{' '}
              <span className="font-mono text-sm text-docker-400">inspect</span>
            </li>
            <li>Do not bake secrets into images</li>
          </ul>
        </ContentStep>
        <ContentStep number={5} title="Compose">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>services / ports / volumes in one YAML</li>
            <li>
              <span className="font-mono text-sm text-docker-400">up -d</span>,{' '}
              <span className="font-mono text-sm text-docker-400">ps</span>,{' '}
              <span className="font-mono text-sm text-docker-400">logs</span>,{' '}
              <span className="font-mono text-sm text-docker-400">down</span>
            </li>
            <li>
              Avoid casual <span className="font-mono text-sm text-docker-400">down -v</span>
            </li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common beginner mistakes">
        <Example title="Mistakes and safer habits">
{`# Mistake: expect EXPOSE to publish a port
# Better: docker run -p 8080:80 ...

# Mistake: data in container, then docker rm
# Better: -v named_volume:/data

# Mistake: hard-code passwords in Dockerfile
# Better: --env-file / Compose env at runtime

# Mistake: docker volume prune without checking
# Better: volume ls + inspect first

# Mistake: rely on default bridge DNS for apps
# Better: docker network create / Compose network

# Mistake: debug only by rebuilding forever
# Better: logs -f + exec -it before changing the image`}
        </Example>
        <Callout variant="insight" title="Status habit beats memory">
          You do not need every flag memorized. Read{' '}
          <span className="font-mono text-sm text-docker-400">docker ps -a</span> and{' '}
          <span className="font-mono text-sm text-docker-400">logs</span>, then respond calmly.
        </Callout>
      </LessonSection>

      <LessonSection title="One practice drill">
        <CodeBlock title="30-minute sandbox">
{`mkdir docker-practice && cd docker-practice
# add a tiny Dockerfile + compose.yaml (web + db)
docker compose up -d --build
docker compose ps
docker compose logs -f web
docker compose exec web sh
# exit
docker compose down
# confirm volume still listed if you used a named volume
docker volume ls`}
        </CodeBlock>
        <p className="text-slate-300">
          Then practice a single-container path: build -t, run -d -p, logs, exec, stop, rm, and a gentle
          image prune.
        </p>
      </LessonSection>

      <LessonSection title="You are ready when…">
        <Callout variant="tip" title="Self-check">
          You can explain image vs container, write a minimal Dockerfile, publish a port, persist a
          volume, wire two services on a network or Compose file, and clean disk without deleting DB
          data by accident.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Path: concepts → architecture → Dockerfile → run/debug → Compose.</>,
          <>Publish with -p; persist with volumes; connect with user networks or Compose.</>,
          <>Debug with logs and exec before endless rebuilds.</>,
          <>Never bake secrets into images; prune volumes only on purpose.</>,
          <>When unsure: ps -a → logs → exec → inspect.</>,
        ]}
      />
    </LessonArticle>
  )
}
