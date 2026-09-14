import type { SubTopic } from '../../../types'
import { AccessAnalyzerIdentityCenterAbac } from './lessons/access-analyzer-identity-center-abac'
import { AssumeRoleAndSts } from './lessons/assume-role-and-sts'
import { AuthenticationVsAuthorization } from './lessons/authentication-vs-authorization'
import { CrossAccountRoles } from './lessons/cross-account-roles'
import { ExplicitDenyAndEvaluation } from './lessons/explicit-deny-and-evaluation'
import { GettingStartedWithIam } from './lessons/getting-started-with-iam'
import { IamForDataPipelines } from './lessons/iam-for-data-pipelines'
import { IamPoliciesOverview } from './lessons/iam-policies-overview'
import { IamRoles } from './lessons/iam-roles'
import { IamUsersAndGroups } from './lessons/iam-users-and-groups'
import { InlineVsManagedPolicies } from './lessons/inline-vs-managed-policies'
import { LeastPrivilege } from './lessons/least-privilege'
import { PermissionBoundariesAndScp } from './lessons/permission-boundaries-and-scp'
import { PolicyJsonStructure } from './lessons/policy-json-structure'
import { PuttingItTogetherIam } from './lessons/putting-it-together-iam'
import { PuttingItTogetherIamBeginner } from './lessons/putting-it-together-iam-beginner'
import { RoleChainingAndStsDeep } from './lessons/role-chaining-and-sts-deep'
import { RootUserMfaPasswordPolicies } from './lessons/root-user-mfa-password-policies'
import { ServiceRolesEc2LambdaGlueRedshift } from './lessons/service-roles-ec2-lambda-glue-redshift'
import { TemporaryCredentials } from './lessons/temporary-credentials'

export const iamSubTopic: SubTopic = {
  id: 'iam',
  title: 'IAM',
  description:
    'Users, groups, roles, policies, STS, and least-privilege access for data pipelines — beginner to advanced.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-iam',
          title: 'Getting Started with IAM',
          description: 'Why identity comes first — roadmap and starter vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithIam,
        },
        {
          id: 'authentication-vs-authorization',
          title: 'Authentication vs Authorization',
          description: 'Who you are vs what you can do — the IAM mental split.',
          readTime: '10 min',
          component: AuthenticationVsAuthorization,
        },
        {
          id: 'root-user-mfa-password-policies',
          title: 'Root User, MFA & Passwords',
          description: 'Lock down the root user, require MFA, and set password rules.',
          readTime: '11 min',
          component: RootUserMfaPasswordPolicies,
        },
        {
          id: 'iam-users-and-groups',
          title: 'IAM Users & Groups',
          description: 'Human identities, groups, Console access, and access key hygiene.',
          readTime: '12 min',
          component: IamUsersAndGroups,
        },
        {
          id: 'iam-roles',
          title: 'IAM Roles',
          description: 'Temporary identities for jobs and services — prefer roles over long-lived keys.',
          readTime: '13 min',
          component: IamRoles,
        },
        {
          id: 'iam-policies-overview',
          title: 'Policies Overview',
          description: 'Identity-based, resource-based, and trust policies in plain English.',
          readTime: '12 min',
          component: IamPoliciesOverview,
        },
        {
          id: 'least-privilege',
          title: 'Least Privilege',
          description: 'Grant only what is needed — scoping Glue, analysts, and Lambda safely.',
          readTime: '11 min',
          component: LeastPrivilege,
        },
        {
          id: 'putting-it-together-iam-beginner',
          title: 'Beginner Checkpoint',
          description: 'Analyst vs ETL identities — confirm the mental model before policy JSON.',
          readTime: '9 min',
          component: PuttingItTogetherIamBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'policy-json-structure',
          title: 'Policy JSON Structure',
          description: 'Effect, Action, Resource, Condition, Principal — read and write policies.',
          readTime: '14 min',
          component: PolicyJsonStructure,
        },
        {
          id: 'explicit-deny-and-evaluation',
          title: 'Deny vs Allow & Evaluation',
          description: 'Explicit deny wins — how AWS evaluates multiple policies together.',
          readTime: '12 min',
          component: ExplicitDenyAndEvaluation,
        },
        {
          id: 'inline-vs-managed-policies',
          title: 'Inline vs Managed Policies',
          description: 'AWS managed, customer managed, and when teams prefer reusable policies.',
          readTime: '11 min',
          component: InlineVsManagedPolicies,
        },
        {
          id: 'assume-role-and-sts',
          title: 'AssumeRole & STS',
          description: 'sts:AssumeRole, trust policies, and temporary session credentials.',
          readTime: '13 min',
          component: AssumeRoleAndSts,
        },
        {
          id: 'temporary-credentials',
          title: 'Temporary Credentials',
          description: 'Why short-lived creds beat access keys — sessions, CLI, and SDKs.',
          readTime: '11 min',
          component: TemporaryCredentials,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'cross-account-roles',
          title: 'Cross-Account Roles',
          description: 'Shared lakes across accounts — trust, External ID, and confused deputy.',
          readTime: '14 min',
          component: CrossAccountRoles,
        },
        {
          id: 'service-roles-ec2-lambda-glue-redshift',
          title: 'Roles for EC2, Lambda, Glue & Redshift',
          description: 'Instance profiles, execution roles, Glue job roles, and COPY from S3.',
          readTime: '15 min',
          component: ServiceRolesEc2LambdaGlueRedshift,
        },
        {
          id: 'role-chaining-and-sts-deep',
          title: 'Role Chaining & STS Deep Dive',
          description: 'Chaining risks, AssumeRole vs GetSessionToken, multi-account patterns.',
          readTime: '13 min',
          component: RoleChainingAndStsDeep,
        },
        {
          id: 'permission-boundaries-and-scp',
          title: 'Permission Boundaries & SCPs',
          description: 'Organization guardrails and the maximum ceiling on identities.',
          readTime: '13 min',
          component: PermissionBoundariesAndScp,
        },
        {
          id: 'access-analyzer-identity-center-abac',
          title: 'Access Analyzer, Identity Center & ABAC',
          description: 'External access findings, workforce SSO, and tag-based access control.',
          readTime: '14 min',
          component: AccessAnalyzerIdentityCenterAbac,
        },
        {
          id: 'iam-for-data-pipelines',
          title: 'IAM for Data Pipelines',
          description: 'Human SSO vs job roles — ingest, transform, and serve separation.',
          readTime: '13 min',
          component: IamForDataPipelines,
        },
        {
          id: 'putting-it-together-iam',
          title: 'Putting It All Together',
          description: 'IAM checkpoint, interview quick checks, and what’s next (EC2).',
          readTime: '10 min',
          component: PuttingItTogetherIam,
        },
      ],
    },
  ],
}
