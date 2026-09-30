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

export function NetworkingAndLoadBalancing() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Most first ECS failures are network failures">
        The container works on your laptop, then fails on Fargate with{' '}
        <code className="text-core-400">CannotPullContainerError</code> or hangs connecting to RDS. Nine times out
        of ten the code is fine — the task simply cannot reach ECR, Secrets Manager, S3, or the database. This
        lesson connects what you learned in the VPC sub-topic to how every ECS task gets a network identity.
      </Callout>

      <Definition term="awsvpc network mode">
        <p>
          The network mode Fargate requires. ECS attaches a dedicated{' '}
          <strong className="text-white">elastic network interface (ENI)</strong> to each task, giving it its own
          private IP address in the subnet you choose and its own{' '}
          <strong className="text-white">security groups</strong>. To the rest of the VPC, a task looks just like a
          small EC2 instance: security group rules, route tables, NACLs, and VPC Flow Logs all apply per task.
        </p>
      </Definition>

      <LessonSection title="Private subnets and the path to AWS APIs">
        <ContentStep number={1} title="Run tasks in private subnets">
          <p className="text-slate-300">
            Data jobs rarely need inbound internet traffic, so run{' '}
            <code className="text-core-400">orders-export</code> in private subnets with{' '}
            <code className="text-core-400">assignPublicIp</code> set to{' '}
            <code className="text-core-400">DISABLED</code>. The catch: before your code even starts, the Fargate
            agent must pull the image from ECR, fetch injected secrets, and create the log stream — all AWS API
            calls that need a route out.
          </p>
        </ContentStep>
        <ContentStep number={2} title="NAT gateway or VPC endpoints">
          <p className="text-slate-300">
            Option one is a NAT gateway: simple, but you pay per GB for every image layer and every S3 byte that
            flows through it. Option two is VPC endpoints, which keep traffic on the AWS network. A private-only
            Fargate batch job typically needs the endpoints below; add others such as{' '}
            <code className="text-core-400">glue</code>, <code className="text-core-400">sqs</code>, or{' '}
            <code className="text-core-400">states</code> for whatever APIs your code calls.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Endpoint</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Why the task needs it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['com.amazonaws.region.ecr.api', 'Interface', 'Get ECR auth token and image manifest'],
                ['com.amazonaws.region.ecr.dkr', 'Interface', 'Docker registry API for the pull'],
                ['com.amazonaws.region.s3', 'Gateway, free', 'ECR stores image layers in S3; also your lake reads and writes'],
                ['com.amazonaws.region.logs', 'Interface', 'awslogs driver writes to CloudWatch Logs'],
                ['com.amazonaws.region.secretsmanager', 'Interface', 'Inject secrets at task start and read them in code'],
                ['com.amazonaws.region.ssm', 'Interface', 'Inject Parameter Store values'],
                ['com.amazonaws.region.sts', 'Interface', 'SDKs exchanging or assuming roles'],
              ].map(([endpoint, type, why]) => (
                <tr key={endpoint} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{endpoint}</td>
                  <td className="px-4 py-3">{type}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          The public IP trap: a task in a <em>public</em> subnet with{' '}
          <code className="text-core-400">assignPublicIp</code> DISABLED has no route to ECR and fails to pull.
          Either enable the public IP (fine for quick dev experiments) or, better, move the task to a private subnet
          with NAT or endpoints.
        </Callout>
      </LessonSection>

      <LessonSection title="Security groups to databases and warehouses">
        <ContentStep number={1} title="Reference groups, not IP ranges">
          <p className="text-slate-300">
            Task IPs change on every run, so never allowlist them. Give the job its own security group,{' '}
            <code className="text-core-400">sg-orders-export</code>, and on the RDS security group allow port 5432
            inbound <em>from that security group</em>. Do the same for Redshift on 5439. The rule survives every
            new task, revision, and scaling event.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Egress and the interface endpoints">
          <p className="text-slate-300">
            The task security group needs outbound 443 to the interface endpoints, and the endpoint security group
            needs inbound 443 from the task group. A missing rule here shows up as{' '}
            <code className="text-core-400">ResourceInitializationError</code> when ECS tries to fetch secrets.
          </p>
        </ContentStep>
        <Example title="Network configuration for RunTask" caption="Private subnets in two AZs, dedicated security group">
{`"networkConfiguration": {
  "awsvpcConfiguration": {
    "subnets": ["subnet-0priv1a", "subnet-0priv1b"],
    "securityGroups": ["sg-orders-export"],
    "assignPublicIp": "DISABLED"
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Load balancing and service discovery for long-running services">
        <ContentStep number={1} title="ALB target groups with ip targets">
          <p className="text-slate-300">
            Batch tasks do not need a load balancer, but an internal ingest API or a metadata service does. With
            awsvpc, the target group must use target type <code className="text-core-400">ip</code>, because ECS
            registers each task&apos;s ENI address. ECS registers new tasks, waits for health checks, and drains old
            ones during deployments automatically.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Service Connect and Cloud Map">
          <p className="text-slate-300">
            For service-to-service calls inside the VPC without a load balancer,{' '}
            <strong className="text-white">ECS Service Connect</strong> gives services friendly names in an AWS Cloud
            Map namespace and adds a managed proxy with retries and connection metrics. Plain Cloud Map service
            discovery registers task IPs in DNS. Most DE batch stacks never need either.
          </p>
        </ContentStep>
        <ContentStep number={3} title="API Gateway in front of an ECS service">
          <p className="text-slate-300">
            Tying back to the API Gateway sub-topic: a webhook receiver running on ECS stays private behind an
            internal ALB. API Gateway reaches it through a <strong className="text-white">VPC link</strong>. HTTP
            APIs integrate with internal ALBs, NLBs, or Cloud Map. REST APIs historically required an NLB; VPC link
            v2 now lets REST APIs target an internal ALB directly in many Regions — check current docs for yours.
          </p>
        </ContentStep>
        <Flowchart
          title="Private ECS networking end to end"
          chart={`flowchart LR
  CLIENT[Vendor webhook]
  APIGW[API Gateway]
  VPCL[VPC link]
  ALB[Internal ALB ip targets]
  SVC[ECS service tasks]
  EP[VPC endpoints ECR logs secrets]
  S3[(S3 gateway endpoint)]
  RDS[(RDS via security group)]
  CLIENT --> APIGW
  APIGW --> VPCL
  VPCL --> ALB
  ALB --> SVC
  SVC --> EP
  SVC --> S3
  SVC --> RDS`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'awsvpc gives every task its own ENI, private IP, and security groups — tasks behave like tiny instances.',
          'Private subnets need a NAT gateway or VPC endpoints for ECR, S3, logs, secrets, and STS before code runs.',
          'Allow database access by referencing the task security group, never by task IP address.',
          'Services behind an ALB use ip target groups; ECS handles registration and draining.',
          'API Gateway reaches private ECS services through a VPC link to an internal load balancer.',
        ]}
      />
    </LessonArticle>
  )
}
