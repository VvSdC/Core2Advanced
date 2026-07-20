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

export function CleaningUpResources() {
  return (
    <LessonArticle>
      <Definition term="Docker disk cleanup">
        <p>
          Images, stopped containers, unused networks, and volumes pile up. Left alone, Docker can eat
          many gigabytes of disk.
        </p>
        <p className="mt-2 text-slate-300">
          Learn to <strong className="text-white">measure</strong> with{' '}
          <span className="font-mono text-sm text-docker-400">docker system df</span>, then prune
          carefully — especially volumes.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Check disk first, prune dangling leftovers next, and treat volume prune as dangerous.
      </Callout>

      <LessonSection title="What piles up">
        <Flowchart
          title="Common leftover clutter"
          chart={`flowchart TB
  A[Daily Docker use] --> B[Stopped containers]
  A --> C[Dangling images]
  A --> D[Old tagged images]
  A --> E[Unused volumes]
  B --> F[docker container prune]
  C --> G[docker image prune]
  D --> H[image prune -a]
  E --> I[volume prune — careful!]`}
        />
        <ContentStep number={1} title="Dangling images">
          <p className="text-slate-300">
            Untagged leftovers (often <span className="font-mono text-sm text-docker-400">&lt;none&gt;</span>)
            after rebuilds. Safe first target for cleanup.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stopped containers">
          <p className="text-slate-300">
            Exit status remains until you{' '}
            <span className="font-mono text-sm text-docker-400">rm</span> them. They hold little space
            but clutter <span className="font-mono text-sm text-docker-400">docker ps -a</span>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="See what is using space">
        <CodeBlock title="Disk usage summary">
{`docker system df
docker system df -v

# Manual inventory
docker ps -a
docker images
docker volume ls
docker network ls`}
        </CodeBlock>
        <Callout variant="tip" title="Read before you delete">
          <span className="font-mono text-sm text-docker-400">df</span> shows Images, Containers,
          Local Volumes, and Build Cache. Start with the biggest row you understand.
        </Callout>
      </LessonSection>

      <LessonSection title="Safe-ish prune commands">
        <Example title="Gentle cleanup order">
{`# 1. Stopped containers only
docker container prune

# 2. Dangling images only
docker image prune

# 3. Unused networks
docker network prune

# 4. Build cache (can free a lot after many builds)
docker builder prune`}
        </Example>
        <CodeBlock title="Broader system prune">
{`# Containers + networks + dangling images + build cache
docker system prune

# Confirm prompts with y when you mean it
# Dry-run style: list first with ps/images before pruning`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Aggressive flags — know the risk">
        <CodeBlock title="Commands that delete more">
{`# ALL unused images (not just dangling) — removes unused tags
docker image prune -a

# system prune including unused images
docker system prune -a

# VOLUMES — can destroy database data forever
docker volume prune

# Nuclear (avoid until you understand):
# docker system prune -a --volumes`}
        </CodeBlock>
        <Callout variant="insight" title="Warn on -a and volumes">
          <span className="font-mono text-sm text-docker-400">-a</span> deletes unused tagged images
          you might still want tomorrow.{' '}
          <span className="font-mono text-sm text-docker-400">volume prune</span> deletes data not
          attached to a container — including DBs you forgot to remount.
        </Callout>
      </LessonSection>

      <LessonSection title="Safe cleanup habits">
        <ContentStep number={3} title="Daily / weekly rhythm">
          <CodeBlock title="Habits that keep you out of trouble">
{`# Prefer named, intentional removals
docker rm old-container
docker rmi old-image:tag

# Use --rm for one-off experiments
docker run --rm -it alpine:3.20 sh

# Before volume prune, list and inspect
docker volume ls
docker volume inspect my-important-data

# Compose: down without -v keeps named volumes
docker compose down
# Only when you really want to wipe DB:
# docker compose down -v`}
          </CodeBlock>
        </ContentStep>
        <Callout variant="tip" title="When unsure">
          Do not prune volumes. Remove specific containers and images by name instead.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Measure with <span className="font-mono text-sm text-docker-400">docker system df</span> before pruning.</>,
          <>Start with <span className="font-mono text-sm text-docker-400">container prune</span> and dangling <span className="font-mono text-sm text-docker-400">image prune</span>.</>,
          <><span className="font-mono text-sm text-docker-400">-a</span> removes unused tagged images — more aggressive.</>,
          <>Never casually run volume prune or <span className="font-mono text-sm text-docker-400">--volumes</span> if you care about data.</>,
        ]}
      />
    </LessonArticle>
  )
}
