import csvToMarkdown from 'csv-to-markdown-table'
import { ocrSpace } from 'ocr-space-api-wrapper'
import PDFParser from "pdf2json"
import { readFile } from "./blob"
import { importTypes } from "./getLimits"
import { json } from 'stream/consumers'

// Fix para el tipo de csv-to-markdown-table
const csvToMarkdownTyped = csvToMarkdown as any

const apiKeys = [
  "6Z1wfHVIE86ZDx4MhqPl130jZ64jX3V930PN5zBQ",
  "RsiMVEzWwIc0ZQ6ggxneo3RHKJJmfdnmiDJQVRJe",
  "T8RAbyiq67UvGqXuHSlX6ssk8flpTcMAGv2AZ1hL",
  "OPAkEEhgoGzOoyYnKd7HFBmXh0gr7POJkqRP7rJq",
  "Gj4L4zsIlLLl5Uxi019p4h89165Mn0PMOYrZ0zUE",
  "zvu7tZWUQBL1Q1vTeiwnrxzS0YokGVVylHiRzrOy",
  "xQncVm8DofPlAqCWfjjsvgrlPqixvY03RJmRrzbe",
  "EP0iuxSQY7gCGqrK1ArfHGqlQ4nU28CmiqXBbJP4",
  "i7z1Eh048gWBhoPbDINpog2XlUBn8n1JYHiQyYBy",
  "froi677QrWQgPS13ZobvGmjFDc8BY2C2mPHSEMVx",
  "trPjqma25jVpMBHdOyedZvQvXWjIoQSKdWyWRmka",
  "qlRGtlBp2OQ1zlKxHIj3xl30Sp1h6wwrRxKknz3y",
  "BKwAjkAG0Kt989B7C186qci3xLQM7XJ7YwY4vqyB",
  "DAofV9mvd358DWYzq7PD8db10DblbWVaRz32RvmZ",
  "lUS1i9oiVttL1PPzNGO29AjFUMpJSbm5ews6EQQ1",
  "Y67C0meREQtCNrWMZG0rMRuToqXIIai9eIkxLl1k",
  "fu7Phye97AH0gBtBCMyRWCbsiRJ4flsUOkQ4Bp9h",
  "aLRvH4b07DlQaFOCgIA0QdJClZcZ6cRLe6wDWsfO",
  "SKRFHZRC2agGtbp6x4uCKtU16DDBW1NGdZUr0EKN",
  "NrTGU8SvsMRXQY79ZmW10AvhyDt6zHcpe9iJQ1uJ",
  "NreH0oUZr9lCTCdKaUMGQUjhCFz1s7FgjYpZch22",
  "HmbUxqkBDQ8dFnqEiCTYG4W1VzIlvsVmCd8bqAHG"
]
const OPTIMIZED = true

export function getRandomApiKey() {
  const randomIndex = Math.floor(Math.random() * apiKeys.length)
  return apiKeys[randomIndex]
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError))
    pdfParser.on("pdfParser_dataReady", pdfData => {
      const text = pdfData.Pages
        .flatMap(page =>
          page.Texts.map(t =>
            decodeURIComponent(t.R.map(r => r.T).join(""))
          )
        )
        .join(" ")
      resolve(text)
    })

    pdfParser.parseBuffer(buffer)
  })
}

export async function extractTextFromUrl(pdfUrl: string, type: importTypes): Promise<string> {
  const file = await readFile(pdfUrl)
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  if (type === "pdf-link" || type === "pdf") {
    return await extractPdfText(buffer)
  }
  if (type === "csv") {
    return await extractCsvText(buffer)
  }
  if (type === "img") {
    return await extractImageText(pdfUrl)
  }
  return buffer.toString("utf-8")
}

export async function extractCsvText(buffer: Buffer): Promise<string> {
  return csvToMarkdownTyped(buffer.toString('utf-8'))
}

export async function extractImageText(url: string): Promise<string> {
  const response = await ocrSpace(url, { apiKey: "K83908249788957" })
  return response.ParsedResults[0].ParsedText
}

function smartSplitText(text: string, maxChunks = 3): string[] {
  const length = text.length
  if (length <= 2000) return [text]

  const chunkSize = Math.ceil(length / maxChunks)
  const chunks: string[] = []
  let start = 0

  while (start < length && chunks.length < maxChunks) {
    chunks.push(text.slice(start, start + chunkSize))
    start += chunkSize
  }

  return chunks
}

// Summarize
export async function summarizeDocument(text: string, proMode = false, userLanguage = "es") {
  const promptBase = `Sumariza el siguiente texto considerando la lógica, ciencia y autores mencionados, usa el idioma: ${userLanguage === "en" ? "inglés" : "español"}:
{texto}
Recuerda debe ser un resumen completo y con toda la informacion posible.
No uses emojis ni simbolos unicode con el formato \\uXXXX.
Si te falta datos o informacion usa tu criterio para completarlo. No alucines`


  if (!proMode) {
    return await cohereChattyV2({
      prompt: promptBase.replace("{texto}", text),
      max_tokens: 8000,
    })
  }

  const chunks = smartSplitText(text, 3)
  const summaries = await Promise.all(
    chunks.map(chunk =>
      cohereChattyV2({
        prompt: promptBase.replace("{texto}", chunk),
        max_tokens: 3000,
      })
    )
  )

  return summaries.join("\n\n")
}
export async function generateQuizSkeleton(text: string, userInstructions = "", userLanguage = "es") {
  const languageInstruction = userLanguage === "en" ? "Generate in English" : "Genera en español";
  const prompt = `A partir del siguiente texto, crea el esquema de un quiz educativo con 20 preguntas. ${languageInstruction}.

Texto:
${text}

${userInstructions ? `Instrucciones: ${userInstructions}` : ""}

Especificaciones:
- Define un título general y una descripción.
- Asigna una dificultad general de 1 a 5.
- Extrae una lista de 20 ideas para preguntas, cada una breve y representando un concepto a evaluar.

Formato JSON:
{
  "title": "...",
  "description": "...",
  "difficulty": 1,
  "tags": ["tag1", "tag2", ...],
  "source": "...",
  "question_ideas": [
    "Idea de pregunta 1",
    "Idea de pregunta 2",
    ...
  ]
}
No incluyas explicaciones, solo el JSON.`

  return await cohereGenerate({
    prompt,
    max_tokens: 2048 * 2,
  });
}

export async function generateQuestionsFromIdeas(ideas: string[], contextText = "", userLanguage = "es") {
  const languageInstruction = userLanguage === "en" ? "Generate in English" : "Genera en español";
  const promptTemplate = (idea: string) => `
A partir de la siguiente idea de pregunta basada en el texto original, genera una pregunta de quiz educativa. ${languageInstruction}.

Texto original (opcional):
${contextText}

Idea de pregunta:
"${idea}"

Formato JSON:
{
  "question_text": "...",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correct_option": "A",
  "difficulty": 1
}
Usa LaTeX cuando sea necesario (doble escape: \\\\).
No escribas explicaciones. Solo el JSON.`;

  const results = await Promise.all(
    ideas.map(idea =>
      cohereGenerate({
        prompt: promptTemplate(idea),
        max_tokens: 2048,
      })
    )
  );

  return results;
}

export async function generateQuestionsFromIdeasUnmatched(ideas: string[], contextText = "", userLanguage = "es") {
  //it will generate all the questions with 1 cohere call
  const languageInstruction = userLanguage === "en" ? "Generate in English" : "Genera en español";
  const prompt = `A partir de las siguientes ideas de preguntas basadas en el texto original, genera preguntas de quiz educativas. ${languageInstruction}.

Ideas de preguntas:
${ideas.map(idea => `- ${idea}`).join("\n")}

Texto original (opcional):
${contextText}

Formato JSON:
[{
  "question_text": "...",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correct_option": "A",
  "difficulty": 1
},...]
Usa LaTeX cuando sea necesario (doble escape: \\\\).
No escribas explicaciones. Solo el JSON.`;

  return await cohereGenerate({
    prompt,
    max_tokens: 2048*ideas.length,
  });
}

// Quiz generation
export async function generateQuizQuestions(text: string, proMode = false, userInstructions = "", userLanguage = "es") {

  if (proMode) {
    const skeletonResult = await generateQuizSkeleton(text, userInstructions, userLanguage);
    const skeleton = JSON.parse(skeletonResult);

    var questionResults ;
    if(OPTIMIZED){
      questionResults = await generateQuestionsFromIdeasUnmatched(skeleton.question_ideas, text, userLanguage);
    }else{
      questionResults = await generateQuestionsFromIdeas(skeleton.question_ideas, text, userLanguage);
    }
    const questions = questionResults.map((res: any) => JSON.parse(res));

    return {
      ...skeleton,
      questions,
    };
  }

  const languageInstruction = userLanguage === "en" ? "Generate in English" : "Genera en español";
  const promptBase = `A partir del siguiente texto, genera preguntas de quiz educativas. ${languageInstruction}.

Texto:
{texto}

${userInstructions ? `Instrucciones: ${userInstructions}` : ""}

difficulty: 1 to 5
Generate {question_count} questions if possible, if not, generate as many as possible.
Si haces referencia a un caso o ejemplo, incluye un resumen o el contenido del caso.
Se puede usar latex para las preguntas y respuestas.
You should use \\uXXXX format for unicode characters.
Remember to correctly escape the \\ symbols. via \\\
When use latex remember to double escape the \\ symbols. via \\\\
Schema:
{
  "title": "...",
  "description": "...",
  "tags": ["tag1", "tag2", ...],
  "difficulty": 1,
  "source": "...",
  "questions": [
    {
      "question_text": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct_option": "A",
      "difficulty": 1
    }
  ]
}
Do not output anything more than the raw JSON.`

  return await cohereGenerate({
    prompt: promptBase.replace("{texto}", text).replace("{question_count}", "17"),
    max_tokens: 2048 * 4,
  })
}



// Flashcard generation
export async function generateFlashcards(text: string, proMode = false, userInstructions = "", userLanguage = "es") {
  const languageInstruction = userLanguage === "en" ? "Generate in English" : "Genera en español";
  const promptBase = `A partir del siguiente texto, genera flashcards educativas. ${languageInstruction}.

Texto:
{texto}

${userInstructions ? `Instrucciones: ${userInstructions}` : ""}

Cada flashcard debe tener un "front" (pregunta o concepto), un "back" (respuesta o explicación clara y concisa), y un campo "keywords" con palabras clave relevantes separadas por guiones en orden ascendete del alfabeto(solo 5 palabras). Usa el idioma original del texto. Devuelve el resultado en el siguiente formato JSON:


You should use \\uXXXX format for unicode characters.
Remember to correctly escape the \\ symbols. via \\\
Schema:
[{\"front\":\"...\",\"back\":\"...\",\"keywords\":\"palabra1-palabra2-...\"}, ...]
Do not output anything more than the JSON.`
  if (!proMode) {
    return await cohereGenerate({
      prompt: promptBase.replace("{texto}", text),
      max_tokens: 2048 * 2,
    })
  }

  const chunks = smartSplitText(text, 3)
  const results = await Promise.all(
    chunks.map(chunk =>
      cohereGenerate({
        prompt: promptBase.replace("{texto}", chunk),
        max_tokens: 2048 * 2,
      })
    )
  )

  return results.flat()
}
async function cohereGenerate({
  prompt,
  max_tokens,
}: {
  prompt: string
  max_tokens?: number // optional, not required by cURL
}) {
  const apiKey = getRandomApiKey()
  const response = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      model: "command-a-03-2025",
      temperature: 0.5,
      ...(max_tokens ? { max_tokens } : {}),
    }),
  })

  if (!response.ok) throw new Error(`Error from Cohere API:  ${response.status} ${apiKey}`)
  const data = await response.json()
  const text = data.message.content[0].text
  try {
    return JSON.parse(text)
  } catch (e) {
    console.log("Error parsing JSON:", text)
    console.error("Failed to parse Cohere response:", e)
    return null
  }
}

async function cohereChattyV2({
  prompt,
  max_tokens,
}: {
  prompt: string
  max_tokens: number
}) {
  const response = await fetch("https://api.cohere.ai/v2/chat", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getRandomApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command-a-03-2025",
      messages: [{ role: "user", content: prompt }],
      max_tokens,
      temperature: 0.7,
    }),
  })

  if (!response.ok) throw new Error(`Error from Cohere API: ${response.statusText}`)
  const data = await response.json()
  return data.message.content[0].text
}

export async function questionText(user: string, context: string, systemInstructions: string, lastMessages: string[] = [], document: {title: string, text: string} = {title: "", text: ""}, userLanguage = "es") {
  //use cohereChattyV2 to generate a question text
  const languageInstruction = userLanguage === "en" ? "Generate responses in English" : "Genera respuestas en español";
  const prompt = `From the following Context Document, generate a answer to the user that is clear and concise, using the language preference: ${userLanguage === "en" ? "English" : "Spanish"}.
  The answer should be relevant to the content and suitable for educational purposes.
  Can use LaTeX and markdown formatting.
  Just take in count the last messages from the user and the context.
  The others are to know the context of the conversation.
  ${languageInstruction}.
System Instructions:
${systemInstructions}
Context Document:
${context}
Last messages from the user:
${lastMessages.join("\n")}
`
  const response = await fetch("https://api.cohere.ai/v2/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getRandomApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command-a-03-2025",
      documents: [
        {"id": "1", "data": {"text": context, "title": document.title}}
      ],
      messages: [
        {
          "role": "system",
          "content": prompt
        },
        {
          "role": "user",
          "content": user
        }
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
  })
  if (!response.ok) {
    console.log("Error from Cohere API:", response.statusText)
    throw new Error(`Error from Cohere API: ${response.statusText}`)
  }
  const data = await response.json()
  
  return data.message.content[0].text
}
