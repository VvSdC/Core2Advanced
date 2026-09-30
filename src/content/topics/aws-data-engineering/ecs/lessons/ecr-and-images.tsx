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

export function EcrAndImages() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Your pipeline code needs a home AWS can pull from">
        Fargate cannot see the image sitting on your laptop. You push it to a registry, and the task definition
        points at it. <strong className="text-white">Amazon ECR</strong> is AWS&apos;s private registry: IAM-controlled,
        encrypted, scanned for vulnerabilities, and close to your tasks on the network. This lesson walks the{' '}
        <code className="text-core-400">de/orders-export</code> image from Dockerfile to a tag ECS can trust.
      </Callout>

      <Definition term="Amazon Elastic Container Registry (ECR)">
        <p>
          A managed OCI and Docker image registry. Each account and Region has a registry at{' '}
          <code className="text-core-400">111122223333.dkr.ecr.us-east-1.amazonaws.com</code>, containing{' '}
          <strong className="text-white">repositories</strong> such as{' '}
          <code className="text-core-400">de/orders-export</code>. A repository holds image versions addressed by
          tag, such as <code className="text-core-400">3f9c2ab</code>, or by immutable digest, such as{' '}
          <code className="text-core-400">sha256:…</code>. Access is controlled by IAM policies plus optional
          repository policies for cross-account pulls.
        </p>
      </Definition>

      <LessonSection title="Create, authenticate, build, push">
        <ContentStep number={1} title="Create the repository with safe defaults">
          <p className="text-slate-300">
            Turn on <strong className="text-white">tag immutability</strong> so a pushed tag can never be
            overwritten, and enable scan on push. With immutable tags,{' '}
            <code className="text-core-400">orders-export:3f9c2ab</code> always means the same bytes — revision 14
            of the task definition is reproducible months later during an audit.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Authenticate Docker to ECR">
          <p className="text-slate-300">
            <code className="text-core-400">aws ecr get-login-password</code> returns a token valid for about 12
            hours; pipe it to <code className="text-core-400">docker login</code>. In CI the same step runs under
            an OIDC-assumed role, so no long-lived keys exist anywhere.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tag with the git SHA">
          <p className="text-slate-300">
            Tag every build with the short commit SHA. Human-friendly tags like{' '}
            <code className="text-core-400">v1.4.0</code> are fine in addition, but never deploy{' '}
            <code className="text-core-400">latest</code> — you cannot tell which code ran last Tuesday, and a
            mutable tag breaks rollbacks.
          </p>
        </ContentStep>
        <Example title="Create repo, log in, build for ARM64, push" caption="Shell — run from the job repo root">
{`aws ecr create-repository \\
  --repository-name de/orders-export \\
  --image-tag-mutability IMMUTABLE \\
  --image-scanning-configuration scanOnPush=true \\
  --encryption-configuration encryptionType=KMS

REGISTRY=111122223333.dkr.ecr.us-east-1.amazonaws.com
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin $REGISTRY

TAG=$(git rev-parse --short HEAD)
docker buildx build --platform linux/arm64 \\
  -t $REGISTRY/de/orders-export:$TAG --push .`}
        </Example>
      </LessonSection>

      <LessonSection title="Scanning and lifecycle policies">
        <ContentStep number={1} title="Basic vs enhanced scanning">
          <p className="text-slate-300">
            <strong className="text-white">Basic scanning</strong> checks OS packages on push or on demand.{' '}
            <strong className="text-white">Enhanced scanning</strong> hands the repository to Amazon Inspector,
            which also inspects language packages such as pip and continuously rescans when new CVEs are published.
            Findings flow to EventBridge, so a critical CVE in any <code className="text-core-400">de/</code> repository can page
            the team through <code className="text-core-400">de-alerts-prod</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lifecycle policies stop storage creep">
          <p className="text-slate-300">
            Every CI build pushes an image; after a year you have thousands. A lifecycle policy expires untagged
            images quickly and keeps only the most recent N SHA-tagged builds — enough to roll back, not enough to
            pay for forever. Make sure N comfortably covers any revision still pinned in prod.
          </p>
        </ContentStep>
        <Example title="Lifecycle policy for de/orders-export" caption="Expire untagged after 7 days; keep last 30 builds">
{`{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images after 7 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 7
      },
      "action": { "type": "expire" }
    },
    {
      "rulePriority": 2,
      "description": "Keep only the 30 most recent images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 30
      },
      "action": { "type": "expire" }
    }
  ]
}`}
        </Example>
        <Callout variant="info">
          Pull-through cache rules let ECR mirror upstream registries such as ECR Public or Docker Hub. Your tasks
          pull <code className="text-core-400">python:3.12-slim</code> through your own registry — no Docker Hub rate
          limits, and private-subnet tasks do not need internet access to fetch base images.
        </Callout>
      </LessonSection>

      <LessonSection title="Cross-account pulls and image size">
        <ContentStep number={1} title="One registry, many accounts">
          <p className="text-slate-300">
            Many teams build once in a shared tooling account and deploy to dev, staging, and prod. A repository
            policy grants the prod account&apos;s task execution role{' '}
            <code className="text-core-400">ecr:BatchGetImage</code> and{' '}
            <code className="text-core-400">ecr:GetDownloadUrlForLayer</code>; the prod role also needs{' '}
            <code className="text-core-400">ecr:GetAuthorizationToken</code> in its own IAM policy. If the repo
            uses a customer managed KMS key, the key policy must allow the pulling account to decrypt.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Smaller images start faster">
          <p className="text-slate-300">
            Fargate downloads the image on every task start — there is no warm host cache like on your laptop. A
            2 GB image with compilers and test data can add a minute to each run. Use slim base images,
            multi-stage builds that copy only the installed site-packages, a{' '}
            <code className="text-core-400">.dockerignore</code>, and pinned dependency versions.
          </p>
        </ContentStep>
        <Example title="Multi-stage Dockerfile" caption="Build wheels in one stage, ship a slim runtime">
{`FROM python:3.12-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=build /install /usr/local
COPY orders_export/ ./orders_export/
USER 1000
CMD ["python", "-m", "orders_export.main"]`}
        </Example>
        <Flowchart
          title="Image path from commit to Fargate"
          chart={`flowchart LR
  GIT[Git commit 3f9c2ab]
  CI[CI build multi stage]
  ECR[ECR repo de orders-export]
  SCAN[Inspector scan]
  TD[Task definition revision]
  FG[Fargate task pulls image]
  GIT --> CI
  CI -->|push immutable tag| ECR
  ECR --> SCAN
  ECR --> TD
  TD --> FG`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'ECR is the private, IAM-controlled registry your task definitions pull from.',
          'Use immutable tags and git SHA tagging so every revision maps to exact, reproducible bytes.',
          'Enhanced scanning with Inspector covers language packages and rescans as new CVEs appear.',
          'Lifecycle policies expire untagged and old images; keep enough history for rollbacks.',
          'Slim bases and multi-stage builds shrink images and cut Fargate start time on every run.',
        ]}
      />
    </LessonArticle>
  )
}
