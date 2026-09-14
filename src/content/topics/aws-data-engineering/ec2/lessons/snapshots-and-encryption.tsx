import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SnapshotsAndEncryption() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Backup blocks, not just buckets">
        S3 versioning protects lake objects — but your Airflow EC2 root volume, custom AMI golden image,
        and EBS data disk need their own backup story. <strong className="text-white">EBS snapshots</strong>{' '}
        are incremental, block-level backups stored in S3 (managed by AWS). They underpin disaster
        recovery, AMI builds, and cross-AZ copies for DE infrastructure you still run on EC2.
      </Callout>

      <Definition term="EBS snapshot">
        <p>
          An <strong className="text-white">EBS snapshot</strong> is a point-in-time copy of a volume stored
          in AWS (region-scoped). First snapshot is full; later snapshots store only changed blocks —
          cost-efficient for nightly backup of a scheduler node. Restore by creating a new volume from a
          snapshot in any AZ in the region, then attach to a replacement instance.
        </p>
      </Definition>

      <Definition term="AMI (Amazon Machine Image)">
        <p>
          An <strong className="text-white">AMI</strong> is a launch template for EC2: root volume snapshot
          + metadata (OS, architecture, EBS mappings). Data engineers use AMIs to bake Airflow dependencies,
          Python versions, and agents into a reproducible worker image — launch ten identical ETL boxes from
          one golden AMI instead of running user-data scripts every time.
        </p>
      </Definition>

      <LessonSection title="Snapshots for backup and AMI workflows">
        <ContentStep number={1} title="Backup a data volume">
          <p className="text-slate-300">
            Schedule snapshots via Data Lifecycle Manager (DLM) — e.g. every night, retain 7 daily + 4 weekly
            for an Airflow log/data volume. Tag volumes{' '}
            <span className="font-mono text-sm">Backup=true</span> and automate — manual snapshots are
            forgotten under on-call pressure.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Build a golden AMI">
          <p className="text-slate-300">
            Launch base instance → install stack (Python 3.11, boto3, CloudWatch agent) → stop instance →
            create image. New ASG launch template references that AMI — consistent ETL worker fleet.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-AZ / DR copy">
          <p className="text-slate-300">
            Copy snapshot to another region for DR (e.g. scheduler AMI in us-east-1 and us-west-2). Restore
            latency is minutes to hours depending on size — plan RTO accordingly; critical pipeline state
            should also live in RDS/S3, not only on one EBS volume.
          </p>
        </ContentStep>
        <Flowchart
          title="Snapshot → restore → AMI path"
          chart={`flowchart LR
  VOL[EBS volume — Airflow data]
  SNAP[EBS snapshot]
  S3[(AWS-managed S3 storage)]
  NEW[New volume from snapshot]
  EC2[Replacement EC2 instance]
  AMI[AMI golden image]
  LT[Launch Template / ASG]
  VOL -->|CreateSnapshot| SNAP
  SNAP --> S3
  SNAP --> NEW
  NEW --> EC2
  SNAP --> AMI
  AMI --> LT
  LT --> EC2`}
        />
      </LessonSection>

      <LessonSection title="EBS encryption and KMS">
        <ContentStep number={1} title="Encryption at rest">
          <p className="text-slate-300">
            Enable <strong className="text-white">EBS encryption by default</strong> at the account level so
            every new volume and snapshot is encrypted. Encryption uses AES-256; minimal performance impact
            on modern instance types. Unencrypted snapshots cannot be shared across accounts without copying
            to an encrypted snapshot.
          </p>
        </ContentStep>
        <ContentStep number={2} title="KMS keys">
          <p className="text-slate-300">
            Default AWS managed key (<span className="font-mono text-sm">aws/ebs</span>) works for most teams.
            Customer managed CMKs (<span className="font-mono text-sm">alias/data-platform-ebs</span>) give
            key rotation control, cross-account grant policies, and CloudTrail visibility on key use — required
            in many compliance programs handling PII staging on EC2.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Snapshots inherit encryption">
          <p className="text-slate-300">
            Encrypted volume → encrypted snapshot → encrypted volume on restore. When sharing AMIs across
            accounts for a shared ETL image, coordinate KMS key policies so target accounts can decrypt.
          </p>
        </ContentStep>
        <Callout variant="insight">
          DE hygiene: encrypt by default; tag snapshots with{' '}
          <span className="font-mono text-sm">Environment</span> and{' '}
          <span className="font-mono text-sm">Dataset</span>; never store JDBC passwords on EBS unencrypted
          when Secrets Manager exists — encryption protects disks, not poor secret handling.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EBS snapshots are incremental block backups — foundation for volume restore, DR copies, and AMI creation.',
          'Use DLM policies for automated snapshot schedules on tagged ETL/Airflow volumes — don\'t rely on manual snapshots.',
          'AMIs package root (and optional data) snapshots for reproducible worker fleets via Launch Templates / ASG.',
          'Enable EBS encryption by default; snapshots and restored volumes inherit the same encryption.',
          'Customer managed KMS keys add cross-account sharing and audit control — teaser for org-wide key policies.',
        ]}
      />
    </LessonArticle>
  )
}
