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

export function WhatIsCloudComputing() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        Cloud computing means using someone else&apos;s computers over the internet instead of buying
        and maintaining your own servers in a closet. You request capacity when you need it and stop
        paying when you do not — like renting electricity from the grid instead of owning a diesel
        generator in the backyard.
      </Callout>

      <Definition term="Cloud computing">
        <p>
          <strong className="text-white">Cloud computing</strong> is on-demand delivery of compute,
          storage, networking, and higher-level services from a provider&apos;s shared pool of
          resources. You pay for what you use, scale up or down quickly, and the provider handles
          physical hardware, power, cooling, and baseline security of the facilities.
        </p>
      </Definition>

      <LessonSection title="The electricity analogy">
        <Example title="Owning vs renting" caption="Same idea, different scale">
{`Own a generator:
  - Buy hardware upfront (CapEx)
  - Maintain fuel, repairs, spare parts
  - Capacity fixed — too small in peak season, idle the rest of the year

Use the power grid:
  - Pay per kilowatt-hour (OpEx)
  - Utility maintains infrastructure
  - Scale usage up or down with your needs`}
        </Example>
        <p className="text-slate-300">
          Data teams face the same tradeoff. Buying servers for a nightly batch job that runs two hours
          means paying for idle machines the other 22 hours. Cloud lets you spin up exactly what the
          pipeline needs, then shut it down.
        </p>
      </LessonSection>

      <LessonSection title="On-demand shared pools">
        <p className="text-slate-300">
          A cloud provider like AWS operates massive data centers worldwide. Thousands of customers share
          the same physical infrastructure, but your virtual resources — EC2 instances, S3 buckets,
          databases — are isolated by software. When you launch a server, AWS allocates capacity from
          that pool in seconds.
        </p>
        <ContentStep number={1} title="Compute">
          <p className="text-slate-300">
            Virtual machines (EC2), containers, serverless functions (Lambda) — run ETL jobs, Spark
            clusters, or API glue code without rack mounting hardware.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Storage">
          <p className="text-slate-300">
            Object storage (S3), block volumes (EBS), file systems (EFS) — hold raw logs, Parquet
            files, and warehouse backups at petabyte scale.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Networking">
          <p className="text-slate-300">
            Virtual networks (VPC), load balancers, private links — move data securely between
            on-premises systems and the cloud.
          </p>
        </ContentStep>
        <Flowchart
          title="How a cloud request works"
          chart={`flowchart LR
  A[You — request resources] --> B[Cloud provider API]
  B --> C[Shared pool of hardware]
  C --> D[Your isolated virtual resources]
  D --> E[Pay for usage meter]`}
        />
      </LessonSection>

      <LessonSection title="Why data engineers care">
        <ContentStep number={1} title="Elastic pipelines">
          <p className="text-slate-300">
            Black Friday traffic spike? Scale Glue workers or Redshift nodes temporarily. Quiet month?
            Scale back. Your pipeline size follows data volume, not a fixed server purchase from 2019.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pay for what you use">
          <p className="text-slate-300">
            S3 charges per gigabyte stored; Lambda charges per invocation; Athena charges per terabyte
            scanned. You align cost with actual workload instead of over-provisioning &quot;just in
            case.&quot;
          </p>
        </ContentStep>
        <ContentStep number={3} title="Managed services reduce toil">
          <p className="text-slate-300">
            Glue, RDS, and Redshift handle patching, backups, and scaling knobs so your team spends time
            on data quality and SLAs, not replacing failed disk drives at 2 a.m.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Cloud is not magic — you still design pipelines, set permissions, and watch costs. But it
          removes the slowest part of on-premises life: waiting months for hardware and fighting fixed
          capacity.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cloud computing = on-demand compute, storage, and networking from a provider\'s shared pool — pay as you go.',
          'Analogy: rent electricity from the grid instead of owning and maintaining a private generator.',
          'Data engineers benefit from elastic pipelines, usage-based pricing, and managed services that reduce operational toil.',
        ]}
      />
    </LessonArticle>
  )
}
