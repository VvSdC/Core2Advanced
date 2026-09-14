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

export function SharedResponsibilityModel() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Security is a team sport">
        AWS protects the <em>cloud</em> — datacenters, hardware, hypervisors, and the managed control
        planes of services like S3 and Glue. You protect what you run <em>in</em> the cloud — data
        classification, bucket policies, encryption choices, network rules, and patching on EC2. Both
        sides have jobs; confusion about who owns what causes breaches.
      </Callout>

      <Definition term="Shared Responsibility Model">
        <p>
          The <strong className="text-white">Shared Responsibility Model</strong> splits security and
          compliance duties between AWS and the customer. AWS is responsible for{' '}
          <strong className="text-white">security of the cloud</strong>; you are responsible for{' '}
          <strong className="text-white">security in the cloud</strong>. The exact split shifts with
          IaaS vs managed services — more AWS responsibility on RDS, more yours on EC2.
        </p>
      </Definition>

      <LessonSection title="What AWS typically handles">
        <ContentStep number={1} title="Physical and environmental">
          <p className="text-slate-300">
            Building security, power, cooling, fire suppression, and hardware lifecycle in Regions and
            AZs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Foundation software">
          <p className="text-slate-300">
            Hypervisor, managed service backends, patching the RDS engine version you select, durability
            of S3 storage across AZs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Global infrastructure">
          <p className="text-slate-300">
            Networking between AZs within a Region, compliance certifications for the underlying
            platform (SOC, ISO — read AWS Artifact for details).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What you typically handle">
        <ContentStep number={1} title="Identity and access">
          <p className="text-slate-300">
            IAM users, roles, policies, MFA, and permission boundaries. A Glue job role should read only
            the buckets it needs — not every object in the account.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data protection">
          <p className="text-slate-300">
            Choosing encryption (SSE-S3, SSE-KMS, client-side), managing KMS keys, classifying PII, and
            defining retention. AWS stores bits; you decide who decrypts them.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Network configuration">
          <p className="text-slate-300">
            VPC design, security groups, NACLs, public vs private subnets, VPC endpoints so S3 traffic
            stays off the public internet.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Guest OS and apps on IaaS">
          <p className="text-slate-300">
            On EC2 you patch the operating system, harden SSH, and secure application code. On Lambda,
            AWS patches the runtime; you secure your function code and dependencies.
          </p>
        </ContentStep>
        <Flowchart
          title="Shared responsibility split"
          chart={`flowchart TB
  subgraph Customer["You — security IN the cloud"]
    C1[IAM and access policies]
    C2[Encryption and key management]
    C3[VPC and security groups]
    C4[Application code and data classification]
  end
  subgraph AWS["AWS — security OF the cloud"]
    A1[Physical datacenters]
    A2[Hardware and hypervisor]
    A3[Managed service infrastructure]
  end
  C1 --> A1
  C2 --> A2
  C3 --> A3
  C4 --> A3`}
        />
      </LessonSection>

      <LessonSection title="Examples for data engineering">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">AWS</th>
                <th className="px-4 py-3">You</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['S3 bucket', 'Durability, availability of storage platform', 'Block public access, bucket policy, encryption, lifecycle'],
                ['Glue job', 'Managed Spark runtime infrastructure', 'Script code, IAM role, source/target bucket permissions'],
                ['Redshift cluster', 'Managed warehouse service, underlying patching', 'Table data, user grants, encryption keys, network placement'],
                ['EC2 ETL box', 'Physical host, hypervisor', 'OS patches, security groups, installed agents, secrets handling'],
              ].map(([resource, aws, you]) => (
                <tr key={resource} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{resource}</td>
                  <td className="px-4 py-3">{aws}</td>
                  <td className="px-4 py-3">{you}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="S3 public bucket mistake" caption="Classic customer-side failure">
{`Misconfiguration:
  Block Public Access: OFF
  Bucket policy: Principal "*", Action s3:GetObject

Result:
  Anyone on the internet can download your lake files

Fix (your job):
  Enable Block Public Access, least-privilege policies, audit with Access Analyzer`}
        </Example>
      </LessonSection>

      <LessonSection title="Who encrypts the data lake?">
        <p className="text-slate-300">
          AWS provides encryption mechanisms; you turn them on and manage keys. Default SSE-S3 encrypts
          objects at rest with AWS-managed keys — good baseline. SSE-KMS gives you audit trails via
          CloudTrail and fine-grained key policies — better for regulated data. Client-side encryption
          means you encrypt before upload — maximum control, more application work.
        </p>
        <Callout variant="insight">
          Interview sound bite: &quot;AWS encrypts the infrastructure; the data owner chooses algorithm,
          key management, and who has decrypt permissions via IAM and KMS.&quot;
        </Callout>
        <Callout variant="tip">
          Enable S3 Block Public Access at the account level on day one. Combine with IAM roles for
          Glue and Lambda instead of long-lived keys — covered deeply in IAM and S3 lessons later.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AWS secures the cloud (hardware, facilities, managed backends); you secure in the cloud (data, IAM, network, apps).',
          'S3, IAM, encryption, and VPC rules are customer responsibilities — misconfigurations are not AWS outages.',
          'For data lakes: enable encryption, block public access, use least-privilege roles, and know who manages keys (SSE-S3 vs KMS).',
        ]}
      />
    </LessonArticle>
  )
}
