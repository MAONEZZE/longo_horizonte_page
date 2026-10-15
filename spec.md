- Analise os bugs, vulnerabilidades e code smells (gambiarra). 
- Separe em blocos para a analise do repositorio, por exemplo separar a analise da parte de eventos, automação, chamadas para API, etc... 
- O que mais vejo nas requests são diversas chamadas
- Cada bloco será responsibilidade de um sub-agente. 
- Haverá também um agente orquestrador (ou agente pai) que irá analisar as integrações/fluxos entre as diferentes partes (pode ser mais de um agente pai, um agente pai para no máximo 3 sub-agentes)
- Ao final da analise deve-se criar um arquivo md contendo as analises e as possiveis soluções, seguindo boas práticas, a atual arquitetura do projeto
- Para analisar o projeto, utilize o graphify e seus respectivos arquivos, pois ele já está atualizado com o projeto atual

import { createClient } from 'npm:@supabase/supabase-js@2'
import OpenAI from 'npm:openai'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseSecretKey = Deno.env.get('SUPABASE_SECRET_KEY')!
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

Deno.serve(async (req) => {
  // Grab the user's query from the JSON payload
  const { query } = await req.json()

  // Instantiate OpenAI client
  const openai = new OpenAI({ apiKey: openaiApiKey })

  // Generate a one-time embedding for the user's query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    dimensions: 1536,
  })

  const [{ embedding }] = embeddingResponse.data

  // Instantiate the Supabase client
  // (replace service role key with user's JWT if using Supabase auth and RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  // Call hybrid_search Postgres function via RPC
  const { data: documents } = await supabase.rpc('hybrid_search', {
    query_text: query,
    query_embedding: embedding,
    match_count: 10,
  })

  return new Response(JSON.stringify(documents), {
    headers: { 'Content-Type': 'application/json' },
  })
})