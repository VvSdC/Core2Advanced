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

export function VolumesAndPersistentData() {
  return (
    <LessonArticle>
      <Definition term="Volumes and mounts">
        <p>
          By default, files written inside a container live in the container&apos;s writable layer. When
          you <strong className="text-white">remove</strong> the container, that data is gone.
        </p>
        <p className="mt-2 text-slate-300">
          <strong className="text-white">Volumes</strong> and <strong className="text-white">bind mounts</strong>{' '}
          attach storage that survives container restarts and removals.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Without a volume, container data dies with the container. Mount storage to keep databases and uploads.
      </Callout>

      <LessonSection title="Why data disappears">
        <Flowchart
          title="Ephemeral vs persistent"
          chart={`flowchart TB
  A[Container writes files] --> B{Mounted volume?}
  B -->|no| C[Data in container layer]
  C --> D[docker rm]
  D --> E[Data gone]
  B -->|yes| F[Data on volume / host]
  F --> G[docker rm]
  G --> H[Data still there]`}
        />
        <Example title="Prove it once" caption="Practice only — then clean up">
{`docker run --name tmp-data alpine:3.20 sh -c "echo hello > /data.txt && cat /data.txt"
docker rm tmp-data
# The file lived only inside that container — it is gone now`}
        </Example>
      </LessonSection>

      <LessonSection title="Named volumes vs bind mounts">
        <ContentStep number={1} title="Named volume (Docker-managed)">
          <p className="text-slate-300">
            Docker stores the data in its own area. Great for databases and production-like persistence.
            You refer by volume <strong className="text-white">name</strong>, not a host path.
          </p>
          <CodeBlock title="Named volume syntax">
{`docker volume create pgdata
docker run -d --name db \\
  -e POSTGRES_PASSWORD=secret \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Bind mount (host folder)">
          <p className="text-slate-300">
            Maps a <strong className="text-white">host path</strong> into the container. Great for live
            code editing during development.
          </p>
          <CodeBlock title="Bind mount syntax">
{`# Linux/macOS
docker run --rm -v "$PWD":/app -w /app node:20-alpine node index.js

# Windows PowerShell (example)
docker run --rm -v \${PWD}:/app -w /app node:20-alpine node index.js`}
          </CodeBlock>
        </ContentStep>
        <Callout variant="insight" title="Which should beginners use?">
          Databases → <strong className="text-white">named volumes</strong>. Editing code on your laptop
          → <strong className="text-white">bind mounts</strong>.
        </Callout>
      </LessonSection>

      <LessonSection title="Volume commands">
        <CodeBlock title="Create, list, inspect, remove">
{`docker volume create app-data
docker volume ls
docker volume inspect app-data

# Remove unused volumes (careful)
docker volume rm app-data
docker volume prune`}
        </CodeBlock>
        <CodeBlock title="Run with -v / --mount">
{`# Short -v form: name:container_path
docker run -d --name web \\
  -v app-data:/usr/share/nginx/html \\
  nginx:1.27

# Read-only mount
docker run --rm -v app-data:/data:ro alpine:3.20 ls /data

# Explicit --mount (clearer for complex cases)
docker run -d --name web2 \\
  --mount type=volume,source=app-data,target=/usr/share/nginx/html \\
  nginx:1.27`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Survive recreate">
        <p className="text-slate-300">
          Stop and remove the container, then start a new one with the{' '}
          <strong className="text-white">same volume name</strong> — your data returns.
        </p>
        <Example title="Recreate container, keep data">
{`docker stop db
docker rm db
docker run -d --name db \\
  -e POSTGRES_PASSWORD=secret \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16
# pgdata still holds the database files`}
        </Example>
        <Callout variant="tip" title="Prune warning">
          <span className="font-mono text-sm text-docker-400">docker volume prune</span> deletes
          volumes not used by any container. Do not run it if you still need orphaned DB data.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Container filesystem is temporary unless you mount storage.</>,
          <>Named volumes = Docker-managed; bind mounts = host folders.</>,
          <>Use <span className="font-mono text-sm text-docker-400">docker volume create/ls</span> and <span className="font-mono text-sm text-docker-400">docker run -v</span>.</>,
          <>Same volume name on a new container = data persistence.</>,
        ]}
      />
    </LessonArticle>
  )
}
