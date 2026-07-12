import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function OutputParsers() {
  return (
    <LessonArticle>
      <LessonSection title="The problem — models return text">
        <p>
          LLMs return free-form strings. Applications need structured data — JSON objects, typed fields, lists.
          <strong className="text-white"> Output parsers</strong> sit at the end of a chain to extract and validate
          structured output from the model's text.
        </p>
      </LessonSection>

      <LessonSection title="StrOutputParser — plain text">
        <Example
          title="Extract .content as a string"
        >{`from langchain_core.output_parsers import StrOutputParser

chain = prompt | llm | StrOutputParser()

# Returns a plain string instead of an AIMessage object
text = chain.invoke({"question": "What is 2+2?"})
print(type(text))  # <class 'str'>
print(text)        # "4"`}</Example>
      </LessonSection>

      <LessonSection title="JsonOutputParser">
        <ContentStep number={1} title="Parse JSON from model output">
          <Example
            title="Structured JSON response"
            output='{"name": "Alice", "age": 30, "city": "Paris"}'
          >{`from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Return valid JSON only. {format_instructions}"),
    ("human", "Extract person info: {text}"),
])

# Parser generates format instructions automatically
chain = prompt | llm | parser

result = chain.invoke({
    "text": "Alice is 30 years old and lives in Paris.",
    "format_instructions": parser.get_format_instructions(),
})
# result = {"name": "Alice", "age": 30, "city": "Paris"}`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="PydanticOutputParser — typed schemas">
        <ContentStep number={1} title="Define a schema, get validated objects">
          <Example
            title="Pydantic model as output schema"
            output="Person(name='Alice', age=30, city='Paris')"
          >{`from pydantic import BaseModel, Field
from langchain_core.output_parsers import PydanticOutputParser

class Person(BaseModel):
    name: str = Field(description="Full name")
    age: int = Field(description="Age in years")
    city: str = Field(description="City of residence")

parser = PydanticOutputParser(pydantic_object=Person)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Extract person info. {format_instructions}"),
    ("human", "{text}"),
])

chain = prompt | llm | parser
person = chain.invoke({
    "text": "Alice is 30 and lives in Paris.",
    "format_instructions": parser.get_format_instructions(),
})
print(person.name)  # "Alice" — typed attribute access`}</Example>
        </ContentStep>
      </LessonSection>

      <Callout variant="tip">
        Modern APIs also support <strong className="text-white">native structured output</strong> via{' '}
        <code className="font-mono text-sm">llm.with_structured_output(Person)</code> — the model is constrained
        to return valid JSON at the token level. Use parsers when you need portability across providers.
      </Callout>

      <KeyTakeaways
        items={[
          'Output parsers convert free-form LLM text into structured data at the end of a chain.',
          'StrOutputParser → plain string; JsonOutputParser → dict; PydanticOutputParser → typed objects.',
          'Include parser.get_format_instructions() in the prompt so the model knows the expected schema.',
          'Chain pattern: prompt | llm | parser.',
        ]}
      />
    </LessonArticle>
  )
}
