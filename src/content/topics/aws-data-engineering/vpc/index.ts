import type { SubTopic } from '../../../types'
import { CidrAndIpv4 } from './lessons/cidr-and-ipv4'
import { DnsAndDhcp } from './lessons/dns-and-dhcp'
import { FlowLogsAndNetworkFirewall } from './lessons/flow-logs-and-network-firewall'
import { GettingStartedWithVpc } from './lessons/getting-started-with-vpc'
import { IgwRouteTables } from './lessons/igw-route-tables'
import { LambdaVpcNetworking } from './lessons/lambda-vpc-networking'
import { NatGatewayAndInstance } from './lessons/nat-gateway-and-instance'
import { PublicPrivateIpEni } from './lessons/public-private-ip-eni'
import { PuttingItTogetherVpc } from './lessons/putting-it-together-vpc'
import { PuttingItTogetherVpcBeginner } from './lessons/putting-it-together-vpc-beginner'
import { Route53Overview } from './lessons/route53-overview'
import { SecurityGroupsVsNacls } from './lessons/security-groups-vs-nacls'
import { SubnetsAndAzs } from './lessons/subnets-and-azs'
import { VpcEndpoints } from './lessons/vpc-endpoints'
import { VpcForEc2RdsRedshift } from './lessons/vpc-for-ec2-rds-redshift'
import { VpcPeeringAndTgw } from './lessons/vpc-peering-and-tgw'
import { VpcSecurityChecklistDe } from './lessons/vpc-security-checklist-de'
import { VpnDirectConnectPrivatelink } from './lessons/vpn-direct-connect-privatelink'
import { WhatIsVpc } from './lessons/what-is-vpc'
import { WhichServicesNeedVpc } from './lessons/which-services-need-vpc'

export const vpcSubTopic: SubTopic = {
  id: 'vpc',
  title: 'VPC',
  description:
    'Private networking for data platforms — subnets, NAT, security groups, endpoints, and DE architectures.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-vpc',
          title: 'Getting Started with VPC',
          description: 'Why networking after Glue — keep data plane private.',
          readTime: '11 min',
          component: GettingStartedWithVpc,
        },
        {
          id: 'what-is-vpc',
          title: 'What Is VPC?',
          description: 'Your isolated virtual network in AWS — and why DE cares.',
          readTime: '10 min',
          component: WhatIsVpc,
        },
        {
          id: 'cidr-and-ipv4',
          title: 'CIDR & IPv4',
          description: 'Address planning with /16 and /24 — room for subnets and growth.',
          readTime: '12 min',
          component: CidrAndIpv4,
        },
        {
          id: 'subnets-and-azs',
          title: 'Subnets & Availability Zones',
          description: 'Public vs private subnets across AZs for HA data services.',
          readTime: '11 min',
          component: SubnetsAndAzs,
        },
        {
          id: 'igw-route-tables',
          title: 'Internet Gateway & Route Tables',
          description: 'How routes make a subnet public — and how private stays private.',
          readTime: '11 min',
          component: IgwRouteTables,
        },
        {
          id: 'nat-gateway-and-instance',
          title: 'NAT Gateway & NAT Instance',
          description: 'Outbound internet from private subnets without inbound exposure.',
          readTime: '11 min',
          component: NatGatewayAndInstance,
        },
        {
          id: 'security-groups-vs-nacls',
          title: 'Security Groups vs NACLs',
          description: 'Stateful vs stateless firewalls — Glue to RDS on 5432.',
          readTime: '12 min',
          component: SecurityGroupsVsNacls,
        },
        {
          id: 'putting-it-together-vpc-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm VPC basics before endpoints, peering, and DE layouts.',
          readTime: '9 min',
          component: PuttingItTogetherVpcBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'public-private-ip-eni',
          title: 'Public/Private IP & ENI',
          description: 'Elastic IPs, private addressing, and elastic network interfaces.',
          readTime: '11 min',
          component: PublicPrivateIpEni,
        },
        {
          id: 'dns-and-dhcp',
          title: 'DNS & DHCP Options',
          description: 'Name resolution inside the VPC and hybrid DNS tips.',
          readTime: '10 min',
          component: DnsAndDhcp,
        },
        {
          id: 'vpc-endpoints',
          title: 'VPC Endpoints',
          description: 'Gateway endpoints for S3/DynamoDB and interface PrivateLink endpoints.',
          readTime: '13 min',
          component: VpcEndpoints,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'vpc-peering-and-tgw',
          title: 'VPC Peering & Transit Gateway',
          description: 'Connect VPCs — peering limits vs TGW hub-and-spoke for platforms.',
          readTime: '12 min',
          component: VpcPeeringAndTgw,
        },
        {
          id: 'vpn-direct-connect-privatelink',
          title: 'VPN, Direct Connect & PrivateLink',
          description: 'Hybrid connectivity for on-prem sources into the lake.',
          readTime: '12 min',
          component: VpnDirectConnectPrivatelink,
        },
        {
          id: 'flow-logs-and-network-firewall',
          title: 'Flow Logs & Network Firewall',
          description: 'Debug REJECT traffic and add egress controls when required.',
          readTime: '11 min',
          component: FlowLogsAndNetworkFirewall,
        },
        {
          id: 'route53-overview',
          title: 'Route 53 Overview',
          description: 'Private hosted zones and DNS patterns for data services.',
          readTime: '10 min',
          component: Route53Overview,
        },
        {
          id: 'vpc-for-ec2-rds-redshift',
          title: 'VPC for EC2, RDS & Redshift',
          description: 'Reference layouts for compute and data stores in private subnets.',
          readTime: '13 min',
          component: VpcForEc2RdsRedshift,
        },
        {
          id: 'lambda-vpc-networking',
          title: 'Lambda VPC Networking',
          description: 'When functions need VPC access — ENIs, cold starts, and RDS Proxy.',
          readTime: '12 min',
          component: LambdaVpcNetworking,
        },
        {
          id: 'which-services-need-vpc',
          title: 'Which Services Need a VPC?',
          description: 'DE service matrix — S3/Athena defaults vs RDS/Redshift/Glue.',
          readTime: '11 min',
          component: WhichServicesNeedVpc,
        },
        {
          id: 'vpc-security-checklist-de',
          title: 'VPC Security Checklist for DE',
          description: 'No public RDS, S3 endpoints, least-privilege SGs — go-live checks.',
          readTime: '11 min',
          component: VpcSecurityChecklistDe,
        },
        {
          id: 'putting-it-together-vpc',
          title: 'Putting It All Together',
          description: 'VPC checkpoint, interview quick checks, and what’s next (EventBridge).',
          readTime: '10 min',
          component: PuttingItTogetherVpc,
        },
      ],
    },
  ],
}
