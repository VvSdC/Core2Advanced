import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AccessAnalyzerIdentityCenterAbac() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Find leaks before attackers do">
        Writing least-privilege policies is half the job — the other half is proving nothing became
        public by mistake and that humans sign in through SSO, not shared IAM users. Three AWS capabilities
        matter for mature data platforms: <strong className="text-white">Access Analyzer</strong>,{' '}
        <strong className="text-white">IAM Identity Center</strong>, and{' '}
        <strong className="text-white">ABAC</strong> with tags.
      </Callout>

      <Definition term="IAM Access Analyzer">
        <p>
          <strong className="text-white">IAM Access Analyzer</strong> continuously analyzes resource
          policies (S3, IAM roles, KMS, Lambda, SQS, etc.) and reports{' '}
          <strong className="text-white">findings</strong> when a resource is accessible from outside
          your account or organization — or more broadly than intended. It helps catch accidental public
          lake buckets and over-trusty cross-account role policies before a scanner finds them.
        </p>
      </Definition>

      <LessonSection title="Access Analyzer — findings and external access">
        <ContentStep number={1} title="What it detects">
          <p className="text-slate-300">
            Findings like: S3 bucket policy allows public read; IAM role trust policy allows any principal
            in another account; KMS key policy grants decrypt to <span className="font-mono text-sm">*</span>.
            Each finding includes the resource ARN and which statement caused external access.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE workflow">
          <p className="text-slate-300">
            Run an analyzer in the lake account after every Terraform apply. Wire high-severity findings
            to Slack or Security Hub. Before onboarding a new vendor ETL role, validate no stale finding
            says your staging bucket is world-readable.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a replacement for good policy design">
          <p className="text-slate-300">
            Access Analyzer reports effective external access — it does not fix policies for you. Pair with
            S3 Block Public Access, least-privilege trust policies, and periodic IAM Access Analyzer
            archive/resolution when you intentionally accept a cross-account read for Redshift Spectrum.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Enable the organization-wide analyzer so every account&apos;s lake buckets and Glue-connected
          roles are in scope — not just the central data account you remember to check.
        </Callout>
      </LessonSection>

      <LessonSection title="IAM Identity Center — workforce SSO">
        <Definition term="IAM Identity Center (formerly AWS SSO)">
          <p>
            <strong className="text-white">IAM Identity Center</strong> is AWS&apos;s workforce access
            hub: users authenticate once (often via Okta, Azure AD, or Google) and receive{' '}
            <strong className="text-white">permission sets</strong> that map to IAM roles in target
            accounts. Analysts get Athena read in dev; senior engineers get a broader prod role — without
            distributing access keys.
          </p>
        </Definition>
        <ContentStep number={1} title="Permission sets → roles">
          <p className="text-slate-300">
            A permission set is a template (policies + session duration) provisioned as a role in each
            assigned account. <span className="font-mono text-sm">aws sso login</span> then{' '}
            <span className="font-mono text-sm">aws sts get-caller-identity</span> shows an assumed-role
            ARN tied to the human — excellent CloudTrail attribution.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why DE teams adopt it">
          <p className="text-slate-300">
            Offboarding removes IdP access and SSO assignments — no hunting for stray IAM users with S3
            full access. Multi-account lake + analytics setups become manageable: one login, pick account
            and role, query Redshift or run Glue tests.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Separate humans from job roles">
          <p className="text-slate-300">
            SSO roles for people; IAM roles for Glue/Lambda/EC2. Never share the Glue job role ARN with
            analysts &quot;just to debug&quot; — create a read-only SSO permission set on the same prefixes instead.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="ABAC — Attribute-Based Access Control with tags">
        <Definition term="ABAC">
          <p>
            <strong className="text-white">Attribute-Based Access Control</strong> grants access based on
            attributes — commonly <strong className="text-white">resource tags</strong> and{' '}
            <strong className="text-white">principal tags</strong> — using IAM policy Conditions like{' '}
            <span className="font-mono text-sm">aws:ResourceTag/env</span> and{' '}
            <span className="font-mono text-sm">aws:PrincipalTag/team</span>. Instead of one policy per
            bucket, you write: &quot;Allow S3 read when resource tag env matches principal tag env.&quot;
          </p>
        </Definition>
        <ContentStep number={1} title="DE use case — env=prod tag">
          <p className="text-slate-300">
            Tag lake buckets <span className="font-mono text-sm">env=prod</span> or{' '}
            <span className="font-mono text-sm">env=dev</span>. SSO permission sets tag the analyst
            principal with the same key. Policy Allow <span className="font-mono text-sm">s3:GetObject</span>{' '}
            only when <span className="font-mono text-sm">aws:ResourceTag/env</span> equals{' '}
            <span className="font-mono text-sm">aws:PrincipalTag/env</span>. Prod analysts cannot read dev
            buckets accidentally labeled wrong — and vice versa — if tagging discipline holds.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue and Lambda roles with ABAC">
          <p className="text-slate-300">
            Tag Glue jobs and IAM roles with <span className="font-mono text-sm">datazone=curated</span>.
            Policies Allow writes only to S3 objects whose tags match. Scales when you have hundreds of
            datasets — fewer static ARNs in policy JSON.
          </p>
        </ContentStep>
        <ContentStep number={3} title="ABAC requires tag governance">
          <p className="text-slate-300">
            ABAC fails open or closed depending on design if tags are missing. Use SCPs or tag policies
            to require <span className="font-mono text-sm">env</span> and <span className="font-mono text-sm">owner</span>{' '}
            on new buckets; audit with Config rules. Bad tags = bad access — treat tags as authorization data.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview trio: Access Analyzer finds unintended external access; Identity Center federates
          humans to account roles; ABAC scales IAM with tags instead of ARN lists.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'IAM Access Analyzer reports findings when resource policies expose access outside your account or org — audit lake buckets and role trust policies regularly.',
          'IAM Identity Center provides workforce SSO via permission sets mapped to account roles — separate human access from Glue/Lambda job roles.',
          'ABAC uses tag conditions (e.g. env=prod) on principals and resources to scale policies beyond static bucket ARN lists.',
          'DE maturity: org-wide analyzer + SSO for analysts + tag governance for ABAC on S3 and Glue resources.',
        ]}
      />
    </LessonArticle>
  )
}
