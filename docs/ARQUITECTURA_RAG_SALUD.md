# Arquitectura RAG aplicada al sector salud colombiano

## 1. Propósito

Este documento consolida una ruta técnica para incorporar **Retrieval-Augmented Generation (RAG)**, agentes y herramientas de IA dentro de proyectos orientados al sector salud colombiano.

La referencia académica principal es el repositorio público:

- **Repositorio:** `Ohtar10/icesi-nlp`
- **Descripción:** material de apoyo al curso de Natural Language Processing (NLP) de la Universidad Icesi, Cali, Colombia.
- **Licencia:** Apache License 2.0.
- **URL:** https://github.com/Ohtar10/icesi-nlp

Este documento no copia el código fuente del repositorio de referencia. Resume su estructura y plantea una adaptación arquitectónica para casos de uso propios en salud.

---

## 2. Estructura verificada del repositorio de referencia

La versión revisada del repositorio organiza el aprendizaje de NLP de forma progresiva:

| Sesión | Tema | Contenido principal |
|---|---|---|
| 1 | Fundamentos de NLP | spaCy, normalización, patrones, embeddings y LSTM |
| 2 | Transformers | Construcción y comprensión de Transformers desde cero |
| 3 | BERT / Hugging Face | Clasificación de texto y fine-tuning |
| 4 | Generación de texto | Modelos GPT y generación de lenguaje |
| 5 | RAG | Ollama RAG y RAG con Ollama + LangChain |
| 6 | Agentes y MCP | Herramientas, agentes con Ollama, MCP, LangChain y chatbot con Gradio |

### Notebooks de especial interés

**Sesión 5 – Retrieval-Augmented Generation**

- `Sesion5/1-ollama-rag.ipynb`
- `Sesion5/2-ollama-langchain.ipynb`

**Sesión 6 – Herramientas, agentes y MCP**

- `Sesion6/1-herramientas-y-agentes-con-ollama.ipynb`
- `Sesion6/2-mcp-langchain-ollama.ipynb`
- `Sesion6/3-chatbot-con-mcp-y-gradio.ipynb`

---

## 3. Tecnologías relevantes

El archivo `requirements.txt` del repositorio de referencia incluye, entre otras, las siguientes tecnologías:

### RAG y recuperación semántica

- `faiss-cpu`
- `sentence-transformers`
- `langchain`
- `langchain-core`
- `langchain-community`
- `langchain-text-splitters`
- `langchain-huggingface`
- `langchain-ollama`

### Agentes y orquestación

- `langgraph`

### Model Context Protocol – MCP

- `langchain-mcp-adapters`
- `mcp`

### Modelos y NLP

- `torch`
- `transformers`
- `datasets`
- `accelerate`
- `spacy`
- `nltk`

### Aplicaciones y modelos locales

- `ollama`
- `gradio`

---

## 4. Qué es RAG dentro de esta arquitectura

RAG permite que un modelo de lenguaje consulte información externa antes de responder.

La lógica básica es:

```text
Documentos
   ↓
Extracción de texto
   ↓
Fragmentación (chunking)
   ↓
Embeddings
   ↓
Base/vector store
   ↓
Pregunta del usuario
   ↓
Búsqueda semántica
   ↓
Recuperación de fragmentos relevantes
   ↓
Construcción del contexto
   ↓
LLM
   ↓
Respuesta fundamentada en las fuentes recuperadas
```

Una implementación inicial puede utilizar:

```text
PDF / Word / TXT
      ↓
LangChain Text Splitters
      ↓
Sentence Transformers
      ↓
FAISS
      ↓
Retriever
      ↓
Ollama / otro LLM
      ↓
Respuesta + referencias
```

---

## 5. Diferencia frente a un chatbot convencional

Un chatbot basado únicamente en un LLM responde principalmente con el conocimiento aprendido durante su entrenamiento y con la información enviada en el prompt.

Un sistema RAG agrega una etapa de recuperación documental antes de generar la respuesta.

Por ello, para entornos normativos o administrativos de salud, el objetivo debe ser:

> **No responder primero y buscar después; buscar evidencia primero y responder después.**

Esto reduce el riesgo de respuestas no sustentadas y permite vincular cada conclusión con documentos controlados.

---

## 6. Aplicación al sector salud colombiano

Una adaptación práctica puede convertirse en un **asistente experto en normativa, facturación y gestión administrativa de salud**.

### Fuentes documentales posibles

El repositorio documental del RAG podría incorporar, según el alcance definido:

- Resoluciones y decretos vigentes.
- Manuales técnicos de RIPS JSON.
- Documentación relacionada con facturación electrónica en salud.
- Manuales de glosas y devoluciones.
- Manuales tarifarios.
- Contratos con EPS y demás pagadores.
- Anexos técnicos contractuales.
- Procedimientos institucionales.
- Políticas internas.
- Guías de auditoría.
- Protocolos de facturación y cartera.
- Circulares de Ministerio de Salud, ADRES, Supersalud y demás autoridades competentes.

La vigencia normativa debe controlarse mediante metadatos; un RAG no convierte automáticamente un documento histórico en una norma vigente.

---

## 7. Metadatos recomendados para cada documento

Cada fuente incorporada debería registrar como mínimo:

```text
id_documento
nombre_documento
tipo_documento
numero_norma
entidad_emisora
fecha_expedicion
fecha_inicio_vigencia
fecha_fin_vigencia
estado_vigencia
version
sector/proceso
tema
subtema
url_fuente
fecha_consulta
hash_documento
nivel_confidencialidad
```

Para documentos internos:

```text
empresa
proceso
subproceso
procedimiento
responsable
version
fecha_aprobacion
fecha_vencimiento
```

Los metadatos son fundamentales para evitar mezclar versiones derogadas, modificadas o desactualizadas.

---

## 8. Ejemplo: agente experto en glosas y devoluciones

### Entrada

El usuario podría preguntar:

> ¿Esta devolución realizada por la EPS es procedente?

### Flujo esperado

```text
1. Recibir la devolución o glosa.
2. Identificar causal y código.
3. Identificar contrato y pagador.
4. Consultar norma aplicable.
5. Consultar manual de glosas/devoluciones.
6. Consultar cláusulas contractuales pertinentes.
7. Recuperar evidencia documental.
8. Contrastar hechos vs. requisitos.
9. Determinar si existe fundamento para objetar.
10. Generar respuesta con fuentes y advertencias.
```

### Salida esperada

El sistema debería diferenciar explícitamente:

- hechos recibidos;
- documentos consultados;
- norma aplicable;
- análisis;
- posibles inconsistencias;
- conclusión;
- nivel de confianza;
- fuentes utilizadas.

---

## 9. Ejemplo: RIPS JSON + facturación electrónica

Otro flujo especializado puede evaluar:

```text
RIPS JSON
   ↓
Validación estructural
   ↓
Reglas de negocio
   ↓
Datos de la FEV
   ↓
CUV / mecanismos de validación aplicables
   ↓
Contrato
   ↓
Normativa vigente
   ↓
Hallazgos
   ↓
Recomendación
```

En este escenario RAG no reemplaza las validaciones determinísticas del JSON.

La arquitectura correcta es híbrida:

```text
Reglas determinísticas + APIs + RAG + LLM
```

El LLM debe explicar e interpretar; las validaciones de sintaxis, campos obligatorios, tipos de dato y consistencia matemática deben ejecutarse mediante código.

---

## 10. Evolución hacia agentes

Una vez establecida una capa RAG robusta, la arquitectura puede evolucionar hacia agentes especializados.

```text
                         USUARIO
                            ↓
                 AGENTE ORQUESTADOR
                      (LangGraph)
                            ↓
       ┌────────────────────┼────────────────────┐
       ↓                    ↓                    ↓
  RAG normativo        Agente RIPS        Agente facturación
       ↓                    ↓                    ↓
  Base normativa       Validador JSON       Reglas / contrato
       │                    │                    │
       ├──────────────┬─────┴──────┬─────────────┤
       ↓              ↓            ↓             ↓
 Agente glosas   Agente cartera   Farmacia      PQRS
       │              │            │             │
       └──────────────┴──────┬─────┴─────────────┘
                             ↓
                       HERRAMIENTAS
                             ↓
                  API / BD / MCP / archivos
                             ↓
                     RESPUESTA / ACCIÓN
```

---

## 11. Función de LangGraph

LangGraph puede utilizarse para controlar el flujo entre agentes y herramientas.

En lugar de permitir que un solo modelo decida todo libremente, se pueden definir estados y transiciones, por ejemplo:

```text
clasificar_solicitud
      ↓
identificar_proceso
      ↓
seleccionar_herramienta
      ↓
consultar_fuentes
      ↓
validar_resultados
      ↓
generar_respuesta
      ↓
control_de_calidad
```

Esta aproximación facilita trazabilidad, auditoría y control del comportamiento del sistema.

---

## 12. Función de MCP

MCP puede utilizarse como una capa estandarizada para conectar el agente con herramientas y fuentes externas.

Ejemplos conceptuales:

```text
LLM / agente
   ↓
MCP
   ├── Base de datos
   ├── Sistema de facturación
   ├── Repositorio documental
   ├── API institucional
   ├── Servicios de consulta
   └── Herramientas internas
```

MCP no reemplaza RAG.

Sus funciones son diferentes:

- **RAG:** recuperar conocimiento relevante.
- **MCP:** facilitar el acceso estandarizado a herramientas y recursos.
- **LangGraph:** orquestar procesos y decisiones entre componentes.
- **LLM:** interpretar lenguaje y generar respuestas.

---

## 13. Arquitectura propuesta para una plataforma de IA en salud

```text
CAPA 1 — INTERFAZ
Web / móvil / chatbot / API

CAPA 2 — ORQUESTACIÓN
LangGraph

CAPA 3 — AGENTES ESPECIALIZADOS
├── Normativa
├── Facturación
├── RIPS JSON
├── Glosas y devoluciones
├── Cartera
├── Contratación
├── Farmacia
├── PQRS
├── Calidad
└── Analítica

CAPA 4 — CONOCIMIENTO
├── RAG normativo
├── RAG contractual
├── RAG institucional
└── RAG técnico

CAPA 5 — HERRAMIENTAS
├── Validadores determinísticos
├── APIs
├── MCP
├── Bases de datos
└── Servicios externos autorizados

CAPA 6 — MODELOS
├── Ollama / modelos locales
├── modelos en nube autorizados
└── modelos especializados

CAPA 7 — GOBIERNO Y SEGURIDAD
├── autenticación
├── autorización por roles
├── trazabilidad
├── auditoría
├── protección de datos
├── control de versiones
├── gestión de fuentes
└── evaluación de calidad
```

---

## 14. Controles esenciales para salud

Un sistema de este tipo no debería entrar en producción únicamente porque el chatbot “responde bien”.

Debe contar con controles técnicos y de gobierno.

### Evidencia y trazabilidad

Toda respuesta sensible debe permitir identificar:

- qué documentos se consultaron;
- qué fragmentos sustentaron la respuesta;
- versión del documento;
- fecha de la fuente;
- modelo utilizado;
- fecha de la consulta.

### Vigencia normativa

Debe existir una política de:

- incorporación de nuevas normas;
- modificación;
- derogatoria;
- control de versiones;
- revisión periódica.

### Protección de información

No se deben introducir indiscriminadamente historias clínicas, datos personales o información reservada en modelos o servicios externos sin definir previamente la arquitectura de seguridad, el tratamiento de datos y los permisos correspondientes.

### Separar IA de reglas determinísticas

Ejemplos que deberían resolverse principalmente mediante código:

- validación de JSON;
- sumatorias;
- fechas;
- campos obligatorios;
- catálogos;
- tipos de dato;
- reglas de consistencia;
- cruces exactos entre bases de datos.

Ejemplos donde un LLM/RAG puede aportar mayor valor:

- interpretación normativa;
- recuperación documental;
- explicación de hallazgos;
- análisis contractual;
- clasificación semántica;
- síntesis de casos;
- generación asistida de respuestas.

---

## 15. Ruta de implementación recomendada

### Fase 1 — MVP RAG

Construir un RAG pequeño y controlado con un único dominio, por ejemplo:

**Normativa de facturación, RIPS, glosas y devoluciones.**

Componentes mínimos:

```text
Document loader
→ text splitter
→ embeddings
→ FAISS
→ retriever
→ LLM
→ respuesta con fuentes
```

### Fase 2 — Calidad del RAG

Medir:

- precisión de recuperación;
- relevancia de los fragmentos;
- respuestas sin evidencia;
- tasa de alucinaciones;
- cobertura documental;
- latencia;
- costo por consulta.

### Fase 3 — Metadatos y filtros

Agregar filtros por:

```text
vigencia
entidad
fecha
proceso
EPS/pagador
contrato
tipo documental
```

### Fase 4 — Herramientas determinísticas

Incorporar:

- validadores RIPS JSON;
- reglas de facturación;
- reglas de glosas;
- cruces con bases de datos.

### Fase 5 — Agentes especializados

Crear agentes separados para cada dominio.

### Fase 6 — Orquestación con LangGraph

Implementar un agente orquestador con estados, validaciones y rutas controladas.

### Fase 7 — MCP e integraciones

Conectar herramientas institucionales de forma gobernada.

---

## 16. Principio de diseño

La meta no debe ser construir un chatbot que “sepa de salud”.

La meta debe ser construir un sistema capaz de:

```text
BUSCAR
  ↓
VERIFICAR
  ↓
RAZONAR
  ↓
EJECUTAR REGLAS
  ↓
EXPLICAR
  ↓
CITAR EVIDENCIA
  ↓
DEJAR TRAZABILIDAD
```

Ese enfoque es más apropiado para procesos administrativos, normativos, financieros y de auditoría en salud.

---

## 17. Referencia técnica

Repositorio académico utilizado como referencia de aprendizaje:

**Ohtar10/icesi-nlp**  
Universidad Icesi – Curso de Natural Language Processing (NLP)  
https://github.com/Ohtar10/icesi-nlp

Licencia reportada por GitHub: **Apache License 2.0**.

### Componentes del repositorio especialmente relevantes para esta propuesta

- RAG con Ollama.
- RAG con Ollama + LangChain.
- FAISS.
- Sentence Transformers.
- LangGraph.
- Agentes con Ollama.
- MCP con LangChain y Ollama.
- Chatbot con MCP y Gradio.

---

## 18. Próximo desarrollo sugerido

El siguiente entregable técnico debería ser un **MVP RAG normativo en salud** que permita:

1. cargar documentos normativos;
2. extraer y fragmentar texto;
3. crear embeddings;
4. indexar en FAISS;
5. consultar por lenguaje natural;
6. responder únicamente con evidencia recuperada;
7. mostrar documento, página o fragmento fuente;
8. aplicar filtros de vigencia;
9. registrar trazabilidad de las consultas;
10. evaluar sistemáticamente la calidad de las respuestas.

Este MVP puede convertirse posteriormente en el núcleo documental de agentes especializados en facturación, RIPS, glosas, cartera, contratación, farmacia, calidad y demás procesos del sector salud.