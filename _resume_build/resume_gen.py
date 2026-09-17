# -*- coding: utf-8 -*-
"""
Generate an ATS-optimized resume as both .docx and .pdf from a single content
source. ATS-friendly choices: single column, no tables/text-boxes/images,
standard section headings, standard font (Calibri/Helvetica), simple bullets,
visible URLs (also hyperlinked for humans), consistent Mon YYYY dates.
"""
import os

# ----------------------------------------------------------------------------
# CONTENT (single source of truth)
# ----------------------------------------------------------------------------
NAME = "Vummethala Venkata Sri Datta Charan"
LOCATION = "Hyderabad, India"
PHONE = "+91-9390879538"
EMAIL = "vvsdcharan2001@gmail.com"

LINKS = [
    ("LinkedIn", "linkedin.com/in/vummethala-venkata-sri-dattacharan",
     "https://linkedin.com/in/vummethala-venkata-sri-dattacharan"),
    ("GitHub", "github.com/VvSdC", "https://github.com/VvSdC"),
    ("Portfolio", "vvsd-charan.netlify.app", "https://vvsd-charan.netlify.app/"),
]

SUMMARY = (
    "AI Security and Generative AI Engineer with 2+ years at Infosys. Makes LLM and agent systems "
    "safe and secure through guardrails, red-teaming, and safety fine-tuning. Also builds autonomous "
    "agents that find and validate real software vulnerabilities. Focused on shipping AI developer "
    "tools that teams can trust."
)

EXPERIENCE = [
    {
        "company": "Infosys",
        "title": "Generative AI and AI Security Engineer (Specialist Programmer L2)",
        "location": "Hyderabad, India",
        "dates": "Jul 2024 - Present",
        "bullets": [
            "Built a vulnerability-management system that maps linked GitHub repositories and their "
            "live deployments into a cross-repository dependency graph for context-aware discovery "
            "across services.",

            "Designed an autonomous pipeline that finds vulnerabilities, validates their real-world "
            "impact, generates proof-of-concept (PoC) exploits in a secure sandbox, and returns clear "
            "remediation steps.",

            "Reached 69.2% average recall on the RealVuln Python benchmark, ahead of leading models "
            "and agentic vulnerability detectors like Devin, Google Mantis, and Claude Opus 5.",

            "Fine-tuned Small Language Models (SLMs) with Supervised Fine-Tuning (SFT), raising safety "
            "scores 36% on Stanford AIR-Bench and secure-code scores 18% on Meta PurpleLlama, with no "
            "loss in helpfulness.",

            "Developed security guardrails and hooks for AI coding assistants (GitHub Copilot and "
            "Claude Code) that block supply-chain attacks, stop irreversible commands, and run "
            "real-time PII redaction and static analysis, adapted to each client team's workflow.",

            "Built a LangGraph multi-agent workflow that reviews Statement of Work (SOW) compliance "
            "for the DPO, Legal, and Responsible AI (RAI) teams.",

            "The workflow classifies use cases and risk types, extracts parameters, and recommends "
            "EU AI Act actions, cutting review time from 60 to 20 minutes per SOW (67%).",

            "Led manual and automated red-teaming (PAIR, TAP, and Promptfoo) on AI applications, then "
            "used the failure data to guide targeted safety fine-tuning.",

            "Created a data pipeline between the data-sourcing and model teams that filters toxic and "
            "insecure code and redacts PII across millions of training records.",
        ],
    }
]

EDUCATION = {
    "school": "IIITDM Jabalpur",
    "degree": "B.Tech in Computer Science and Engineering",
    "location": "Jabalpur, Madhya Pradesh, India",
    "dates": "2020 - 2024",
    "extra": "CPI: 7.9 / 10.0",
}

PROJECTS = [
    {
        "name": "ShopAI - Hybrid Agentic E-Commerce Platform",
        "stack": "React, Node.js, Express.js, MongoDB, LangGraph, LangSmith, Langfuse, Docker, Redis, BullMQ",
        "links": [
            ("GitHub", "github.com/VvSdC/ShopAI", "https://github.com/VvSdC/ShopAI"),
            ("Live", "shopaicommerce.netlify.app", "https://shopaicommerce.netlify.app/"),
        ],
        "bullets": [
            "Developed a hybrid search engine combining keyword and vector-based bi-encoder search, "
            "using Reciprocal Rank Fusion (RRF) to merge results and cross-encoder rerankers to surface "
            "the most relevant products.",
            "Designed a resilient AI-inference layer with a fallback chain across five providers "
            "(OpenRouter, Gemini, Mistral, Hugging Face, Groq) to ensure continuous availability during "
            "provider failures or rate limits.",
            "Secured agent workflows with guardrails that scrub PII from user messages before LLM "
            "submission, and enforced session sandboxing to isolate users and protect data privacy.",
            "Created a continuous evaluation suite using LangSmith and Langfuse that runs test cases "
            "against live agent workflows and uses an LLM judge to assess response accuracy.",
            "Boosted backend throughput with Redis and BullMQ to offload background tasks (expiring "
            "checkouts, auto-tagging products, clearing coupon caches), keeping the main API responsive.",
            "Delivered the full-stack architecture with React and Express, integrating secure checkout "
            "and user-authentication flows end-to-end.",
        ],
    }
]

PUBLICATIONS = [
    {
        "title": "Mify-Coder: State-of-the-art Small Language Model",
        "meta": "arXiv:2512.23747, December 2025",
        "url": "https://arxiv.org/abs/2512.23747",
        "contribution": (
            "Contribution: Led safety alignment via Supervised Fine-Tuning (SFT) for secure code "
            "generation, built pipelines to filter toxicity and PII from training datasets, and "
            "evaluated the model against the Stanford AIR-Bench and Meta PurpleLlama cybersecurity "
            "benchmarks."
        ),
    }
]

ACHIEVEMENTS = [
    "Infosys STG Insta Award for SLM Safety Excellence (Feb 2026): recognized for delivering "
    "measurable safety-benchmark gains across Infosys's Small Language Model fine-tuning program.",
    "Google Cloud Agentic AI Day Finalist (Jul 2025): finished in the top 700 of over 50,000 teams; "
    "built Sahayak AI, a multimodal and multilingual teaching assistant for multigrade classrooms "
    "using RAG on Google Cloud.",
]

SKILLS = [
    ("AI Security",
     "Vulnerability Management, Harness Engineering, Software Supply-Chain Security, "
     "Software Composition Analysis (SCA), Prompt Injection and Jailbreak Detection and Mitigation, "
     "Responsible AI"),
    ("Alignment and Evaluation",
     "Supervised Fine-Tuning (SFT), LoRA, QLoRA, Synthetic Data Generation, Red Teaming "
     "(PAIR, TAP, Promptfoo), LLM Benchmarking"),
    ("Agent Frameworks",
     "LangChain, LangGraph, CrewAI, LlamaIndex, Model Context Protocol (MCP), Multi-Agent Workflows, "
     "Prompt Engineering, RAG"),
    ("Machine Learning and Data",
     "PyTorch, Hugging Face Transformers, Scikit-learn, CNN, RNN, NumPy, Pandas, FAISS, Pinecone, "
     "Chroma, MongoDB, MySQL"),
    ("Full-Stack",
     "Python, TypeScript, React, Node.js, Express.js, Redux, REST APIs, JWT"),
    ("Infrastructure",
     "NVIDIA H100, NVIDIA B200, Slurm, Azure VM, Docker, Git, vLLM, Azure OpenAI, Cursor"),
]

CERTIFICATIONS = [
    "Claude Certified Architect (Early Adopter) - Anthropic",
    "Microsoft Certified: Azure AI Engineer Associate - Microsoft",
    "Applied Generative AI Professional - Infosys",
]

OUT_DIR = r"C:\Users\SRIDATTA CHARAN\Downloads"
DOCX_PATH = os.path.join(OUT_DIR, "Vummethala_Charan_Resume.docx")
PDF_PATH = os.path.join(OUT_DIR, "Vummethala_Charan_Resume.pdf")

FONT = "Calibri"
ACCENT = "1F3864"   # dark navy for headings (prints fine, ATS ignores color)
LINKCOL = "0563C1"


# ============================================================================
# DOCX
# ============================================================================
def build_docx():
    from docx import Document
    from docx.shared import Pt, RGBColor, Inches
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement

    doc = Document()

    # base style
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(10.5)
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.space_before = Pt(0)

    for section in doc.sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.6)
        section.right_margin = Inches(0.6)

    def spacer(pts=4):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        p.runs  # noqa
        p.paragraph_format.line_spacing = Pt(pts)

    def add_hyperlink(paragraph, text, url, size=10.5):
        part = paragraph.part
        r_id = part.relate_to(
            url,
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
            is_external=True,
        )
        hyperlink = OxmlElement("w:hyperlink")
        hyperlink.set(qn("r:id"), r_id)
        run = OxmlElement("w:r")
        rpr = OxmlElement("w:rPr")
        rfonts = OxmlElement("w:rFonts")
        rfonts.set(qn("w:ascii"), FONT)
        rfonts.set(qn("w:hAnsi"), FONT)
        rpr.append(rfonts)
        col = OxmlElement("w:color")
        col.set(qn("w:val"), LINKCOL)
        rpr.append(col)
        u = OxmlElement("w:u")
        u.set(qn("w:val"), "single")
        rpr.append(u)
        sz = OxmlElement("w:sz")
        sz.set(qn("w:val"), str(int(size * 2)))
        rpr.append(sz)
        run.append(rpr)
        t = OxmlElement("w:t")
        t.text = text
        run.append(t)
        hyperlink.append(run)
        paragraph._p.append(hyperlink)

    def section_heading(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(text.upper())
        r.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = RGBColor.from_string(ACCENT)
        # bottom border
        pPr = p._p.get_or_add_pPr()
        pbdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        bottom.set(qn("w:val"), "single")
        bottom.set(qn("w:sz"), "6")
        bottom.set(qn("w:space"), "1")
        bottom.set(qn("w:color"), "999999")
        pbdr.append(bottom)
        pPr.append(pbdr)
        return p

    def bullet(text):
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Inches(0.22)
        p.paragraph_format.line_spacing = 1.0
        r = p.add_run(text)
        r.font.size = Pt(10.5)
        return p

    # ---- Header ----
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(NAME)
    r.bold = True
    r.font.size = Pt(20)
    r.font.color.rgb = RGBColor.from_string(ACCENT)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(LOCATION + "  |  " + PHONE + "  |  ")
    r.font.size = Pt(10.5)
    add_hyperlink(p, EMAIL, "mailto:" + EMAIL)

    # links line
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    for i, (label, shown, url) in enumerate(LINKS):
        if i:
            sep = p.add_run("  |  ")
            sep.font.size = Pt(10.5)
        lab = p.add_run(label + ": ")
        lab.font.size = Pt(10.5)
        add_hyperlink(p, shown, url)

    # ---- Summary ----
    section_heading("Summary")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    p.add_run(SUMMARY).font.size = Pt(10.5)

    # ---- Experience ----
    section_heading("Experience")
    for job in EXPERIENCE:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(0)
        left = p.add_run(job["company"])
        left.bold = True
        left.font.size = Pt(11)
        tab = p.add_run("\t")
        # right-aligned date via tab stop
        from docx.enum.text import WD_TAB_ALIGNMENT
        from docx.shared import Inches as _In
        p.paragraph_format.tab_stops.add_tab_stop(_In(7.0), WD_TAB_ALIGNMENT.RIGHT)
        rt = p.add_run(job["dates"])
        rt.font.size = Pt(10.5)

        p2 = doc.add_paragraph()
        p2.paragraph_format.space_after = Pt(2)
        it = p2.add_run(job["title"])
        it.italic = True
        it.font.size = Pt(10.5)
        p2.add_run("\t")
        p2.paragraph_format.tab_stops.add_tab_stop(_In(7.0), WD_TAB_ALIGNMENT.RIGHT)
        lc = p2.add_run(job["location"])
        lc.italic = True
        lc.font.size = Pt(10.5)

        for b in job["bullets"]:
            bullet(b)

    # ---- Education ----
    section_heading("Education")
    from docx.enum.text import WD_TAB_ALIGNMENT
    from docx.shared import Inches as _In
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(EDUCATION["school"])
    r.bold = True
    r.font.size = Pt(11)
    p.add_run("\t")
    p.paragraph_format.tab_stops.add_tab_stop(_In(7.0), WD_TAB_ALIGNMENT.RIGHT)
    r = p.add_run(EDUCATION["location"])
    r.font.size = Pt(10.5)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(EDUCATION["degree"] + "  |  " + EDUCATION["extra"])
    r.italic = True
    r.font.size = Pt(10.5)
    p.add_run("\t")
    p.paragraph_format.tab_stops.add_tab_stop(_In(7.0), WD_TAB_ALIGNMENT.RIGHT)
    r = p.add_run(EDUCATION["dates"])
    r.font.size = Pt(10.5)

    # ---- Projects ----
    section_heading("Projects")
    for proj in PROJECTS:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(proj["name"])
        r.bold = True
        r.font.size = Pt(11)
        p.add_run("   ")
        for i, (label, shown, url) in enumerate(proj["links"]):
            if i:
                p.add_run(" | ").font.size = Pt(10)
            lab = p.add_run(label + ": ")
            lab.font.size = Pt(10)
            add_hyperlink(p, shown, url, size=10)
        ps = doc.add_paragraph()
        ps.paragraph_format.space_after = Pt(2)
        rs = ps.add_run(proj["stack"])
        rs.italic = True
        rs.font.size = Pt(10)
        for b in proj["bullets"]:
            bullet(b)

    # ---- Publications ----
    section_heading("Publications")
    for pub in PUBLICATIONS:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(pub["title"] + ". ")
        r.bold = True
        r.font.size = Pt(10.5)
        add_hyperlink(p, pub["meta"], pub["url"])
        p2 = doc.add_paragraph()
        p2.paragraph_format.space_after = Pt(2)
        p2.add_run(pub["contribution"]).font.size = Pt(10.5)

    # ---- Achievements ----
    section_heading("Achievements")
    for a in ACHIEVEMENTS:
        bullet(a)

    # ---- Skills ----
    section_heading("Technical Skills")
    for cat, items in SKILLS:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(cat + ": ")
        r.bold = True
        r.font.size = Pt(10.5)
        r2 = p.add_run(items)
        r2.font.size = Pt(10.5)

    # ---- Certifications ----
    section_heading("Certifications")
    for c in CERTIFICATIONS:
        bullet(c)

    doc.save(DOCX_PATH)
    print("Wrote", DOCX_PATH)


# ============================================================================
# PDF (reportlab, text-based / selectable = ATS-parseable)
# ============================================================================
def build_pdf():
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import inch
    from reportlab.lib.enums import TA_LEFT
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
    )
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

    accent = HexColor("#" + ACCENT)
    linkcol = HexColor("#" + LINKCOL)

    styles = getSampleStyleSheet()
    base = ParagraphStyle(
        "base", parent=styles["Normal"], fontName="Helvetica",
        fontSize=9.5, leading=12.5, alignment=TA_LEFT, spaceAfter=2,
    )
    name_style = ParagraphStyle(
        "name", parent=base, fontName="Helvetica-Bold", fontSize=19,
        textColor=accent, leading=22, spaceAfter=2,
    )
    contact_style = ParagraphStyle("contact", parent=base, fontSize=9, leading=12)
    head_style = ParagraphStyle(
        "head", parent=base, fontName="Helvetica-Bold", fontSize=11,
        textColor=accent, spaceBefore=7, spaceAfter=2,
    )
    role_style = ParagraphStyle("role", parent=base, fontName="Helvetica-Oblique", fontSize=9.5)
    bold_style = ParagraphStyle("bold", parent=base, fontName="Helvetica-Bold", fontSize=10.5)
    bullet_style = ParagraphStyle(
        "bullet", parent=base, leftIndent=12, bulletIndent=2, spaceAfter=2, leading=12.2,
    )

    def link(shown, url):
        return f'<a href="{url}" color="#{LINKCOL}"><u>{shown}</u></a>'

    story = []

    def hr():
        story.append(HRFlowable(width="100%", thickness=0.6, color=HexColor("#999999"),
                                spaceBefore=1, spaceAfter=3))

    def heading(text):
        story.append(Paragraph(text.upper(), head_style))
        hr()

    def bullet(text):
        story.append(Paragraph(text, bullet_style, bulletText="\u2022"))

    def row(left_html, right_text, left_style, right_style=None):
        right_style = right_style or base
        t = Table(
            [[Paragraph(left_html, left_style), Paragraph(right_text, right_style)]],
            colWidths=[5.05 * inch, 1.95 * inch],
        )
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ]))
        story.append(t)

    right_style = ParagraphStyle("right", parent=base, alignment=2)

    # Header
    story.append(Paragraph(NAME, name_style))
    contact = f'{LOCATION} &nbsp;|&nbsp; {PHONE} &nbsp;|&nbsp; {link(EMAIL, "mailto:" + EMAIL)}'
    story.append(Paragraph(contact, contact_style))
    links_html = " &nbsp;|&nbsp; ".join(f"{lab}: {link(shown, url)}" for lab, shown, url in LINKS)
    story.append(Paragraph(links_html, contact_style))

    # Summary
    heading("Summary")
    story.append(Paragraph(SUMMARY, base))

    # Experience
    heading("Experience")
    for job in EXPERIENCE:
        row(f'<b>{job["company"]}</b>', job["dates"], bold_style, right_style)
        row(f'<i>{job["title"]}</i>', f'<i>{job["location"]}</i>', role_style, right_style)
        story.append(Spacer(1, 1))
        for b in job["bullets"]:
            bullet(b)

    # Education
    heading("Education")
    row(f'<b>{EDUCATION["school"]}</b>', EDUCATION["location"], bold_style, right_style)
    row(f'<i>{EDUCATION["degree"]}  |  {EDUCATION["extra"]}</i>', EDUCATION["dates"], role_style, right_style)

    # Projects
    heading("Projects")
    for proj in PROJECTS:
        links_html = "   ".join(f"{lab}: {link(shown, url)}" for lab, shown, url in proj["links"])
        story.append(Paragraph(f'<b>{proj["name"]}</b> &nbsp; {links_html}', base))
        story.append(Paragraph(f'<i>{proj["stack"]}</i>', role_style))
        story.append(Spacer(1, 1))
        for b in proj["bullets"]:
            bullet(b)

    # Publications
    heading("Publications")
    for pub in PUBLICATIONS:
        story.append(Paragraph(f'<b>{pub["title"]}.</b> {link(pub["meta"], pub["url"])}', base))
        story.append(Paragraph(pub["contribution"], base))

    # Achievements
    heading("Achievements")
    for a in ACHIEVEMENTS:
        bullet(a)

    # Skills
    heading("Technical Skills")
    for cat, items in SKILLS:
        story.append(Paragraph(f'<b>{cat}:</b> {items}', base))

    # Certifications
    heading("Certifications")
    for c in CERTIFICATIONS:
        bullet(c)

    doc = SimpleDocTemplate(
        PDF_PATH, pagesize=A4,
        topMargin=0.5 * inch, bottomMargin=0.5 * inch,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
        title="Vummethala Venkata Sri Datta Charan - Resume",
        author=NAME,
    )
    doc.build(story)
    print("Wrote", PDF_PATH)


if __name__ == "__main__":
    build_docx()
    build_pdf()

