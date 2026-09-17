# -*- coding: utf-8 -*-
"""
GenAI-targeted resume variant. Does not overwrite Vummethala_Charan_Resume.*.

Writes:
  Downloads/VVSD_Charan_GenAI.docx
  Downloads/VVSD_Charan_GenAI.pdf
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import resume_gen as r

r.HEADLINE = "Generative AI Security Engineer"

r.SUMMARY = (
    "2+ years at Infosys building LLM apps that stay safe in production. Work covers "
    "guardrails, red-teaming, safety fine-tuning, and agents that find real software bugs."
)

r.EXPERIENCE = [
    {
        "company": "Infosys",
        "title": "Generative AI and AI Security Engineer (Specialist Programmer L2)",
        "location": "Hyderabad, India",
        "dates": "Jul 2024 - Present",
        "bullets": [
            "Maps linked GitHub repos and live deployments into a dependency graph to find "
            "vulns across services.",
            "Finds vulns, checks real-world impact, writes a sandbox PoC, and returns a fix.",
            "69.2% average recall on RealVuln Python, ahead of Devin, Google Mantis, and Claude Opus 5.",
            "Fine-tuned SLMs with SFT: +36% safety on AIR-Bench and +18% secure code on PurpleLlama, "
            "with no drop in helpfulness.",
            "Built Copilot and Claude Code guardrails that block supply-chain attacks, irreversible "
            "commands, and PII leaks.",
            "Built a LangGraph workflow that reviews SOWs for DPO, Legal, and RAI teams.",
            "Cut SOW review from 60 to 20 minutes (67%) with use-case, risk, and EU AI Act checks.",
            "Led PAIR, TAP, and Promptfoo red-teaming on AI apps, then used failures to guide "
            "safety fine-tuning.",
            "Built a pipeline that filters toxic and insecure code and redacts PII across millions "
            "of training records.",
        ],
    }
]

r.PROJECTS = [
    {
        "name": "ShopAI - E-Commerce Platform",
        "stack": "LangGraph, LangSmith, Langfuse, RAG, Python, Redis, Docker",
        "links": [
            ("GitHub", "github.com/VvSdC/ShopAI", "https://github.com/VvSdC/ShopAI"),
            ("Live", "shopaicommerce.netlify.app", "https://shopaicommerce.netlify.app/"),
        ],
        "bullets": [
            "Hybrid product search: keyword + vector, RRF merge, and a cross-encoder reranker.",
            "Keeps inference up across 5 providers (OpenRouter, Gemini, Mistral, Hugging Face, Groq) "
            "when one fails or hits a rate limit.",
            "Strips PII before LLM calls and sandboxes each user session.",
            "Scores live agent answers with LangSmith, Langfuse, and an LLM judge.",
            "Offloads checkout expiry and tagging to Redis and BullMQ so the API stays fast.",
        ],
    }
]

r.PUBLICATIONS = [
    {
        "title": "Mify-Coder: State-of-the-art Small Language Model",
        "meta": "arXiv:2512.23747, December 2025",
        "url": "https://arxiv.org/abs/2512.23747",
        "contribution": (
            "Contribution: Led SFT for secure code generation, filtered toxicity and PII from "
            "training data, and scored the model on AIR-Bench and PurpleLlama."
        ),
    }
]

r.SKILLS = [
    ("AI Security",
     "Vulnerability Management, Harness Engineering, Software Supply-Chain Security, "
     "Software Composition Analysis (SCA), Prompt Injection and Jailbreak Detection and Mitigation, "
     "Responsible AI"),
    ("Generative AI",
     "LangChain, LangGraph, RAG, Prompt Engineering, Multi-Agent Workflows, "
     "Model Context Protocol (MCP), Supervised Fine-Tuning (SFT), LoRA, QLoRA, vLLM"),
    ("Evaluation",
     "Red Teaming (PAIR, TAP, Promptfoo), LLM Benchmarking, LangSmith, Langfuse"),
    ("Stack",
     "Python, PyTorch, Hugging Face Transformers, FAISS, Pinecone, Chroma, Docker, Git, "
     "Azure OpenAI"),
]

OUT_DIR = r.OUT_DIR
r.DOCX_PATH = os.path.join(OUT_DIR, "VVSD_Charan_GenAI.docx")
r.PDF_PATH = os.path.join(OUT_DIR, "VVSD_Charan_GenAI.pdf")

if __name__ == "__main__":
    r.build_docx()
    r.build_pdf()
