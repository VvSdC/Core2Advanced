import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function MultimodalAndVision() {
  return (
    <LessonArticle>
      <Definition term="Multimodal models">
        <p>
          <strong className="text-white">Multimodal</strong> models accept more than text — typically images plus a
          text prompt. In the llama.cpp ecosystem, <strong className="text-white">LLaVA</strong>-style models connect a
          vision encoder to a language model so you can ask questions about pictures locally, without sending images
          to a cloud API.
        </p>
      </Definition>

      <LessonSection title="How LLaVA-style models work (high level)">
        <Flowchart
          title="Image + text to answer"
          chart={`flowchart LR
  A[Image file] --> B[Vision encoder]
  B --> C[Image tokens / embeddings]
  D[User prompt text] --> E[Tokenizer]
  C --> F[Merge in LLM context]
  E --> F
  F --> G[Language model]
  G --> H[Text answer]`}
        />
        <p className="mt-4 text-slate-300">
          The vision encoder (often CLIP-based) turns the image into a sequence of tokens the language model can
          attend to — like extra &quot;words&quot; describing pixels. The LLM then generates a normal text response.
          You need <strong className="text-white">two files</strong> for most setups: the main LLM GGUF and a
          separate <strong className="text-white">mmproj</strong> (multimodal projector) file.
        </p>
      </LessonSection>

      <LessonSection title="What you need to download">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">LLM GGUF</strong> — e.g. Llama-3-8B-Instruct in Q4_K_M.
          </li>
          <li>
            <strong className="text-white">mmproj GGUF</strong> — vision adapter matched to that LLaVA variant
            (check the model card on Hugging Face for the correct pair).
          </li>
          <li>
            <strong className="text-white">CUDA/Metal build</strong> — vision adds compute; GPU offload (
            <code className="font-mono text-sm">-ngl</code>) strongly recommended.
          </li>
        </ul>
        <Callout variant="tip">
          Search Hugging Face for &quot;LLaVA GGUF&quot; or &quot;llava mmproj&quot;. Mismatched LLM and mmproj
          versions produce garbage or crash at load time.
        </Callout>
      </LessonSection>

      <LessonSection title="Run multimodal inference (CLI)">
        <Example title="llama-cli with image input">{`./llama-cli \\
  -m models/llava-v1.6-34b-Q4_K_M.gguf \\
  --mmproj models/mmproj-model-f16.gguf \\
  --image path/to/photo.jpg \\
  -p "Describe what you see in this image." \\
  -ngl 35`}</Example>
        <p className="mt-4 text-slate-300">
          The <code className="font-mono text-sm">--image</code> flag attaches one or more image files to the
          prompt. The model processes the image during prefill, then decodes a text answer — same autoregressive
          loop as pure text models.
        </p>
        <CodeBlock title="Supported image formats">{`Common: JPEG, PNG, WebP
Use clear, reasonably sized images — huge 4K photos slow prefill
Resize very large images before inference if latency matters`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Multimodal server (HTTP)">
        <p className="text-slate-300">
          Recent llama-server builds extend the OpenAI chat API with image content in messages — an array of parts
          with <code className="font-mono text-sm">type: &quot;text&quot;</code> and{' '}
          <code className="font-mono text-sm">type: &quot;image_url&quot;</code> (often base64-encoded).
        </p>
        <Example title="Chat completion with image (conceptual)">{`curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llava",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "What is in this image?"},
        {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,..."}}
      ]
    }],
    "max_tokens": 256
  }'`}</Example>
        <Callout variant="beginner" title="Check your build version">
          Multimodal HTTP support evolves quickly. If your server rejects image content, update llama.cpp or use
          CLI <code className="font-mono text-sm">--image</code> first to confirm the model pair works.
        </Callout>
      </LessonSection>

      <LessonSection title="Practical tips">
        <ContentStep number={1} title="Start small">
          <p>
            Try LLaVA 1.6 7B or 13B quant models before 34B — vision prefill is memory-heavy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Match mmproj to LLM">
          <p>
            Always download the projector file listed on the same model card as the GGUF LLM.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Use GPU layers">
          <p>
            Vision + language together need substantial VRAM. Increase <code className="font-mono text-sm">-ngl</code>{' '}
            and use Q4 quant if you hit OOM.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Scope expectations">
          <p>
            Local vision models excel at description, OCR-ish reading, and simple reasoning about scenes. They are not
            a full replacement for frontier cloud vision APIs on complex tasks.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LLaVA-style models combine a vision encoder (mmproj) with a text LLM to answer questions about images.',
          'You typically need two GGUF files: the language model and a matching mmproj projector.',
          'CLI: use --image with llama-cli; server: image parts in chat message content (base64 URL).',
          'Vision prefill is heavy — use GPU offload, sensible quants, and smaller models when starting out.',
        ]}
      />
    </LessonArticle>
  )
}
