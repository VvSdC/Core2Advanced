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

export function DeploymentsAndCiCd() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="From git push to running containers without clicking in the console">
        So far you registered task definitions and pushed images by hand. In a team, every merge to{' '}
        <code className="text-core-400">main</code> should build the image, push it to ECR with the commit SHA,
        register a new task definition revision, and roll it out — with automatic rollback if the new version is
        unhealthy. Services and batch jobs deploy differently, and knowing why is a common interview question.
      </Callout>

      <Definition term="ECS deployment">
        <p>
          Changing what an ECS service runs — usually by pointing it at a new task definition revision — and letting
          ECS replace old tasks with new ones according to a <strong className="text-white">deployment
          strategy</strong>. For batch jobs there is no service to deploy: the &quot;deployment&quot; is updating
          the schedule or state machine to reference the new revision, and the next run picks it up.
        </p>
      </Definition>

      <LessonSection title="Deployment strategies for services">
        <ContentStep number={1} title="Rolling update">
          <p className="text-slate-300">
            The default. <code className="text-core-400">minimumHealthyPercent</code> sets how many tasks must stay
            running during the rollout; <code className="text-core-400">maximumPercent</code> sets how many extra
            may start. With 4 workers, 100 and 200 means ECS starts 4 new tasks before stopping old ones — safe, but
            briefly doubles cost. 50 and 100 replaces in halves with no extra capacity.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deployment circuit breaker">
          <p className="text-slate-300">
            If new tasks keep failing to start or failing health checks, the circuit breaker marks the deployment
            failed and, with <code className="text-core-400">rollback</code> enabled, returns the service to the last
            working revision. Turn it on for every service — a bad image then costs minutes of retries rather than a
            night of crash loops on <code className="text-core-400">orders-worker</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Blue/green">
          <p className="text-slate-300">
            Blue/green starts a full new set of tasks behind a separate target group, shifts load balancer traffic
            to it, and keeps the old set for fast rollback. Historically this required{' '}
            <strong className="text-white">AWS CodeDeploy</strong>. AWS has since added blue/green deployments
            built into ECS itself, with canary and linear traffic shifting options — check the current ECS docs for
            the exact features available to you. Queue workers without a load balancer rarely need blue/green;
            rolling plus circuit breaker is enough.
          </p>
        </ContentStep>
        <Example title="Service deployment configuration" caption="Rolling with circuit breaker and rollback">
{`"deploymentConfiguration": {
  "minimumHealthyPercent": 100,
  "maximumPercent": 200,
  "deploymentCircuitBreaker": { "enable": true, "rollback": true }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="A CI/CD pipeline with GitHub Actions">
        <ContentStep number={1} title="OIDC instead of access keys">
          <p className="text-slate-300">
            GitHub Actions exchanges a short-lived OIDC token for credentials of an IAM role whose trust policy only
            accepts your repo and branch. The role can push to the{' '}
            <code className="text-core-400">de/orders-worker</code> ECR repo, register task definitions, pass the
            two task roles, and update the service — nothing else.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Build, push, render, deploy">
          <p className="text-slate-300">
            The workflow builds the image tagged with the git SHA, renders the task definition JSON from the repo
            with the new image, registers it, and updates the service, waiting for stability so the job fails if the
            circuit breaker rolls back.
          </p>
        </ContentStep>
        <Example title=".github/workflows/deploy.yml" caption="GitHub Actions — OIDC role, ECR push, new revision, service update">
{`name: deploy-orders-worker
on:
  push:
    branches: [main]
permissions:
  id-token: write
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::111122223333:role/github-deploy-de
          aws-region: us-east-1
      - id: ecr
        uses: aws-actions/amazon-ecr-login@v2
      - id: build
        name: Build and push
        run: |
          IMAGE=\${{ steps.ecr.outputs.registry }}/de/orders-worker:\${GITHUB_SHA::7}
          docker build -t "$IMAGE" .
          docker push "$IMAGE"
          echo "image=$IMAGE" >> "$GITHUB_OUTPUT"
      - id: render
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: deploy/orders-worker-taskdef.json
          container-name: orders-worker
          image: \${{ steps.build.outputs.image }}
      - uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: \${{ steps.render.outputs.task-definition }}
          cluster: de-etl-cluster-prod
          service: orders-worker
          wait-for-service-stability: true`}
        </Example>
        <Callout variant="tip">
          Keep secrets out of the workflow entirely. The task definition references Secrets Manager ARNs; CI only
          needs permission to register the definition and pass roles, never to read the secret values.
        </Callout>
      </LessonSection>

      <LessonSection title="Deploying batch jobs and managing it all as code">
        <ContentStep number={1} title="Batch jobs: repoint, do not restart">
          <p className="text-slate-300">
            For <code className="text-core-400">orders-export</code>, CI registers revision 15, then updates the
            EventBridge Scheduler target or the Step Functions definition to reference{' '}
            <code className="text-core-400">orders-export:15</code>. Tonight&apos;s run uses it; rollback means
            pointing back to 14. A useful habit is a smoke run: CI triggers one RunTask against a small test date and
            only repoints the schedule if it exits 0.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Infrastructure as code">
          <p className="text-slate-300">
            Define the cluster, task definitions, services, scaling policies, schedules, and alarms in CloudFormation
            or CDK, as in the CloudFormation sub-topic. The image tag becomes a stack parameter, so a deploy is a
            stack update and drift is visible. Avoid mixing console edits with IaC — the next stack update silently
            reverts them.
          </p>
        </ContentStep>
        <Flowchart
          title="Git to ECS for services and batch jobs"
          chart={`flowchart LR
  GIT[Merge to main]
  GHA[GitHub Actions OIDC]
  ECR[ECR push SHA tag]
  REG[Register new revision]
  SVC[update-service rolling]
  CB{Healthy}
  RB[Circuit breaker rollback]
  SCHED[Repoint schedule or state machine]
  GIT --> GHA
  GHA --> ECR
  ECR --> REG
  REG -->|service| SVC
  SVC --> CB
  CB -->|no| RB
  REG -->|batch job| SCHED`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Rolling updates are tuned by minimumHealthyPercent and maximumPercent; always enable the circuit breaker with rollback.',
          'Blue/green shifts load balancer traffic between task sets — via CodeDeploy or newer built-in ECS support.',
          'CI/CD: OIDC role, build, push SHA-tagged image, render and register a revision, update the service.',
          'Batch jobs deploy by repointing schedules or state machines to the new revision; rollback is a repoint.',
          'Manage clusters, task definitions, schedules, and alarms with CloudFormation or CDK, not console edits.',
        ]}
      />
    </LessonArticle>
  )
}
