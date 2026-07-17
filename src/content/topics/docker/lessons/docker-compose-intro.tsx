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

export function DockerComposeIntro() {
  return (
    <LessonArticle>
      <Definition term="Docker Compose">
        <p>
          <strong className="text-white">Compose</strong> lets you describe a multi-container app in
          one YAML file — web, database, cache — and start or stop everything together.
        </p>
        <p className="mt-2 text-slate-300">
          Instead of typing many long <span className="font-mono text-sm text-docker-400">docker run</span>{' '}
          commands, you declare services once and run{' '}
          <span className="font-mono text-sm text-docker-400">docker compose up</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        One <span className="font-mono text-sm text-docker-400">compose.yaml</span> = many services;
        up starts them, down stops and cleans them.
      </Callout>

      <LessonSection title="Mental model: services, ports, volumes">
        <Flowchart
          title="Compose file → running stack"
          chart={`flowchart TB
  A[compose.yaml] --> B[services]
  B --> C[web]
  B --> D[db]
  C --> E[ports]
  D --> F[volumes]
  A --> G[docker compose up]
  G --> H[Running stack]`}
        />
        <ContentStep number={1} title="Services">
          <p className="text-slate-300">
            Each service is roughly one container definition: image or build, env, ports, volumes,
            and which network it joins (Compose creates a project network for you).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ports and volumes">
          <p className="text-slate-300">
            Same ideas as <span className="font-mono text-sm text-docker-400">-p</span> and{' '}
            <span className="font-mono text-sm text-docker-400">-v</span>, written in YAML under each
            service.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Simple web + db example">
        <Example title="compose.yaml (conceptual)" caption="Save next to your app; names may be compose.yml">
{`services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}
        </Example>
        <Callout variant="insight" title="Hostname is the service name">
          Inside the Compose network, <span className="font-mono text-sm text-docker-400">web</span>{' '}
          reaches Postgres at host <span className="font-mono text-sm text-docker-400">db</span> — the
          service key in the YAML.
        </Callout>
      </LessonSection>

      <LessonSection title="Everyday Compose commands">
        <CodeBlock title="up, down, ps, logs">
{`# Start in foreground (Ctrl+C stops)
docker compose up

# Start detached
docker compose up -d

# Rebuild images then start
docker compose up -d --build

# Status of this project's containers
docker compose ps

# Logs (all services or one)
docker compose logs
docker compose logs -f web
docker compose logs --tail 100 db

# Stop and remove containers (keeps named volumes by default)
docker compose down

# Also remove volumes declared in the file (destroys DB data!)
docker compose down -v`}
        </CodeBlock>
        <CodeBlock title="Handy extras">
{`docker compose build
docker compose pull
docker compose restart web
docker compose exec web sh
docker compose config    # validate / print resolved YAML`}
        </CodeBlock>
        <Callout variant="tip" title="Project directory matters">
          Run Compose commands from the folder that contains{' '}
          <span className="font-mono text-sm text-docker-400">compose.yaml</span> (or pass{' '}
          <span className="font-mono text-sm text-docker-400">-f</span> to point at the file).
        </Callout>
      </LessonSection>

      <LessonSection title="From docker run to Compose">
        <CodeBlock title="Same idea, less typing">
{`# Old style (many commands)
docker network create appnet
docker run -d --name db --network appnet ...
docker run -d --name web --network appnet -p 3000:3000 ...

# Compose style
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Compose defines multi-container apps in YAML (services, ports, volumes).</>,
          <><span className="font-mono text-sm text-docker-400">docker compose up -d</span> starts the stack; <span className="font-mono text-sm text-docker-400">down</span> tears it down.</>,
          <>Use <span className="font-mono text-sm text-docker-400">ps</span> and <span className="font-mono text-sm text-docker-400">logs</span> for status and debugging.</>,
          <>Service names become DNS hostnames between containers.</>,
        ]}
      />
    </LessonArticle>
  )
}
