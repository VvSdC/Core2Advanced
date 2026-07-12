import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SystemAndRolePrompting() {
  return (
    <LessonArticle>
      <Definition term="System & Role Prompting">
        <p>
          A <strong className="text-white">system prompt</strong> (or role prompt) sets persistent context for the
          entire conversation: who the model is, how it should behave, and what constraints apply. It is sent once
          at the start and conditions every subsequent response.
        </p>
      </Definition>

      <LessonSection title="When to use system / role prompts">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Chatbots and assistants</strong> — define persona, tone, and scope.</li>
          <li><strong className="text-white">Domain experts</strong> — "You are a senior Python developer reviewing code."</li>
          <li><strong className="text-white">Safety and policy</strong> — "Do not provide medical diagnoses. Suggest seeing a doctor."</li>
          <li><strong className="text-white">Consistent output style</strong> — formal vs casual, bullet points vs prose.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When a system prompt is not enough">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Task-specific format needs — add few-shot examples in the user message.</li>
          <li>Reasoning-heavy tasks — combine with chain-of-thought in the user prompt.</li>
          <li>When the model ignores instructions — the task may need fine-tuning or a larger model.</li>
        </ul>
      </LessonSection>

      <ContentStep number={1} title="Anatomy of a strong system prompt">
        <Example
          title="Structured system prompt"
        >{`system_prompt = """You are a concise technical writing assistant.

Role: Help users write clear documentation for software APIs.

Rules:
- Use present tense and active voice.
- Keep sentences under 25 words.
- Include a code example when describing a function.
- If you are unsure, say "I don't have enough context" instead of guessing.

Output format: Markdown with ## headings."""`}</Example>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Identity</strong> — who the model is.</li>
          <li><strong className="text-white">Scope</strong> — what it should and should not do.</li>
          <li><strong className="text-white">Rules</strong> — hard constraints on behaviour.</li>
          <li><strong className="text-white">Format</strong> — how outputs should look.</li>
        </ul>
      </ContentStep>

      <Callout variant="tip">
        InstructGPT (see Research Papers) explains why aligned models follow system instructions better than raw
        pre-trained models. Use system prompts with instruction-tuned models (ChatGPT, Claude, Llama-Chat) for
        best results.
      </Callout>

      <KeyTakeaways
        items={[
          'System prompts set persistent persona, rules, and format for the whole conversation.',
          'Best for chatbots, domain experts, safety constraints, and style consistency.',
          'Combine with few-shot or CoT in user messages for task-specific needs.',
          'Works best on instruction-tuned (aligned) models.',
        ]}
      />
    </LessonArticle>
  )
}
