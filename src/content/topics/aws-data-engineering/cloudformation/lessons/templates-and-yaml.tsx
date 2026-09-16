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

export function TemplatesAndYaml() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        A CloudFormation <strong className="text-white">template</strong> is a structured document — usually
        YAML — listing AWS resources and how they connect. You check it into Git like any other code.
        CloudFormation reads it and builds real S3 buckets, IAM roles, and Glue databases. YAML is preferred
        for readability because templates get long; indentation carries meaning, so use a consistent two-space
        style and validate before deploy.
      </Callout>

      <Definition term="CloudFormation template">
        <p>
          A <strong className="text-white">CloudFormation template</strong> is a JSON or YAML file with
          optional sections: <code className="text-core-400">AWSTemplateFormatVersion</code>,{' '}
          <code className="text-core-400">Description</code>, <code className="text-core-400">Parameters</code>,{' '}
          <code className="text-core-400">Mappings</code>, <code className="text-core-400">Conditions</code>,{' '}
          <code className="text-core-400">Resources</code>, and <code className="text-core-400">Outputs</code>.
          The <code className="text-core-400">Resources</code> section is required — everything else supports
          flexibility and reuse. DE platform templates often span hundreds of lines; clear section order and
          comments help reviewers.
        </p>
      </Definition>

      <LessonSection title="Template structure overview">
        <p className="text-slate-300">
          Beginners should recognize this skeleton before diving into individual resources. Advanced sections
          (Mappings, Conditions) appear in later lessons; this pass focuses on the layout you will read in
          every lake baseline repo.
        </p>
        <ContentStep number={1} title="Header and metadata">
          <p className="text-slate-300">
            <code className="text-core-400">AWSTemplateFormatVersion: '2010-09-09'</code> and a{' '}
            <code className="text-core-400">Description</code> explaining the stack — e.g. &quot;Acme medallion
            lake raw and curated buckets plus Glue service role.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parameters — inputs at deploy time">
          <p className="text-slate-300">
            Environment name, bucket name prefix, KMS key ARN — supplied when creating the stack so one
            template serves dev and prod.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Resources — the AWS objects">
          <p className="text-slate-300">
            Each logical name maps to a type like{' '}
            <code className="text-core-400">AWS::S3::Bucket</code> or{' '}
            <code className="text-core-400">AWS::IAM::Role</code> with a{' '}
            <code className="text-core-400">Properties</code> block.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Outputs — values after deploy">
          <p className="text-slate-300">
            Export bucket names and role ARNs for runbooks, CI smoke tests, or child stacks.
          </p>
        </ContentStep>
        <Flowchart
          title="Template sections — beginner reading order"
          chart={`flowchart TD
  H[Header Description]
  H --> P[Parameters]
  P --> R[Resources required]
  R --> O[Outputs]
  O --> DEP[Deploy stack]
  DEP --> LIVE[Live S3 IAM Glue]`}
        />
      </LessonSection>

      <LessonSection title="Why YAML for DE templates">
        <ContentStep number={1} title="Readable diffs in pull requests">
          <p className="text-slate-300">
            Adding a lifecycle rule or bucket policy line shows clearly in Git diff — reviewers spot accidental
            public access faster than in nested JSON braces.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Less punctuation noise">
          <p className="text-slate-300">
            JSON is valid CloudFormation but verbose. YAML drops commas and quotes in most places — helpful
            when a platform template lists twenty S3 and IAM resources.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Watch indentation">
          <p className="text-slate-300">
            YAML errors from mixed tabs and spaces cause cryptic deploy failures. Use spaces only, run{' '}
            <code className="text-core-400">cfn-lint</code> or IDE validation before{' '}
            <code className="text-core-400">create-stack</code>.
          </p>
        </ContentStep>
        <Callout variant="tip" title="JSON still appears">
          Some teams embed JSON inside YAML for IAM policy documents — that is normal. The outer template
          stays YAML; inner <code className="text-core-400">PolicyDocument</code> blocks often use JSON
          syntax for clarity with AWS IAM.
        </Callout>
      </LessonSection>

      <LessonSection title="AWS:: resource definitions — the naming pattern">
        <p className="text-slate-300">
          Every resource type follows <code className="text-core-400">AWS::Service::Resource</code>. You pick
          a <strong className="text-white">logical ID</strong> (your label in the template); CloudFormation
          assigns the <strong className="text-white">physical ID</strong> (actual bucket name or role ARN in
          AWS).
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">DE use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['AWS::S3::Bucket', 'Raw, curated, quarantine lake prefixes'],
                ['AWS::IAM::Role', 'Glue job role, Lambda execution role'],
                ['AWS::IAM::Policy', 'Inline or managed policy attached to a role'],
                ['AWS::Glue::Database', 'Catalog database for medallion layers'],
                ['AWS::Glue::Crawler', 'Schema discovery on raw prefix'],
                ['AWS::Lambda::Function', 'Landing validation, lightweight transforms'],
                ['AWS::Events::Rule', 'EventBridge rule for S3 or schedule triggers'],
                ['AWS::CloudWatch::Alarm', 'Alert on Glue job failures or S3 errors'],
              ].map(([type, use]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">
                    <code className="text-core-400">{type}</code>
                  </td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Logical ID — your nickname">
          <p className="text-slate-300">
            <code className="text-core-400">RawLandingBucket</code> is how other resources reference this
            bucket inside the template — not necessarily the final S3 name in AWS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Properties — service-specific settings">
          <p className="text-slate-300">
            Versioning, encryption, tags, lifecycle rules for S3; assume role policy and managed policies for
            IAM — documented in AWS CloudFormation resource reference pages.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Mini example — S3 raw landing bucket">
        <p className="text-slate-300">
          This minimal snippet shows one resource with DE-friendly defaults: versioning, AES256 encryption,
          and public access blocked. Parameters and outputs come in the next lesson; here the focus is YAML
          shape and <code className="text-core-400">AWS::S3::Bucket</code> properties.
        </p>
        <Example title="Minimal lake raw bucket resource" caption="YAML inside a template Resources section">
{`Resources:
  RawLandingBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'acme-lake-raw-\${EnvironmentName}'
      VersioningConfiguration:
        Status: Enabled
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      Tags:
        - Key: Layer
          Value: raw
        - Key: ManagedBy
          Value: CloudFormation`}
        </Example>
        <Callout variant="insight">
          <code className="text-core-400">!Sub</code> is a YAML short form for substituting parameters into
          strings — intrinsics get a full lesson next module. For now, read it as &quot;build the bucket name
          from EnvironmentName.&quot;
        </Callout>
      </LessonSection>

      <LessonSection title="Validate before you deploy">
        <ContentStep number={1} title="Lint locally">
          <p className="text-slate-300">
            Tools like cfn-lint catch invalid property names and unsupported combinations before AWS rejects
            the stack mid-create.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deploy to dev first">
          <p className="text-slate-300">
            Never first-run a lake template in prod. Dev stack proves IAM and bucket names; change sets gate
            prod updates.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Store templates in Git">
          <p className="text-slate-300">
            S3 template URLs work for CI, but the authoritative copy should live in version control with
            reviews — same as Glue scripts.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Templates have sections: header, Parameters, Resources (required), Outputs — plus Mappings/Conditions later.',
          'YAML is preferred for DE platform templates — readable diffs; mind indentation and validate with cfn-lint.',
          'Resources use AWS::Service::Resource types with logical IDs and Properties — e.g. AWS::S3::Bucket for lake storage.',
          'Start with small Resources blocks (versioned encrypted S3) before wiring IAM, Glue, and EventBridge in one stack.',
        ]}
      />
    </LessonArticle>
  )
}
