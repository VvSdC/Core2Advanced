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

export function WhatIsDocker() {
  return (
    <LessonArticle>
      <Definition term="Docker">
        <p>
          <strong className="text-white">Docker</strong> packages an application together with
          its dependencies into a portable unit called a{' '}
          <strong className="text-white">container</strong>. That package can run the same way on
          your laptop, a teammate&apos;s machine, or a cloud server.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: Docker is a <span className="text-docker-400">shipping container for software</span>{' '}
          — everything the app needs travels inside one sealed box.
        </p>
      </Definition>

      <Callout variant="beginner" title="Who this track is for">
        Absolute beginners. You do not need prior container experience. We start with ideas, then
        type real <span className="font-mono text-sm text-docker-400">docker</span> commands.
      </Callout>

      <LessonSection title='The "works on my machine" problem'>
        <p className="text-slate-300">
          Apps often break when moved: different Python versions, missing libraries, wrong OS
          packages. &quot;It works on my machine&quot; means the environment differed — not that
          you imagined the bug.
        </p>
        <Flowchart
          title="Same app, different environments"
          chart={`flowchart TB
  A[Your laptop setup] --> B[App works]
  C[Teammate or server setup] --> D[App breaks]
  B --> E[Docker: same container everywhere]
  D --> E`}
        />
        <ContentStep number={1} title="Dependencies hide everywhere">
          <p className="text-slate-300">
            Language runtimes, system libraries, config files, and OS tools all affect whether an
            app starts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Containers freeze the recipe">
          <p className="text-slate-300">
            A container image captures the app <strong className="text-white">plus</strong> those
            pieces so others run the same recipe you tested.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What Docker gives you">
        <Example title="Mental model" caption="Ship the whole environment, not only the source">
{`Without Docker:
  "Install Node 20, Redis, and these OS packages…"

With Docker:
  "Run this image — it already includes what the app needs."`}
        </Example>
        <CodeBlock title="Commands you will meet soon">
{`docker pull nginx
docker run hello-world
docker ps
docker images`}
        </CodeBlock>
        <Callout variant="tip" title="Containers vs magic">
          Docker does not replace learning how apps work. It packages and runs them consistently —
          like a lunchbox, not a chef.
        </Callout>
      </LessonSection>

      <LessonSection title="Learning path for this Docker topic">
        <ContentStep number={1} title="Ideas first">
          <p className="text-slate-300">
            History, containers vs VMs, images vs containers, and how isolation works at a high
            level.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Architecture">
          <p className="text-slate-300">
            Client, daemon, registries (Docker Hub), and how they talk when you type a command.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hands-on">
          <p className="text-slate-300">
            Install Docker, run <span className="font-mono text-sm text-docker-400">hello-world</span>,
            then walk through a real nginx container end to end.
          </p>
        </ContentStep>
        <Callout variant="info" title="Pace yourself">
          Read one lesson, run the commands, then move on. Muscle memory beats memorizing every flag.
        </Callout>
        <Example title="Vocabulary preview">
{`image      — read-only blueprint / template
container  — running (or stopped) instance of an image
registry   — place to store and download images (e.g. Docker Hub)
daemon     — background Docker engine that does the work`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Docker packages apps and dependencies into portable containers.',
          'It attacks the "works on my machine" problem by shipping a consistent environment.',
          'Think shipping containers for software — sealed, movable, repeatable.',
          'This track builds from concepts → architecture → your first real containers.',
        ]}
      />
    </LessonArticle>
  )
}
