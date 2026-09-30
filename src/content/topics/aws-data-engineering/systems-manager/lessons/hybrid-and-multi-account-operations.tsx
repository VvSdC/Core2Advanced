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

export function HybridAndMultiAccountOperations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Not every server that feeds the lake lives in one AWS account">
        Partner files still arrive on an on-prem SFTP server. A legacy ETL box in the data center extracts from
        a mainframe export. Your lake spans dev, staging, and prod accounts in an AWS Organization. Systems
        Manager can manage all of these from one place: <strong className="text-white">hybrid activations</strong>{' '}
        for non-EC2 machines, <strong className="text-white">Quick Setup</strong> for organization-wide defaults,
        and <strong className="text-white">multi-account Automation</strong> for fleet-wide changes.
      </Callout>

      <Definition term="Hybrid managed node">
        <p>
          A non-EC2 machine — on-prem server, VM in another cloud, or edge device — running SSM Agent registered
          with a <strong className="text-white">hybrid activation</strong> (activation code plus ID). It appears
          in Systems Manager with an ID starting <code className="text-core-400">mi-</code> instead of{' '}
          <code className="text-core-400">i-</code>, and supports Run Command, Session Manager, State Manager,
          Inventory, and Patch Manager like an EC2 instance. Permissions come from an IAM service role named in
          the activation, not an instance profile.
        </p>
      </Definition>

      <LessonSection title="Hybrid activations for on-prem data servers">
        <ContentStep number={1} title="Create an activation, register the server">
          <p className="text-slate-300">
            Create an activation that names a service role (with{' '}
            <code className="text-core-400">AmazonSSMManagedInstanceCore</code>), a registration limit, an
            expiry, and default tags. On the server, install SSM Agent and register it with the code and ID. The
            server only needs outbound HTTPS to Systems Manager — ideally over Direct Connect or VPN to VPC
            interface endpoints.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What changed in pricing (2026)">
          <p className="text-slate-300">
            Hybrid nodes used to require the paid <strong className="text-white">advanced-instances tier</strong>{' '}
            for Session Manager or for more than 1,000 nodes. AWS removed that tier on June 30, 2026: there is no
            longer a per-node charge or 1,000-node limit, and pay-as-you-go pricing for Session Manager sessions
            and Run Command invocations on hybrid nodes starts September 30, 2026. EC2 usage is unaffected. Check
            the Systems Manager pricing page for current rates before rolling out widely.
          </p>
        </ContentStep>
        <Example title="Register an on-prem SFTP landing server" caption="Run the first command in AWS, the second on the server">
{`aws ssm create-activation \\
  --default-instance-name "sftp-landing-onprem-01" \\
  --iam-role "SSMServiceRole-Hybrid" \\
  --registration-limit 5 \\
  --expiration-date "2026-10-31T00:00:00Z" \\
  --tags "Key=Role,Value=sftp-landing" "Key=Env,Value=prod"
# Returns ActivationId and ActivationCode

# On the Linux server, after installing the agent package
sudo amazon-ssm-agent -register \\
  -code "<activation-code>" -id "<activation-id>" -region "us-east-1"
sudo systemctl restart amazon-ssm-agent
# Node appears as mi-0123456789abcdef0`}
        </Example>
        <Callout variant="tip">
          Once registered, the SFTP server gets the same treatment as EC2: an inventory association, patch
          scans, and a State Manager association that verifies its S3 sync job to{' '}
          <code className="text-core-400">acme-lake-prod/landing/</code> is installed and scheduled.
        </Callout>
      </LessonSection>

      <LessonSection title="Quick Setup and Default Host Management Configuration">
        <ContentStep number={1} title="Organization-wide defaults">
          <p className="text-slate-300">
            Quick Setup deploys recommended configurations to accounts, OUs, and Regions in your Organization:
            host management (SSM Agent updates, inventory, CloudWatch agent), patch policies, Change Calendar,
            and more. Under the hood it creates State Manager associations and CloudFormation StackSets, and it
            watches for drift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Default Host Management Configuration">
          <p className="text-slate-300">
            DHMC lets Systems Manager manage EC2 instances <strong className="text-white">without</strong> an SSM
            policy in each instance profile, using a single role per account and Region. It requires IMDSv2 and a
            recent SSM Agent. Great for making every new ETL or EMR host managed by default across the org.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Multi-account, multi-Region operations">
        <ContentStep number={1} title="Automation across accounts">
          <p className="text-slate-300">
            From a central account (or a <strong className="text-white">delegated administrator</strong> for
            Systems Manager), start one Automation execution with{' '}
            <code className="text-core-400">--target-locations</code> listing accounts or OU IDs and Regions. Each
            target account needs an execution role the central admin role can assume; concurrency and error limits
            apply per location and per resource. Steps are billed in the account that started the automation.
          </p>
        </ContentStep>
        <Example title="Clean temp space on ETL workers across the data OU" caption="Shared custom runbook; roles use the documented default names">
{`aws ssm start-automation-execution \\
  --document-name "arn:aws:ssm:us-east-1:111122223333:document/acme-etl-TmpCleanup" \\
  --target-parameter-name InstanceId \\
  --targets '[{"Key":"tag:Role","Values":["etl-worker"]}]' \\
  --target-locations '[{
      "Accounts": ["ou-ab12-datalake"],
      "Regions": ["us-east-1", "eu-west-1"],
      "ExecutionRoleName": "AWS-SystemsManager-AutomationExecutionRole",
      "TargetLocationMaxConcurrency": "2",
      "TargetLocationMaxErrors": "1"
    }]' \\
  --max-concurrency "10%" \\
  --max-errors "1"`}
        </Example>
        <ContentStep number={2} title="Explorer and OpsCenter">
          <p className="text-slate-300">
            <strong className="text-white">OpsCenter</strong> collects OpsItems — operational issues created from
            CloudWatch alarms, EventBridge rules, or manually — with related resources and suggested runbooks.{' '}
            <strong className="text-white">Explorer</strong> aggregates OpsItems, patch compliance, and association
            compliance across accounts and Regions into one dashboard via resource data sync. Both are
            pay-per-use; check pricing if you auto-create OpsItems from noisy alarms.
          </p>
        </ContentStep>
        <Flowchart
          title="Central operations for a multi-account lake"
          chart={`flowchart TB
  ADMIN[Ops account delegated administrator]
  QS[Quick Setup host management and patch policies]
  AUTO[Multi account Automation]
  DEV[Data dev account]
  PROD[Data prod account]
  ONP[On prem SFTP mi node]
  EXP[Explorer and OpsCenter]
  ADMIN --> QS
  ADMIN --> AUTO
  QS --> DEV
  QS --> PROD
  AUTO --> DEV
  AUTO --> PROD
  ONP -->|hybrid activation| PROD
  DEV --> EXP
  PROD --> EXP
  EXP --> ADMIN`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hybrid activations register on-prem or other-cloud servers as mi- managed nodes using an IAM service role.',
          'The advanced-instances tier was removed in June 2026; hybrid Session Manager and Run Command are now pay-as-you-go.',
          'Quick Setup deploys host management and patch policies across OUs and Regions; DHMC makes EC2 managed by default.',
          'Multi-account Automation uses target locations, execution roles, and per-location rate limits.',
          'Explorer and OpsCenter aggregate operational issues and compliance across the organization.',
        ]}
      />
    </LessonArticle>
  )
}
