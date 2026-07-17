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

export function EnvironmentAndConfig() {
  return (
    <LessonArticle>
      <Definition term="Environment and config">
        <p>
          Apps need configuration: database URLs, feature flags, API keys. In Docker you pass most of
          that at <strong className="text-white">runtime</strong> with env vars — not by hard-coding
          secrets into the image.
        </p>
        <p className="mt-2 text-slate-300">
          Use <span className="font-mono text-sm text-docker-400">-e</span>,{' '}
          <span className="font-mono text-sm text-docker-400">--env-file</span>, and Compose{' '}
          <span className="font-mono text-sm text-docker-400">environment</span> /{' '}
          <span className="font-mono text-sm text-docker-400">env_file</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Bake defaults into the image if you must; inject secrets and environment-specific values when you run.
      </Callout>

      <LessonSection title="Config in the image vs at runtime">
        <Flowchart
          title="Where should settings live?"
          chart={`flowchart TB
  A[Setting] --> B{Secret or env-specific?}
  B -->|yes| C[Pass at runtime -e / env-file]
  B -->|no| D[OK as image default ENV/CMD]
  C --> E[Same image, many environments]
  D --> E`}
        />
        <ContentStep number={1} title="Image defaults (non-secret)">
          <p className="text-slate-300">
            Dockerfile <span className="font-mono text-sm text-docker-400">ENV</span> can set safe
            defaults like <span className="font-mono text-sm text-docker-400">NODE_ENV=production</span>{' '}
            or a listen port. Override later if needed.
          </p>
          <CodeBlock title="Dockerfile ENV (safe defaults only)">
{`ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Runtime overrides">
          <p className="text-slate-300">
            The same image can run in dev, staging, and prod with different{' '}
            <span className="font-mono text-sm text-docker-400">-e</span> values.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Flags: -e and --env-file">
        <Example title="Pass variables with -e">
{`docker run -d --name api -p 3000:3000 \\
  -e NODE_ENV=production \\
  -e PORT=3000 \\
  -e DATABASE_URL=postgres://user:pass@db:5432/app \\
  my-api:1.0.0

# Multiple -e flags are fine
docker run --rm -e GREETING=hello -e NAME=Ada alpine:3.20 \\
  sh -c 'echo $GREETING $NAME'`}
        </Example>
        <CodeBlock title="Load from a file with --env-file">
{`# .env.api (do NOT commit real secrets)
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@db:5432/app
LOG_LEVEL=info

docker run -d --name api -p 3000:3000 \\
  --env-file .env.api \\
  my-api:1.0.0`}
        </CodeBlock>
        <Callout variant="tip" title="File format">
          One <span className="font-mono text-sm text-docker-400">KEY=value</span> per line. No{' '}
          <span className="font-mono text-sm text-docker-400">export</span> keyword. Lines starting with{' '}
          <span className="font-mono text-sm text-docker-400">#</span> are comments.
        </Callout>
      </LessonSection>

      <LessonSection title="Compose environment">
        <CodeBlock title="environment and env_file in compose.yaml">
{`services:
  api:
    image: my-api:1.0.0
    ports:
      - "3000:3000"
    env_file:
      - .env.api
    environment:
      NODE_ENV: production
      # overrides or adds keys
      LOG_LEVEL: debug`}
        </CodeBlock>
        <CodeBlock title="Check what the container sees">
{`docker exec api printenv
docker exec api printenv DATABASE_URL
docker inspect --format '{{json .Config.Env}}' api`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Secrets caution">
        <p className="text-slate-300">
          Never <span className="font-mono text-sm text-docker-400">COPY</span> a{' '}
          <span className="font-mono text-sm text-docker-400">.env</span> with passwords into the image,
          and never put secrets in Dockerfile <span className="font-mono text-sm text-docker-400">ENV</span>{' '}
          or <span className="font-mono text-sm text-docker-400">ARG</span> that remain in layers.
        </p>
        <CodeBlock title="Do / don't">
{`# DON'T — secrets baked into image history
ENV DB_PASSWORD=supersecret
COPY .env /app/.env

# DO — inject at run / deploy time
docker run --env-file .env.api my-api:1.0.0

# DO — keep secrets out of git
# add .env* to .gitignore and .dockerignore`}
        </CodeBlock>
        <Callout variant="insight" title="Anyone with the image can dig">
          Image layers can be inspected. A secret baked in is a secret shared. Prefer runtime injection
          and, later, proper secret managers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Use <span className="font-mono text-sm text-docker-400">-e</span> and <span className="font-mono text-sm text-docker-400">--env-file</span> for runtime config.</>,
          <>Same image, different env vars = different environments.</>,
          <>Safe defaults may live in the image; secrets must not.</>,
          <>Add <span className="font-mono text-sm text-docker-400">.env</span> to <span className="font-mono text-sm text-docker-400">.dockerignore</span> and never commit real secrets.</>,
        ]}
      />
    </LessonArticle>
  )
}
