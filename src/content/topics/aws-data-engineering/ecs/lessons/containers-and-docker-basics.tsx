import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ContainersAndDockerBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="&quot;It works on my laptop&quot; — the problem containers solve">
        Your ETL script runs fine locally, then fails on the server because Python is a different version,
        a JDBC driver is missing, or a system library is older. Containers fix this by shipping{' '}
        <strong className="text-white">the app together with everything it needs</strong>, so it runs the
        same on your laptop, in CI, and on ECS. You do not need any Docker background — we start from zero.
      </Callout>

      <Definition term="Container">
        <p>
          A <strong className="text-white">container</strong> is an isolated process that runs your
          application together with its dependencies — language runtime, libraries, drivers, config files —
          packaged into a single unit. It shares the host&apos;s operating system kernel, so it starts in
          seconds and uses far less overhead than a full virtual machine.
        </p>
        <p className="mt-2 text-slate-300">
          <span className="text-core-400">Image vs container</span> is like a recipe vs a meal, or a class vs
          an instance: the image is the frozen, read-only package; a container is one running copy of it.
          You can start ten containers from one image.
        </p>
      </Definition>

      <LessonSection title="Containers vs virtual machines">
        <p className="text-slate-300">
          You already know EC2 instances are virtual machines. Containers sit one level higher — many
          containers can share one VM.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Virtual machine</th>
                <th className="px-4 py-3">Container</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['What it packages', 'A full guest OS plus your app', 'Just your app and its dependencies'],
                ['Startup time', 'Minutes', 'Seconds'],
                ['Size', 'Gigabytes', 'Tens to hundreds of megabytes typically'],
                ['Isolation', 'Strong — separate kernel', 'Process-level — shares the host kernel'],
                ['DE example', 'An EC2 box running cron jobs', 'An orders-export image run nightly on Fargate'],
              ].map(([aspect, vm, container]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{vm}</td>
                  <td className="px-4 py-3">{container}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Layers — why rebuilds are fast">
          <p className="text-slate-300">
            An image is built as a stack of read-only <strong className="text-white">layers</strong>, one per
            Dockerfile step. If only your source code changed, Docker reuses the cached layers for the base
            OS and installed libraries and rebuilds just the last layer — seconds instead of minutes.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A Dockerfile for a Python ETL job">
        <p className="text-slate-300">
          A <code className="text-core-400">Dockerfile</code> is a plain text recipe. Order matters: copy
          and install dependencies first (they change rarely), then copy your code (it changes often).
        </p>
        <Example title="Dockerfile" caption="Small Python image for an orders export job">
{`# Start from an official slim Python base image
FROM python:3.12-slim

WORKDIR /app

# Dependencies first so this layer is cached between code changes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Then the job code
COPY src/ ./src/

# The command the container runs when it starts
CMD ["python", "-m", "src.export_orders"]`}
        </Example>
        <Example title="Build, run, tag, push" caption="Local test first, then push to Amazon ECR">
{`# Build an image from the Dockerfile in the current folder
docker build -t orders-export:3f9c2ab .

# Run it locally, passing config as environment variables
docker run --rm -e RUN_DATE=2026-09-30 -e TARGET_BUCKET=acme-lake-dev orders-export:3f9c2ab

# Log in to ECR, tag with the full registry path, push
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin 111122223333.dkr.ecr.us-east-1.amazonaws.com

docker tag orders-export:3f9c2ab \\
  111122223333.dkr.ecr.us-east-1.amazonaws.com/orders-export:3f9c2ab
docker push 111122223333.dkr.ecr.us-east-1.amazonaws.com/orders-export:3f9c2ab`}
        </Example>
        <Flowchart
          title="From Dockerfile to running task"
          chart={`flowchart LR
  DF[Dockerfile] --> BUILD[docker build]
  BUILD --> IMG[Local image]
  IMG --> PUSH[docker push]
  PUSH --> ECR[Amazon ECR]
  ECR --> ECS[ECS task pulls image]`}
        />
      </LessonSection>

      <LessonSection title="Registries, config, and secrets">
        <ContentStep number={1} title="Registries — Docker Hub and Amazon ECR">
          <p className="text-slate-300">
            A registry stores images. <strong className="text-white">Docker Hub</strong> hosts public base
            images like <code className="text-core-400">python:3.12-slim</code>.{' '}
            <strong className="text-white">Amazon ECR</strong> is your private registry inside AWS — IAM
            controls who can push and pull, and ECS pulls from it with the task execution role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Config at runtime, not build time">
          <p className="text-slate-300">
            Build one image and promote it through dev, staging, and prod. Differences — bucket names, run
            date, log level — arrive as environment variables when the task starts. Same image, different
            config.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Never bake secrets into images">
          <p className="text-slate-300">
            Anyone who can pull an image can read every file and layer in it. Database passwords and API
            keys belong in Secrets Manager or Parameter Store and are injected at runtime — you will wire
            this up in the IAM task roles and secrets lesson.
          </p>
        </ContentStep>
        <Callout variant="info" title="Multi-arch teaser — arm64 and Graviton">
          Images are built for a CPU architecture. Fargate supports both x86_64 and arm64 (Graviton), and
          arm64 is often cheaper per vCPU-hour. Build with{' '}
          <code className="text-core-400">docker buildx build --platform linux/arm64</code> — or publish a
          multi-arch image — and make sure every native library you depend on has an arm64 build.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A container is your app plus its dependencies, packaged to run identically everywhere; an image is the read-only recipe it starts from.',
          'Containers share the host kernel — faster and lighter than VMs, with process-level isolation.',
          'Dockerfile order matters: install dependencies before copying code so cached layers make rebuilds fast.',
          'docker build → tag → push to Amazon ECR; ECS pulls the image when a task starts.',
          'Pass config as environment variables at runtime and keep secrets in Secrets Manager — never inside the image.',
        ]}
      />
    </LessonArticle>
  )
}
