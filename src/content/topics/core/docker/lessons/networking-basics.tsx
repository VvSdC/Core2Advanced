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
} from '../../../../../components/content'

export function NetworkingBasics() {
  return (
    <LessonArticle>
      <Definition term="Docker networking">
        <p>
          Containers talk to each other and to your machine over <strong className="text-white">networks</strong>.
          By default, Docker attaches containers to a <strong className="text-white">bridge</strong>{' '}
          network so they can reach the internet and (with care) each other.
        </p>
        <p className="mt-2 text-slate-300">
          Publishing ports with <span className="font-mono text-sm text-docker-400">-p</span> makes a
          container port reachable from your host browser or API client.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Use a user-defined network so containers find each other by name; use{' '}
        <span className="font-mono text-sm text-docker-400">-p</span> to reach them from your laptop.
      </Callout>

      <LessonSection title="Default bridge and listing networks">
        <Flowchart
          title="Host ↔ container networking"
          chart={`flowchart TB
  A[Your laptop] -->|docker run -p 8080:80| B[Host port 8080]
  B --> C[Container port 80]
  D[User network] --> E[web]
  D --> F[db]
  E -->|DNS name db| F`}
        />
        <CodeBlock title="List and inspect networks">
{`docker network ls
docker network inspect bridge

# See which containers are attached
docker network inspect bridge --format '{{json .Containers}}'`}
        </CodeBlock>
        <Callout variant="insight" title="Default bridge limitation">
          On the default <span className="font-mono text-sm text-docker-400">bridge</span>, automatic
          DNS by container name is limited. Prefer a{' '}
          <strong className="text-white">user-defined</strong> network for multi-container apps.
        </Callout>
      </LessonSection>

      <LessonSection title="Create a user-defined network">
        <ContentStep number={1} title="Create and attach">
          <Example title="Network create + run">
{`docker network create appnet

docker run -d --name db --network appnet \\
  -e POSTGRES_PASSWORD=secret \\
  postgres:16

docker run -d --name api --network appnet \\
  -p 3000:3000 \\
  -e DATABASE_URL=postgres://postgres:secret@db:5432/postgres \\
  my-api:1.0.0`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="DNS by container name">
          <p className="text-slate-300">
            On <span className="font-mono text-sm text-docker-400">appnet</span>, the API can reach
            Postgres at hostname <span className="font-mono text-sm text-docker-400">db</span> — the
            container name becomes a DNS name. No hard-coded IPs needed.
          </p>
          <CodeBlock title="Test DNS from another container">
{`docker run --rm --network appnet alpine:3.20 ping -c 3 db
docker run --rm --network appnet alpine:3.20 nslookup db`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Port publishing: -p host:container">
        <p className="text-slate-300">
          Format is <span className="font-mono text-sm text-docker-400">hostPort:containerPort</span>.
          Your browser hits the host port; Docker forwards into the container.
        </p>
        <CodeBlock title="Common -p patterns">
{`# Host 8080 → container 80
docker run -d --name web -p 8080:80 nginx:1.27

# Same number both sides
docker run -d --name api -p 3000:3000 my-api:1.0.0

# Bind only to localhost (safer on shared machines)
docker run -d --name web2 -p 127.0.0.1:8080:80 nginx:1.27

# Check what is published
docker ps --format "table {{.Names}}\t{{.Ports}}"
docker port web`}
        </CodeBlock>
        <Callout variant="tip" title="EXPOSE is not publish">
          <span className="font-mono text-sm text-docker-400">EXPOSE</span> in a Dockerfile documents
          intent. <span className="font-mono text-sm text-docker-400">-p</span> actually opens the host
          mapping.
        </Callout>
      </LessonSection>

      <LessonSection title="Connect and clean up">
        <CodeBlock title="Attach later / remove networks">
{`# Connect a running container to a network
docker network connect appnet web
docker network disconnect appnet web

# Remove network (containers must be disconnected)
docker network rm appnet
docker network prune`}
        </CodeBlock>
        <Example title="Tiny two-service mental model">
{`# 1. docker network create appnet
# 2. run db on appnet (no -p unless you need host access)
# 3. run api on appnet with -p for your browser
# 4. api uses hostname "db" in its connection string`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Default network is <span className="font-mono text-sm text-docker-400">bridge</span>; list with <span className="font-mono text-sm text-docker-400">docker network ls</span>.</>,
          <>Create user networks with <span className="font-mono text-sm text-docker-400">docker network create</span> and attach via <span className="font-mono text-sm text-docker-400">--network</span>.</>,
          <>On user networks, containers resolve each other by name.</>,
          <><span className="font-mono text-sm text-docker-400">-p host:container</span> publishes ports to your machine.</>,
        ]}
      />
    </LessonArticle>
  )
}
