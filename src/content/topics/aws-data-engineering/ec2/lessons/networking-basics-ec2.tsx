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

export function NetworkingBasicsEc2() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Addresses on your virtual server">
        Every EC2 instance gets IP addresses so it can send and receive traffic. Some addresses are
        reachable from the internet; others work only inside your AWS network. Data engineers need both:
        SSH from a laptop uses a public path, while ETL jobs reading S3 or talking to RDS often use
        private networking for security and cost.
      </Callout>

      <Definition term="Private IP address">
        <p>
          A <strong className="text-white">private IP</strong> is an address used{' '}
          <em>inside</em> your VPC (Virtual Private Cloud). It is not routed on the public internet.
          Instances in the same VPC can reach each other by private IP — for example, an Airflow worker
          calling an internal API on another EC2 box at{' '}
          <code className="text-core-400">10.0.2.15</code>.
        </p>
        <p className="mt-2 text-slate-300">
          Private IPs can change when you stop and start an instance (unless tied to an Elastic Network
          Interface with a fixed private address). For stable internal DNS, teams use load balancers or
          service discovery — advanced topics for later.
        </p>
      </Definition>

      <Definition term="Public IP address">
        <p>
          A <strong className="text-white">public IP</strong> is reachable from the internet (when routing
          and security groups allow it). AWS can auto-assign a public IP at launch in a public subnet — handy
          for SSH during development. When you stop the instance, that public IP is usually released unless
          you use an Elastic IP.
        </p>
      </Definition>

      <LessonSection title="Public vs private — who can reach whom">
        <Flowchart
          title="Traffic paths to an EC2 instance"
          chart={`flowchart LR
  subgraph Internet["Internet"]
    DEV[Your laptop]
  end
  subgraph VPC["Your VPC"]
    subgraph PublicSubnet["Public subnet"]
      EC2P[EC2 with public IP]
    end
    subgraph PrivateSubnet["Private subnet"]
      EC2V[EC2 private IP only]
      RDS[(RDS database)]
    end
  end
  S3[(S3 — AWS service endpoint)]
  DEV -->|SSH if SG allows| EC2P
  EC2V -->|Private IP| RDS
  EC2V -->|Gateway or VPC endpoint| S3
  EC2P --> S3`}
        />
        <ContentStep number={1} title="Public subnet — learning and bastions">
          <p className="text-slate-300">
            A subnet with a route to an Internet Gateway can host instances with public IPs. Fine for a
            personal sandbox with SSH locked to your home IP. Not where you place production databases.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Private subnet — data workloads">
          <p className="text-slate-300">
            ETL workers that only pull from S3 and write to Redshift often live in private subnets — no
            direct inbound from the internet. Outbound to S3 may use a NAT Gateway or VPC endpoints (covered
            in the VPC module).
          </p>
        </ContentStep>
        <Callout variant="insight">
          S3 is not &quot;inside&quot; your VPC, but private subnets reach it via AWS networking without
          exposing the instance to inbound internet scans. That is why private IP workloads are standard for
          production pipelines.
        </Callout>
      </LessonSection>

      <LessonSection title="Elastic IP (EIP) — static public address">
        <Definition term="Elastic IP">
          <p>
            An <strong className="text-white">Elastic IP</strong> is a static public IPv4 address you
            allocate to your account and associate with an instance or network interface. If the instance
            fails, you can reattach the same EIP to a replacement — external allowlists and DNS records
            stay valid.
          </p>
        </Definition>
        <ContentStep number={1} title="When DE teams use EIP">
          <p className="text-slate-300">
            A fixed outbound IP for an ETL box that an on-premises firewall allowlists; a small public-facing
            API gateway on EC2 before moving to ALB; legacy integrations that hard-code an IP (prefer DNS
            when possible).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost caution">
          <p className="text-slate-300">
            An EIP attached to a running instance is free. An EIP allocated but{' '}
            <em>not</em> attached, or attached to a stopped instance, can incur hourly charges. Release EIPs
            you are not using.
          </p>
        </ContentStep>
        <Example title="Address types at a glance" caption="Beginner cheat sheet">
{`Address type     Reachable from     Changes on stop/start?   Typical DE use
Private IP       VPC internal       Often yes                Worker to RDS, internal APIs
Auto public IP   Internet if SG OK  Yes — released           Dev SSH sandbox
Elastic IP       Internet if SG OK  No — you keep the EIP    Static allowlist, failover`}
        </Example>
      </LessonSection>

      <LessonSection title="Why private IP for data workloads">
        <p className="text-slate-300">
          Production ETL and orchestration instances should not accept arbitrary inbound traffic from the
          internet. Placing them in private subnets with only private IPs shrinks attack surface: attackers
          cannot SSH to an address they cannot route to.
        </p>
        <ContentStep number={1} title="Outbound still works">
          <p className="text-slate-300">
            Private instances reach S3, Glue, and Athena through AWS network paths (NAT Gateway or VPC
            endpoints). Your Python script does not need a public IP to{' '}
            <code className="text-core-400">boto3.client('s3').download_file(...)</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Admin access without public SSH">
          <p className="text-slate-300">
            Engineers connect via a bastion host, VPN, or AWS Systems Manager Session Manager — SSH and
            access patterns in the next lesson. The data plane stays private; human access is a controlled
            side door.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Security Groups — teaser">
        <p className="text-slate-300">
          IP addresses tell you <em>where</em> to send packets;{' '}
          <strong className="text-white">Security Groups</strong> decide{' '}
          <em>whether</em> traffic is allowed. A security group is a stateful virtual firewall attached to
          an instance: rules like &quot;allow TCP 22 from my.home.ip/32&quot; or &quot;allow all outbound.&quot;
        </p>
        <ContentStep number={1} title="Default deny inbound">
          <p className="text-slate-300">
            Unless you add an inbound rule, nobody reaches your instance — even if it has a public IP. That
            is why connection timeouts are often security group issues, not &quot;instance down.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deep dive later">
          <p className="text-slate-300">
            Upcoming lessons cover security group design for DE: allowing Glue to reach a JDBC source,
            restricting Redis on an Airflow worker, and pairing SGs with private subnets. For now, remember:
            public IP + open SSH to 0.0.0.0/0 is a beginner mistake — restrict to your IP.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Quick debug checklist">
          Cannot SSH? Check in order: instance running → correct public IP → security group allows port 22
          from your current IP → correct key pair and Linux username → local firewall or corporate VPN
          blocking outbound 22.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Private IP: internal VPC traffic — preferred home for ETL workers and orchestration without internet exposure.',
          'Public IP: internet-reachable when routing and security groups allow — useful for dev SSH, released on stop unless EIP.',
          'Elastic IP: static public address for allowlists and failover — release unused EIPs to avoid charges.',
          'Security Groups control allowed traffic (deep dive later); no inbound rule means connection refused or timeout.',
        ]}
      />
    </LessonArticle>
  )
}
