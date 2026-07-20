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

export function EssentialCommandsCheatsheet() {
  return (
    <LessonArticle>
      <Definition term="Docker daily cheat sheet">
        <p>
          Keep this page as a <strong className="text-white">one-screen mental model</strong>: images,
          containers, networks, volumes, and Compose — the commands you type most days.
        </p>
        <p className="mt-2 text-slate-300">
          You do not need every flag memorized. You need the right family of commands and when to open
          logs.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to use this">
        Skim the tables. Practice the bold path: pull/build → run → logs/exec → compose up/down.
      </Callout>

      <LessonSection title="One-page mental model">
        <Flowchart
          title="Daily Docker loop"
          chart={`flowchart TB
  A[Image: pull or build] --> B[Run container]
  B --> C[logs / exec / inspect]
  C --> D{Multi-service?}
  D -->|yes| E[compose up / logs / down]
  D -->|no| F[stop / rm / prune as needed]`}
        />
      </LessonSection>

      <LessonSection title="Images">
        <CodeBlock title="Image commands">
{`Command                         Purpose
-------                         -------
docker pull nginx:1.27          Download image
docker images / image ls        List local images
docker build -t app:1.0 .       Build from Dockerfile
docker tag app:1.0 user/app:1.0 Rename for registry
docker push user/app:1.0        Upload (after login)
docker rmi app:1.0              Remove image
docker image inspect app:1.0    JSON details
docker history app:1.0          Layer history
docker image prune              Remove dangling`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Containers">
        <CodeBlock title="Container commands">
{`Command                              Purpose
-------                              -------
docker run -d --name web -p 8080:80  Create + start
docker ps / ps -a                    List running / all
docker start|stop|restart web        Lifecycle
docker kill web                      Force stop
docker rm web / rm -f web            Remove / force
docker rename web web2               Rename
docker logs -f web                   Follow logs
docker exec -it web sh               Shell inside
docker inspect web                   Full config JSON
docker top web                       Processes
docker attach web                    Attach main process`}
        </CodeBlock>
        <ContentStep number={1} title="Run flags to remember">
          <CodeBlock title="Common run flags">
{`-d            background
-p 8080:80    publish ports
--name web    name
-e KEY=val    env var
--env-file f  env file
--rm          auto-delete on exit
-v vol:/path  volume
--network net custom network
-it           interactive TTY`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Networks and volumes">
        <CodeBlock title="Network commands">
{`docker network ls
docker network create appnet
docker network inspect appnet
docker network connect appnet web
docker network disconnect appnet web
docker network rm appnet
docker network prune`}
        </CodeBlock>
        <CodeBlock title="Volume commands">
{`docker volume create pgdata
docker volume ls
docker volume inspect pgdata
docker volume rm pgdata
docker volume prune          # DANGEROUS to data

# Mount examples
docker run -v pgdata:/var/lib/postgresql/data ...
docker run -v "$PWD":/app -w /app ...`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Compose">
        <CodeBlock title="Compose commands">
{`docker compose up -d
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose logs -f web
docker compose exec web sh
docker compose restart web
docker compose down
docker compose down -v       # also delete volumes
docker compose config`}
        </CodeBlock>
        <Example title="Tiny daily session">
{`docker compose up -d --build
docker compose ps
docker compose logs -f api
# ... fix code ...
docker compose up -d --build
docker compose down`}
        </Example>
      </LessonSection>

      <LessonSection title="Cleanup snapshot">
        <CodeBlock title="Disk and prune">
{`docker system df
docker container prune
docker image prune
docker system prune
docker image prune -a        # aggressive
docker volume prune          # careful!`}
        </CodeBlock>
        <Callout variant="tip" title="Print this path">
          Stuck? <span className="font-mono text-sm text-docker-400">ps -a</span> →{' '}
          <span className="font-mono text-sm text-docker-400">logs</span> →{' '}
          <span className="font-mono text-sm text-docker-400">exec</span> → fix → rerun or{' '}
          <span className="font-mono text-sm text-docker-400">compose up --build</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Images: pull, build -t, tag, push, rmi, prune.</>,
          <>Containers: run, ps, start/stop, logs, exec, rm.</>,
          <>Networks + volumes connect and persist; Compose orchestrates stacks.</>,
          <>Measure with system df; prune volumes only when you mean it.</>,
        ]}
      />
    </LessonArticle>
  )
}
