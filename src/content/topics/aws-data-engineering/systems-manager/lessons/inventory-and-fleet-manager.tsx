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

export function InventoryAndFleetManager() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Which ETL hosts still run Python 3.8? Answer it with SQL">
        Security announces a CVE in an old PostgreSQL JDBC driver. Your manager asks which hosts have it. Without
        inventory, someone SSHes into forty machines. With <strong className="text-white">Inventory</strong>{' '}
        collecting installed software and files on a schedule, and a{' '}
        <strong className="text-white">resource data sync</strong> landing it in S3, the answer is one Athena
        query — the lake you already know, pointed at your own fleet.
      </Callout>

      <Definition term="Systems Manager Inventory">
        <p>
          Metadata collected from managed nodes by the <code className="text-core-400">AWS-GatherSoftwareInventory</code>{' '}
          document, usually via a State Manager association. Built-in types include{' '}
          <code className="text-core-400">AWS:Application</code> (packages),{' '}
          <code className="text-core-400">AWS:File</code> (files matching paths you choose),{' '}
          <code className="text-core-400">AWS:Network</code>, <code className="text-core-400">AWS:Service</code>,{' '}
          <code className="text-core-400">AWS:InstanceInformation</code>, and{' '}
          <code className="text-core-400">AWS:Tag</code>. You can add custom inventory types too. Inventory
          records <em>what is installed</em>, not metrics or logs.
        </p>
      </Definition>

      <LessonSection title="Collecting inventory">
        <ContentStep number={1} title="One association per fleet">
          <p className="text-slate-300">
            Create an inventory association targeting all nodes or specific tags, with a schedule such as every
            12 hours. Quick Setup and the unified Systems Manager console can create this for you — check for an
            existing inventory association first, because a node honors only one.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Collect the files that matter to DE">
          <p className="text-slate-300">
            Package inventory shows OS packages like <code className="text-core-400">python3.8</code>. JDBC
            drivers are usually just JAR files dropped in a folder, so add a file collection rule for{' '}
            <code className="text-core-400">/opt/etl/drivers</code> with pattern{' '}
            <code className="text-core-400">*.jar</code>. Keep file paths narrow — scanning whole disks is slow
            and noisy.
          </p>
        </ContentStep>
        <Example title="Inventory association for ETL workers" caption="The files parameter is a JSON string inside JSON">
{`aws ssm create-association \\
  --association-name "etl-inventory" \\
  --name "AWS-GatherSoftwareInventory" \\
  --targets "Key=tag:Role,Values=etl-worker" \\
  --schedule-expression "rate(12 hours)" \\
  --parameters file://inventory-params.json

# inventory-params.json
{
  "applications": ["Enabled"],
  "networkConfig": ["Enabled"],
  "services": ["Enabled"],
  "files": ["[{\\"Path\\":\\"/opt/etl/drivers\\",\\"Pattern\\":[\\"*.jar\\"],\\"Recursive\\":false}]"]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Resource data sync to S3, then Athena">
        <Flowchart
          title="Fleet inventory as a lake dataset"
          chart={`flowchart LR
  NODES[ETL workers and EMR hosts]
  ASSOC[Inventory association]
  SSM[Systems Manager Inventory]
  SYNC[Resource data sync]
  S3[(S3 acme-ssm-inventory-prod)]
  CRAWL[Glue crawler]
  ATH[Athena queries]
  NODES --> ASSOC
  ASSOC --> SSM
  SSM --> SYNC
  SYNC --> S3
  S3 --> CRAWL
  CRAWL --> ATH`}
        />
        <ContentStep number={1} title="Create the sync">
          <p className="text-slate-300">
            A resource data sync continuously writes inventory (and compliance data) as JSON to an S3 bucket,
            partitioned by type, account, Region, and resource type. It can aggregate multiple accounts and
            Regions into one bucket — perfect for a central ops account. Bucket policy must allow{' '}
            <code className="text-core-400">ssm.amazonaws.com</code> to write.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog and query">
          <p className="text-slate-300">
            Run a Glue crawler over the bucket (or define tables yourself) to get one table per inventory type,
            then join packages or files with the tag table to filter by <code className="text-core-400">Role</code>{' '}
            and <code className="text-core-400">Env</code>. Column names come from the crawler — confirm them with{' '}
            <code className="text-core-400">SHOW COLUMNS</code> before building dashboards.
          </p>
        </ContentStep>
        <Example title="Create the sync and query it" caption="Table and column names depend on your crawler">
{`aws ssm create-resource-data-sync \\
  --sync-name "fleet-inventory-to-s3" \\
  --s3-destination "BucketName=acme-ssm-inventory-prod,Prefix=inventory,SyncFormat=JsonSerDe,Region=us-east-1"

-- Which prod ETL workers still run Python 3.8?
SELECT a.resourceid, a.name, a.version
FROM ssm_inventory.aws_application a
JOIN ssm_inventory.aws_tag t ON a.resourceid = t.resourceid
WHERE t.key = 'Role' AND t.value = 'etl-worker'
  AND a.name LIKE 'python3.8%';

-- Which hosts have an old PostgreSQL JDBC driver?
SELECT f.resourceid, f.name, f.installeddir
FROM ssm_inventory.aws_file f
WHERE f.name LIKE 'postgresql-42.2%.jar';`}
        </Example>
        <Callout variant="insight">
          This is data engineering applied to operations: inventory is just another semi-structured source.
          Partition projection, a daily snapshot table, and a QuickSight dashboard of &quot;hosts on unsupported
          runtimes&quot; turn a quarterly audit scramble into a standing report.
        </Callout>
      </LessonSection>

      <LessonSection title="Fleet Manager — node management without SSH">
        <ContentStep number={1} title="What you can do from the console">
          <p className="text-slate-300">
            Fleet Manager shows every managed node with its agent status, OS, and tags, and lets you browse the
            file system, view and tail log files, manage local users and groups, and (on Windows) inspect
            performance counters, the registry, and event logs. Some views are Windows-focused; file browsing,
            logs, and user management work on Linux too.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why DEs use it">
          <p className="text-slate-300">
            Quickly tail <code className="text-core-400">/var/log/etl/orders.log</code> on a private worker, check
            disk usage on <code className="text-core-400">/data</code>, or confirm a config file changed — without a
            shell, keys, or open ports. Actions run through Systems Manager under your IAM permissions, so the
            same tag-based policies and CloudTrail auditing apply.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Unmanaged or offline nodes">
          <p className="text-slate-300">
            Fleet Manager and the unified console also surface EC2 instances that are{' '}
            <strong className="text-white">not</strong> managed (missing agent, role, or network path). Treat that
            list as a to-do: every unmanaged ETL host is one you cannot patch, inventory, or reach safely.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Inventory collects packages, files, services, network config, and tags via an AWS-GatherSoftwareInventory association.',
          'Add narrow file rules (for example /opt/etl/drivers/*.jar) to track JDBC drivers and other non-package artifacts.',
          'Resource data sync writes inventory to S3 across accounts and Regions — catalog with Glue, query with Athena.',
          'Answer "which hosts run X" with SQL instead of SSH loops.',
          'Fleet Manager browses files, logs, and users on nodes without SSH, governed by IAM and audited in CloudTrail.',
        ]}
      />
    </LessonArticle>
  )
}
