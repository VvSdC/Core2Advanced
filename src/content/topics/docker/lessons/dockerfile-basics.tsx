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

export function DockerfileBasics() {
  return (
    <LessonArticle>
      <Definition term="Dockerfile">
        <p>
          A <strong className="text-white">Dockerfile</strong> is a plain text recipe that tells Docker
          how to build an image: base OS/runtime, files to copy, packages to install, and the command
          to run.
        </p>
        <p className="mt-2 text-slate-300">
          You write instructions like <span className="font-mono text-sm text-docker-400">FROM</span>,{' '}
          <span className="font-mono text-sm text-docker-400">COPY</span>, and{' '}
          <span className="font-mono text-sm text-docker-400">CMD</span>;{' '}
          <span className="font-mono text-sm text-docker-400">docker build</span> turns them into an image.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Dockerfile = build instructions; image = result; container = running instance of that image.
      </Callout>

      <LessonSection title="Mental model">
        <Flowchart
          title="From Dockerfile to container"
          chart={`flowchart TB
  A[Dockerfile] --> B[docker build]
  B --> C[Image]
  C --> D[docker run]
  D --> E[Container]`}
        />
      </LessonSection>

      <LessonSection title="Core instructions">
        <ContentStep number={1} title="FROM — start from a base image">
          <p className="text-slate-300">
            Every Dockerfile starts with <span className="font-mono text-sm text-docker-400">FROM</span>.
            Pick a known runtime (Node, Python, nginx) and prefer slim/alpine tags when you can.
          </p>
          <CodeBlock title="Base image">{`FROM node:20-alpine
# or
FROM python:3.12-slim`}</CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="WORKDIR — set the working directory">
          <p className="text-slate-300">
            Like <span className="font-mono text-sm text-docker-400">cd</span> for later commands. Docker
            creates the folder if it does not exist.
          </p>
          <CodeBlock title="Working directory">{`WORKDIR /app`}</CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="COPY — bring your files in">
          <CodeBlock title="Copy app source">{`COPY package.json package-lock.json ./
COPY . .`}</CodeBlock>
        </ContentStep>
        <ContentStep number={4} title="RUN — install during build">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-docker-400">RUN</span> executes at{' '}
            <strong className="text-white">build</strong> time and creates a new image layer.
          </p>
          <CodeBlock title="Install dependencies">{`RUN npm ci
# or for Python
RUN pip install --no-cache-dir -r requirements.txt`}</CodeBlock>
        </ContentStep>
        <ContentStep number={5} title="EXPOSE — document a port">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-docker-400">EXPOSE</span> is documentation for
            humans and tools. You still need{' '}
            <span className="font-mono text-sm text-docker-400">-p</span> when you run to publish it.
          </p>
          <CodeBlock title="Document port">{`EXPOSE 3000`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="CMD vs ENTRYPOINT">
        <p className="text-slate-300">
          Both define what runs when the container starts — but they play different roles.
        </p>
        <CodeBlock title="Clear distinction">
{`# CMD  = default command / args (easy to override)
# ENTRYPOINT = fixed main executable (args append)

# Typical app default:
CMD ["node", "server.js"]

# Fixed tool + default args:
ENTRYPOINT ["python", "app.py"]
CMD ["--help"]

# Override CMD at run time:
docker run myapp node other.js

# Override entrypoint entirely:
docker run --entrypoint sh myapp`}
        </CodeBlock>
        <Callout variant="insight" title="Beginner rule of thumb">
          For most web apps, use exec-form <span className="font-mono text-sm text-docker-400">CMD [&quot;…&quot;]</span>.
          Use ENTRYPOINT when the image is a CLI tool with a fixed binary.
        </Callout>
      </LessonSection>

      <LessonSection title="Minimal Node example">
        <Example title="Dockerfile" caption="Save as Dockerfile in your project root">
{`FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`}
        </Example>
        <CodeBlock title="Minimal Python alternative">
{`FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title=".dockerignore">
        <p className="text-slate-300">
          Like <span className="font-mono text-sm text-docker-400">.gitignore</span> for builds. Keep
          secrets, junk, and huge folders out of the build context.
        </p>
        <CodeBlock title=".dockerignore example">
{`node_modules
npm-debug.log
.git
.env
.env.*
dist
__pycache__
*.pyc
.DS_Store
README.md`}
        </CodeBlock>
        <Callout variant="tip" title="Why it matters">
          Smaller context = faster builds and fewer accidental secret leaks into image layers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>A Dockerfile is a build recipe starting with <span className="font-mono text-sm text-docker-400">FROM</span>.</>,
          <>Use <span className="font-mono text-sm text-docker-400">WORKDIR</span>, <span className="font-mono text-sm text-docker-400">COPY</span>, <span className="font-mono text-sm text-docker-400">RUN</span>, <span className="font-mono text-sm text-docker-400">EXPOSE</span>.</>,
          <>CMD is the default command; ENTRYPOINT is the fixed main process.</>,
          <>Add a <span className="font-mono text-sm text-docker-400">.dockerignore</span> so builds stay small and safe.</>,
        ]}
      />
    </LessonArticle>
  )
}
