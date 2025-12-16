# N-Mapper: Complete Project Documentation
## From Zero to Voice-Controlled 3D Graph Visualization

---

# Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack & Why](#technology-stack)
3. [Architecture & Design Decisions](#architecture)
4. [Data Flow & State Management](#data-flow)
5. [3D Graph Visualization Deep Dive](#3d-graph)
6. [Voice Agent Integration](#voice-agent)
7. [What Went Wrong & Why](#problems)
8. [What You Need to Learn](#learning-path)

---

# Project Overview

## What We Built
N-Mapper is a **3D interactive knowledge graph visualization** that lets students:
- View all their Canvas courses, modules, and assignments as an interactive 3D orb
- Navigate the graph using a **voice agent** (AI assistant that zooms and controls the view)
- See relationships between courses (prerequisites, cross-course connections)
- Explore their academic universe spatially instead of in lists

## The Vision
Transform flat course lists into a **spatial, navigable universe** where:
- Each course is a colored cluster
- Modules orbit around courses
- Assignments connect to modules
- Voice AI is your co-pilot, navigating you through your academic journey

## Key Features We Implemented
1. **3D Force-Directed Graph** - Physics-based orb with 238 nodes
2. **Voice Agent Integration** - Natural language navigation via Vapi
3. **Real-time Graph Control** - AI can zoom, search, and focus on nodes
4. **Helix DB Integration** - Ready to pull real Canvas data (currently using mock data)
5. **Interactive UI** - Click nodes, auto-zoom, transcript display

---

# Technology Stack

## Frontend Framework: Next.js 15 (App Router)
**Why Next.js?**
- **Server-Side Rendering (SSR)** - Fast initial page loads
- **App Router** - Modern React patterns with automatic code splitting
- **API Routes** - Built-in backend for Helix DB queries
- **TypeScript Support** - Type safety throughout

**What You Need to Learn:**
- React fundamentals (components, hooks, state)
- Next.js App Router architecture (app directory, route handlers)
- Client vs Server components ('use client' directive)
- Dynamic imports for heavy libraries

## Styling: Tailwind CSS v4
**Why Tailwind?**
- **Utility-First** - Rapid prototyping with class names
- **Customization** - Easy to match design system
- **No CSS files** - Everything inline, no context switching
- **Responsive** - Mobile-first breakpoints built-in

**What You Need to Learn:**
- Tailwind utility classes (flex, grid, spacing, colors)
- Custom color schemes and opacity
- Animation classes (animate-pulse, custom keyframes)
- Dark mode and glassmorphism effects

## 3D Visualization: react-force-graph-3d + Three.js
**Why This Stack?**
- **react-force-graph-3d** - React wrapper for graph visualization
- **Three.js** - WebGL rendering engine (handles 3D graphics)
- **d3-force-3d** - Physics engine for node positioning
- **SpriteText** - Efficient text rendering in 3D space

**The Components:**
1. **ForceGraph3D** - Main graph component (renders canvas)
2. **Three.js Scene** - 3D world with camera, lighting
3. **d3-force** - Physics simulation (charge, link, radial forces)
4. **SpriteText** - Text labels that face the camera

**What You Need to Learn:**
- **Three.js Basics:**
  - Scene, Camera, Renderer triangle
  - Geometry vs Material vs Mesh
  - Lighting and positioning in 3D space
  - Camera controls (orbit, zoom, pan)

- **Force-Directed Graphs:**
  - Node/link data structure
  - Force simulations (charge, link, center, radial)
  - Physics parameters (strength, distance, radius)
  - How forces interact to create layouts

- **d3-force Concepts:**
  - Charge force (repulsion between nodes)
  - Link force (attraction along edges)
  - Radial force (pull to sphere surface)
  - Force strength vs distance trade-offs

## Voice Integration: Vapi + OpenAI
**Why Vapi?**
- **All-in-One** - Handles speech recognition, TTS, and AI in one service
- **Function Calling** - AI can trigger graph controls directly
- **Real-time Transcription** - Partial and final transcripts
- **Easy Setup** - SDK handles WebRTC, audio streaming

**The Voice Pipeline:**
1. **User speaks** → Microphone captures audio
2. **Vapi** → Sends audio to speech-to-text (Deepgram/AssemblyAI)
3. **Transcript** → Sent to OpenAI GPT-4
4. **AI decides** → Call a function (focusOnCourse, searchNode, etc.)
5. **Function executes** → Graph zooms/navigates
6. **AI responds** → Text-to-speech (11Labs/PlayHT) plays audio
7. **Transcript displays** → User sees conversation history

**What You Need to Learn:**
- **Voice Technology Fundamentals:**
  - Speech-to-Text (STT) - Deepgram, Whisper, AssemblyAI
  - Text-to-Speech (TTS) - 11Labs, PlayHT, Azure
  - WebRTC for real-time audio streaming
  - Latency optimization (partial transcripts, streaming)

- **AI Function Calling:**
  - OpenAI function definitions (JSON schema)
  - When AI decides to call functions vs respond
  - Function result handling and feedback loops
  - System prompts for guiding AI behavior

- **Vapi-Specific:**
  - Public vs Private API keys
  - Event system (call-start, speech-start, message, error)
  - Message types (transcript, function-call, function-call-result)
  - Credit system and billing
  - Transcript payloads can vary by provider; normalize defensively (fields may be `transcript`, `text`, `message`, or nested `content`). Treat any transcript-like message as displayable, render partials immediately with a “Live” state, and clear them when a final arrives.
  - Require `NEXT_PUBLIC_VAPI_PUBLIC_KEY` in `.env.local`; surface a clear UI warning and disable mic controls when missing. Restart dev server after adding env vars because Next.js only reads them at boot.
  - Handle Vapi errors (invalid keys, network) with user-facing status: offline/listening/speaking/muted. Don’t silently log.
  - Mute/unmute should keep the call alive (use Vapi’s mute/unmute APIs) so the session stays active without dropping.
  - Return function-call results back to Vapi so the assistant knows if graph actions succeeded (e.g., node found/not found). Include node metadata when available.

## State Management: React Context API
**Why Context?**
- **Shared State** - GraphRef needs to be accessible from multiple components
- **No Props Drilling** - Pass state without intermediate components
- **Simple** - Built into React, no external library needed
- **Lightweight** - For this use case, Context is sufficient

**Our Context Structure:**
```
GraphControlContext
├── graphRef (shared reference to graph instance)
├── zoomToNode(nodeId)
├── searchNode(query)
├── focusOnCourse(courseName)
└── resetView()
```

**What You Need to Learn:**
- **React Context API:**
  - createContext and Provider pattern
  - useContext hook for consuming context
  - When to use Context vs props vs state management libraries
  - Performance considerations (memoization, splitting contexts)

- **Refs in React:**
  - useRef for mutable values that don't trigger re-renders
  - Accessing DOM elements and third-party library instances
  - Ref forwarding and imperative handles
  - When refs are better than state

## Database: Helix DB (Custom Graph Database)
**Why Helix?**
- **Native Graph** - Built for nodes and relationships
- **Custom Query Language** - .hx files with graph-specific syntax
- **Canvas Integration** - Designed for educational data
- **Local-First** - Runs on localhost:6969

**Helix Concepts:**
1. **Nodes** - Entities (PDFs, courses, modules, assignments)
2. **Relationships** - Edges connecting nodes
3. **Queries** - Declarative .hx syntax for graph traversal
4. **Schema** - Node types and properties defined in schema.hx

**What You Need to Learn:**
- **Graph Databases Fundamentals:**
  - Nodes vs Edges vs Properties
  - Graph traversal patterns
  - Cypher or similar graph query languages
  - When graphs beat relational databases

- **Helix-Specific:**
  - .hx query syntax (QUERY, AddN, N, RETURN)
  - Schema definition (N::Type, INDEX, DEFAULT)
  - Relationship types and confidence scores
  - Query execution flow

---

# Architecture & Design Decisions

## Component Hierarchy

```
App (page.tsx)
├── GraphControlProvider (Context wrapper)
│   ├── GraphView (Left side - 3D visualization)
│   │   └── ForceGraph3D (react-force-graph-3d component)
│   └── VoiceSidebar (Right side - AI agent)
│       ├── Audio Visualizer (bars)
│       ├── Transcript Display (chat history)
│       └── Vapi Integration (voice controls)
```

## Key Design Decisions

### 1. Separation of Graph and Voice Agent
**Decision:** Keep graph rendering and voice control in separate components

**Why:**
- **Modularity** - Each component has one responsibility
- **Reusability** - Voice agent could work with other visualizations
- **Testing** - Test graph physics separately from voice logic
- **Performance** - Voice state changes don't re-render graph

**How We Connected Them:**
- Shared Context (GraphControlContext) bridges the gap
- GraphView exposes control functions
- VoiceSidebar calls those functions
- No direct component coupling

### 2. Mock Data vs Real Data Toggle
**Decision:** Support both mock data and Helix DB with a simple flag

**Why:**
- **Development** - Work on UI without Helix running
- **Demo Mode** - Show features without real Canvas credentials
- **Testing** - Predictable data for testing
- **Gradual Migration** - Switch when Helix is ready

**Implementation:**
```
USE_HELIX_DATA = false (constant at top of file)
├── if false → mockGraphData
└── if true → fetch('/api/graph') → Helix DB
```

### 3. Client-Side Graph Rendering
**Decision:** Render entire graph on client, not server

**Why:**
- **Interactivity** - Three.js needs browser APIs (WebGL, Canvas)
- **Physics** - Force simulation runs in browser
- **Dynamic** - Graph responds to clicks, zoom, rotation
- **'use client'** - Next.js directive for client-only components

**Trade-off:**
- Slower initial load (large library)
- But: Better UX once loaded (smooth animations)

### 4. Radial Force Layout (Orb Shape)
**Decision:** Use radial force to pull nodes to sphere surface

**Why:**
- **Aesthetics** - Orb looks better than scattered nodes
- **Space Efficiency** - Dense packing in 3D sphere
- **Navigability** - Predictable layout (courses clustered)
- **Visual Metaphor** - "Universe" of courses

**Physics Parameters:**
```
Charge Force: -8 (weak repulsion)
Link Force: 15 (short links)
Radial Force: radius=60, strength=1.2 (strong pull to sphere)
```

**What This Creates:**
- Nodes pushed apart slightly (charge)
- Connected nodes stay close (link)
- Everything pulled to sphere surface (radial)
- Result: Dense, organized orb

### 5. Function Calling for Graph Control
**Decision:** Use OpenAI function calling instead of parsing commands

**Why:**
- **Reliability** - AI chooses correct function with parameters
- **No Regex** - Don't parse "show me CSE 101" manually
- **Typed** - Function parameters have schemas
- **Composable** - Easy to add new functions

**How It Works:**
1. Define functions in Vapi config (name, description, parameters)
2. AI gets user speech as text
3. AI decides: respond with text OR call a function
4. If function call: Vapi sends `function-call` message
5. We execute function (focusOnCourse, searchNode, etc.)
6. Send result back to AI
7. AI uses result to craft response

### 6. Transcript State Management
**Decision:** Track partial and final transcripts separately

**Why:**
- **Responsiveness** - Show user their words in real-time
- **UX** - Visual feedback that mic is working
- **Accuracy** - Final transcripts are more accurate
- **Debugging** - See what AI is receiving

**Implementation:**
- `partialTranscript` - Single object, updates frequently
- `transcript` - Array of final messages, append-only
- Display both: partials with "Live..." tag, finals in history

---

# Data Flow & State Management

## Graph Data Flow

```
1. DATA SOURCE
   ├── Mock: mockGraphData.ts (238 nodes, 237 links)
   └── Real: /api/graph → Helix DB → Transform to graph format

2. COMPONENT MOUNT
   ├── GraphView receives data prop
   ├── ForceGraph3D initializes
   └── Physics simulation starts

3. PHYSICS SIMULATION
   ├── d3-force calculates node positions
   ├── Each frame: Update x, y, z coordinates
   └── Three.js renders updated scene

4. INTERACTION
   ├── User clicks node → handleNodeClick
   ├── Voice agent calls function → zoomToNode/focusOnCourse
   └── Camera animates to new position
```

## Voice Agent Data Flow

```
1. USER SPEAKS
   ↓
2. BROWSER MICROPHONE
   ↓
3. VAPI SDK (WebRTC audio stream)
   ↓
4. VAPI SERVER
   ├── Speech-to-Text (Deepgram/Whisper)
   ├── Send to OpenAI GPT-4
   └── Text-to-Speech (11Labs/PlayHT)
   ↓
5. VAPI SDK EVENTS
   ├── 'transcript' → Update UI
   ├── 'function-call' → Execute graph control
   ├── 'speech-start' → Show "Speaking..." status
   └── 'call-end' → Reset state
   ↓
6. GRAPH UPDATES
   └── Camera moves, nodes highlighted
```

## Context Data Flow

```
GraphControlContext Provider
   ├── Wraps entire app
   ├── Provides graphRef (shared reference)
   └── Provides control functions
        ↓
GraphView (Consumer)
   ├── Gets graphRef from context
   ├── Assigns to ForceGraph3D
   └── graphRef.current = graph instance
        ↓
VoiceSidebar (Consumer)
   ├── Gets control functions from context
   ├── AI calls focusOnCourse("CSE 101")
   └── Function uses graphRef to control graph
```

**Key Insight:** Context creates a "bridge" between components that aren't parent/child related.

## State Layers

### 1. Component-Local State (useState)
**Used For:**
- UI state (isCallActive, isSpeaking, transcript)
- Temporary state (barHeights for visualizer)
- Form inputs and toggles

**Why Local:**
- Only affects one component
- Frequent updates (don't need global re-renders)
- Simple to reason about

### 2. Shared State (Context)
**Used For:**
- Graph reference (needs to be accessed by multiple components)
- Control functions (voice agent needs to call them)

**Why Shared:**
- Multiple consumers
- Avoids prop drilling
- Single source of truth

### 3. Server State (API Routes)
**Used For:**
- Helix DB queries
- Canvas data fetching (future)

**Why Server:**
- Database credentials shouldn't be in client
- Helix DB runs on server
- Transform data before sending to client

---

# 3D Graph Visualization Deep Dive

## How Force-Directed Graphs Work

### The Physics Simulation
Think of it like **springs and magnets:**

1. **Nodes are particles** with mass
2. **Links are springs** connecting particles
3. **Forces push/pull** nodes every frame
4. **Simulation runs** until stable (equilibrium)

### The Three Main Forces

#### 1. Charge Force (Repulsion)
**What It Does:** Pushes all nodes away from each other

**Parameters:**
- Strength: -8 (negative = repulsion)
- Range: Affects all nodes

**Effect:**
- Prevents node overlap
- Creates spacing
- Stronger = more spread out

**Our Setting:** `-8` (weak repulsion)
- Why weak? We want a dense orb, not scattered cloud

#### 2. Link Force (Attraction)
**What It Does:** Pulls connected nodes together

**Parameters:**
- Distance: 15 (target length between connected nodes)
- Strength: 1 (how strongly to enforce)

**Effect:**
- Keeps related nodes close
- Course → Module → Assignment chains stay together
- Distance sets "tightness"

**Our Setting:** `15` (short links)
- Why short? Compact clusters, dense orb

#### 3. Radial Force (Pull to Sphere)
**What It Does:** Pulls all nodes toward sphere surface

**Parameters:**
- Radius: 60 (size of sphere)
- Strength: 1.2 (how strongly to pull)

**Effect:**
- Creates orb shape
- All nodes end up on sphere surface
- Radius controls orb size

**Our Setting:** `radius=60, strength=1.2` (tight, strong orb)
- Why tight? 238 nodes fit nicely in small sphere
- Why strong? Overrides other forces to ensure orb shape

### How They Work Together

```
Initial State:
- Nodes randomly placed
- Chaos, overlapping

Frame 1-10:
- Charge pushes nodes apart
- Links pull related nodes together
- Radial pulls everything to sphere surface
- Nodes move rapidly

Frame 10-100:
- Forces balance out
- Nodes settle into stable positions
- Movement slows down

Frame 100+:
- Equilibrium reached
- Tiny adjustments only
- Orb fully formed
```

### Camera & Navigation

**Three.js Camera:**
- **Position:** (x, y, z) coordinates where camera sits
- **LookAt:** (x, y, z) point camera faces
- **Zoom:** How close/far from target

**Our Zoom Implementation:**
```
When user says "Show me CSE 101":
1. Find CSE 101 node position (x, y, z)
2. Calculate distance = 500 units away
3. Calculate camera position:
   - Same angle as node from center
   - But 500 units farther out
4. Animate camera from current to new position
5. Point camera at node
6. Animation duration: 1500ms
```

**Why Distance 500?**
- Too close (100): Only see one node
- Too far (1000): Can't read text
- 500: Sweet spot - see node + surrounding cluster

## Text Rendering in 3D (SpriteText)

### The Problem
Standard Three.js text is slow and looks bad.

### The Solution: SpriteText
**What It Is:** Canvas-generated texture that always faces camera

**How It Works:**
1. Draw text on 2D canvas (invisible)
2. Take canvas as texture
3. Apply to sprite (2D plane in 3D space)
4. Sprite rotates to always face camera
5. Result: Readable text from any angle

**Our Configuration:**
- Font: Space Grotesk, Space Mono (monospace fallback)
- Weight: 700 (bold)
- Stroke: 0.5px black outline (readability)
- Height: Based on node.val (courses bigger, assignments smaller)

**Color by Node Type:**
- Courses: Bold colors (red, blue, green, etc.)
- Modules: Lighter shades of course color
- Assignments: Light gray
- Root: White

---

# Voice Agent Integration

## The Voice Technology Stack

### Layer 1: Audio Capture (Browser)
**What Happens:**
- `navigator.mediaDevices.getUserMedia()` requests mic access
- Browser captures raw audio stream
- Converts to format Vapi expects
- Streams via WebRTC

**Key Concepts:**
- **WebRTC** - Real-time audio/video protocol
- **MediaStream** - Browser API for audio capture
- **Permissions** - User must grant mic access
- **Sample Rate** - Audio quality (44.1kHz standard)

### Layer 2: Vapi SDK (Orchestration)
**What Happens:**
- Connects to Vapi servers
- Manages audio streaming
- Handles events (call-start, speech-start, message, etc.)
- Sends/receives JSON messages

**Key Concepts:**
- **Event-Driven** - On/emit pattern for async communication
- **WebSocket** - Persistent connection for real-time data
- **Message Types** - Different event types (transcript, function-call, etc.)
- **State Machine** - Call lifecycle (idle → active → speaking → listening)

### Layer 3: Vapi Server (Cloud)
**What Happens:**
- Receives audio stream
- Routes to speech-to-text service (Deepgram/AssemblyAI)
- Sends transcript to OpenAI
- Gets AI response
- Sends to text-to-speech (11Labs/PlayHT)
- Streams audio back

**Key Concepts:**
- **Pipeline Architecture** - Audio → STT → AI → TTS → Audio
- **Latency Optimization** - Partial transcripts, streaming responses
- **Service Orchestration** - Multiple APIs working together
- **Error Handling** - Fallbacks if services fail

### Layer 4: AI Decision Making (OpenAI)
**What Happens:**
- Receives transcript as user message
- Reads system prompt (Nova personality)
- Decides: reply with text OR call a function
- If function call: extracts parameters
- Returns decision to Vapi

**Key Concepts:**
- **Function Calling** - AI can trigger external functions
- **JSON Schema** - Function definitions tell AI what's possible
- **Reasoning** - AI infers intent from natural language
- **Context** - System prompt guides AI behavior

### Layer 5: Graph Control Execution (Our Code)
**What Happens:**
- Receive `function-call` message from Vapi
- Execute function (focusOnCourse, searchNode, etc.)
- Send result back to Vapi
- AI uses result to craft response

**Key Concepts:**
- **Event Handling** - Listen for `message` event, check type
- **Function Routing** - Switch statement on function name
- **Result Feedback** - Tell AI if function succeeded/failed
- **Side Effects** - Graph actually moves (visual feedback)

## Function Calling Deep Dive

### How It Works (Step by Step)

**1. Define Functions in Vapi Config**
When starting call, we tell OpenAI what functions exist:
```
{
  name: 'focusOnCourse',
  description: 'Focus the camera on a specific course',
  parameters: {
    type: 'object',
    properties: {
      courseName: {
        type: 'string',
        description: 'The name of the course (e.g., "CSE 101")'
      }
    },
    required: ['courseName']
  }
}
```

**What This Does:**
- Teaches AI: "You can focus on courses"
- Defines parameter: `courseName` must be a string
- Gives example: "CSE 101"

**2. User Speaks: "Show me CSE 101"**

**3. AI Reasoning Process:**
```
Input: "Show me CSE 101"

AI thinks:
- User wants to see a course
- "CSE 101" is a course name
- I have a function called focusOnCourse
- It takes courseName parameter
- Decision: CALL FUNCTION

Output: {
  type: 'function-call',
  name: 'focusOnCourse',
  parameters: { courseName: 'CSE 101' }
}
```

**4. Vapi Sends Function Call Message**
```
{
  type: 'function-call',
  functionCall: {
    name: 'focusOnCourse',
    parameters: { courseName: 'CSE 101' }
  },
  functionCallId: 'abc123'  // unique ID for this call
}
```

**5. We Execute Function**
```
1. Receive message
2. Check type === 'function-call'
3. Switch on functionCall.name
4. Execute focusOnCourse('CSE 101')
   - Search for course in graph
   - Calculate camera position
   - Animate graph zoom
5. Graph visually moves
```

**6. Send Result Back to AI**
```
vapi.send({
  type: 'function-call-result',
  functionCallId: 'abc123',  // same ID from step 4
  result: { success: true }
})
```

**7. AI Uses Result to Respond**
```
Input: { success: true }

AI crafts response:
"Focusing on CSE 101... You've got 7 modules covering algorithms and complexity."

Output: Text-to-speech plays audio
```

### Why This Is Powerful

**Old Way (Command Parsing):**
```
User: "Show me CSE 101"
Code: if (text.includes("show")) {
  if (text.includes("CSE 101")) {
    focusOnCourse("CSE 101");
  }
}

Problems:
- Fragile (only works for exact phrases)
- Hard to maintain (add new commands = more if statements)
- No context (can't handle "zoom to that course" after previous mention)
```

**New Way (Function Calling):**
```
User: "Show me CSE 101"
      OR "Navigate to CSE 101"
      OR "I want to see CSE 101"
      OR "Zoom to CSE 101"

AI: ALL of these trigger focusOnCourse("CSE 101")

Benefits:
- Flexible (natural language variations work)
- Maintainable (add functions, not regex)
- Contextual (AI remembers conversation)
```

## The System Prompt (Nova Personality)

### What Is a System Prompt?
**Definition:** Instructions that tell the AI how to behave

**Where It Goes:** First message in conversation (before user says anything)

**Why It Matters:**
- Defines personality
- Sets behavior patterns
- Guides function usage
- Controls response style

### Our System Prompt Structure

**1. Identity**
```
You are Nova, an intelligent voice assistant for N-Mapper.
```
**Why:** Gives AI a name, role, context

**2. Style**
```
Be concise, energetic, student-friendly.
Use clear, direct language.
```
**Why:** Controls tone and length of responses

**3. Response Guidelines**
```
Keep responses SHORT.
Confirm actions immediately: "Zooming to CSE 101 now"
```
**Why:** Ensures consistent UX (fast, actionable responses)

**4. Available Functions**
```
You can control the graph with:
- focusOnCourse(courseName)
- searchNode(query)
- resetView()
```
**Why:** Reminds AI what it can do (reinforces function definitions)

**5. Behavior Rules**
```
When user asks about a course, immediately use focusOnCourse.
```
**Why:** Encourages proactive function calls (don't just talk, DO)

**6. Examples**
```
User: "Show me CSE 101"
You: "Focusing on CSE 101... *[calls focusOnCourse]*"
     "Here you go - 7 modules covering algorithms..."
```
**Why:** Shows AI the expected pattern (action + context)

### System Prompt Best Practices

**DO:**
- ✅ Be specific about desired behavior
- ✅ Give examples of good responses
- ✅ Explain when to use functions
- ✅ Set personality traits early

**DON'T:**
- ❌ Make it too long (AI might ignore parts)
- ❌ Contradict yourself (confuses AI)
- ❌ Forget to mention available data (courses list)
- ❌ Assume AI knows context (be explicit)

---

# What Went Wrong & Why

## Problem 1: GraphView Not Using Shared Context

### What Happened
Voice agent couldn't control the graph. Functions were called, but nothing happened.

### Root Cause
```
GraphView had its own local graphRef:
  const graphRef = useRef();

VoiceSidebar was calling functions from context:
  const { focusOnCourse } = useGraphControl();

But those functions used a DIFFERENT graphRef!
  // In context:
  const graphRef = useRef();  // Context's ref

  // In GraphView:
  const graphRef = useRef();  // Component's ref

Two different refs = Two different graph instances
```

### Why This Is Confusing
**React Refs Are Mutable:**
- `useRef()` creates a new object every time
- Each component's `useRef()` is independent
- Even if named the same, they're different objects

**The Fix:**
```
GraphView:
  const { graphRef } = useGraphControl();  // Get from context
  // Now uses THE SAME ref as voice agent

Result: Voice agent and graph share reference
```

### Lesson
**When sharing state between components:**
1. Choose ONE source of truth (Context)
2. ALL consumers use that source
3. Don't create local copies (breaks connection)

## Problem 2: Vapi Call Immediately Rejected

### What Happened
Error: "Meeting ended due to ejection"

### Root Cause
**Multiple Possible Issues:**

**1. Insufficient Credits (Most Common)**
- Vapi is paid service
- Requires credits to run calls
- $0 balance = immediate rejection

**2. Invalid API Key**
- Wrong key type (Private instead of Public)
- Expired key
- Key from different account

**3. Model Availability**
- GPT-4 might not be on your plan
- Some plans only have GPT-3.5

**4. Voice Provider Issues**
- PlayHT requires separate API key
- 11Labs might need account setup
- Vapi's default voice safer

### Why This Is Hard to Debug
**Error Messages Are Vague:**
- "Ejection" doesn't say WHY
- Could be multiple reasons
- Need to check dashboard for clues

**Solution Requires External Action:**
- Can't fix in code
- Must add credits to account
- Must verify settings in dashboard

### Lesson
**When integrating third-party services:**
1. Read pricing docs FIRST (is it free?)
2. Check account setup requirements
3. Test with minimal config (simple voice, cheap model)
4. Add detailed logging (know what's failing)

## Problem 3: Complex Config Made Debugging Harder

### What Happened
Used GPT-4 + PlayHT + custom system prompt from the start.

### Why This Was a Problem
**Too Many Variables:**
- If it fails, which part broke?
- Was it the model? The voice? The functions?
- Hard to isolate issue

**Expensive to Test:**
- GPT-4 costs more than GPT-3.5
- More credits burned on failed tests

**Dependencies:**
- PlayHT might need extra setup
- Adds another point of failure

### Better Approach (Incremental Complexity)

**Step 1: Minimal Test**
```
Model: GPT-3.5
Voice: Default
Functions: None
Goal: Just get a call to connect
```

**Step 2: Add Functions**
```
Model: GPT-3.5
Voice: Default
Functions: One simple function (resetView)
Goal: Verify function calling works
```

**Step 3: Add Complexity**
```
Model: GPT-3.5
Voice: 11Labs
Functions: All functions
Goal: Better voice quality
```

**Step 4: Final Config**
```
Model: GPT-4 (if needed)
Voice: 11Labs
Functions: All + custom system prompt
Goal: Production quality
```

### Lesson
**Start simple, add complexity incrementally:**
1. Get basic version working
2. Add one feature at a time
3. Test each addition
4. Know which change broke it (if it does)

## Problem 4: React Hook Warnings (Missing Dependencies)

### What Happened
Console warnings about missing dependencies in useEffect/useCallback.

### Root Cause
```
const handleNodeClick = useCallback((node) => {
  graphRef.current?.cameraPosition(...);
}, []);  // Empty deps array

Warning: graphRef should be in dependencies
```

**Why This Matters:**
- `useCallback` says: "Recreate function only when deps change"
- We said: "Never recreate (empty array)"
- But function uses `graphRef`
- If `graphRef` changes, function has stale reference

**The Fix:**
```
const handleNodeClick = useCallback((node) => {
  graphRef.current?.cameraPosition(...);
}, [graphRef]);  // Include graphRef
```

### Lesson
**React Hook Rules:**
1. List ALL variables used inside hook
2. Don't lie to React (empty array when you use vars)
3. Linter warnings are usually right
4. Understand dependency arrays (when function recreates)

## Problem 5: Data Structure Mismatch (Graph Format)

### What Happened
Helix DB returns PDFs with relationships, but graph needs nodes/links.

### The Transformation
```
Helix Format:
{
  pdfs: [
    { pdf_id: 1, title: "CS Lecture 1", ... },
    { pdf_id: 2, title: "Math Notes", ... }
  ],
  relationships: [
    { from_id: 1, to_id: 2, type: "related" }
  ]
}

Graph Format:
{
  nodes: [
    { id: "pdf_1", name: "CS Lecture 1", type: "pdf", color: "#ef4444", val: 16 },
    { id: "pdf_2", name: "Math Notes", type: "pdf", color: "#3b82f6", val: 16 }
  ],
  links: [
    { source: "pdf_1", target: "pdf_2" }
  ]
}
```

**What We Had to Do:**
1. Map PDFs to nodes (add id prefix, color, size)
2. Map relationships to links (change field names)
3. Handle missing data (default values)
4. Deduplicate links (same relationship might appear twice)

### Lesson
**When integrating data sources:**
1. Understand both formats thoroughly
2. Write transformation layer
3. Handle edge cases (missing fields, nulls)
4. Test with real data (not just happy path)

---

# What You Need to Learn

## Level 1: Foundational (Must Learn First)

### 1. JavaScript/TypeScript Fundamentals
**Topics:**
- Variables, functions, objects, arrays
- Promises, async/await (critical for API calls)
- Arrow functions vs regular functions
- Destructuring and spread operator
- Array methods (map, filter, find, some)
- Optional chaining (?.) and nullish coalescing (??)

**Why:**
- Everything else builds on this
- React is just JavaScript
- APIs are async (must understand promises)

**Resources:**
- JavaScript.info (comprehensive free guide)
- TypeScript Handbook (official docs)
- Practice: Build small projects (todo list, weather app)

### 2. React Basics
**Topics:**
- Component structure (JSX)
- Props vs State
- useState hook (component state)
- useEffect hook (side effects, lifecycle)
- useCallback/useMemo (optimization)
- Event handling (onClick, onChange)
- Conditional rendering (&&, ternary)
- Lists and keys (map)

**Why:**
- Our entire UI is React components
- Hooks manage ALL state
- Must understand component lifecycle

**Resources:**
- React.dev (new official docs - excellent)
- Build: Counter, form with validation, fetching data from API

### 3. Next.js App Router
**Topics:**
- File-based routing (app directory)
- Server vs Client components
- 'use client' directive
- Route handlers (API routes)
- Dynamic imports
- Environment variables (process.env)

**Why:**
- Our project structure depends on it
- SSR vs CSR trade-offs
- API routes for Helix DB

**Resources:**
- Next.js 13+ docs (App Router section)
- Build: Multi-page app with API routes

### 4. CSS & Tailwind
**Topics:**
- Flexbox (layouts)
- Grid (2D layouts)
- Positioning (absolute, relative)
- Z-index (layering)
- Transitions & animations
- Responsive design (breakpoints)
- Tailwind utility classes

**Why:**
- Our UI uses Tailwind exclusively
- Flexbox for sidebar layout
- Positioning for overlays

**Resources:**
- Flexbox Froggy (game)
- Tailwind docs (utility classes reference)
- Build: Clone a website design

## Level 2: Core Technologies (After Foundations)

### 5. Three.js Fundamentals
**Topics:**
- Scene, Camera, Renderer triangle
- Geometries (BoxGeometry, SphereGeometry, etc.)
- Materials (MeshBasicMaterial, MeshStandardMaterial)
- Mesh = Geometry + Material
- Lighting (PointLight, DirectionalLight)
- Camera controls (OrbitControls)
- Animation loop (requestAnimationFrame)
- Positioning in 3D space (x, y, z axes)

**Why:**
- Graph is rendered with Three.js
- Need to understand 3D coordinate system
- SpriteText is a Three.js concept

**Resources:**
- Three.js Journey (paid course, best one)
- Three.js docs (examples section)
- Build: Rotating cube, solar system, interactive scene

### 6. Force-Directed Graphs
**Topics:**
- Node-link data structure
- Force simulation concept
- Different force types:
  - Charge (n-body repulsion)
  - Link (spring attraction)
  - Center (pull to center)
  - Radial (pull to circle/sphere)
- Force parameters (strength, distance)
- Simulation warm-up and stability

**Why:**
- Our graph uses d3-force-3d
- Must understand how forces interact
- Tuning forces for desired layout

**Resources:**
- D3 force examples (Observable notebooks)
- react-force-graph docs
- Experiment: Create graphs with different force configs

### 7. Graph Databases & Helix
**Topics:**
- Nodes vs Edges vs Properties
- Graph traversal (follow relationships)
- Cypher query language (Neo4j) or similar
- Graph modeling (how to structure data)
- Helix .hx syntax
- Schema definition

**Why:**
- Helix is the data source
- Must understand graph queries
- Write new queries for features

**Resources:**
- Neo4j Graph Academy (free, teaches graph concepts)
- Helix documentation (if available)
- Practice: Model real-world data as graph

## Level 3: Advanced Integration (After Core)

### 8. Voice Technology Stack
**Topics:**
- **Speech-to-Text:**
  - How STT models work (Whisper, Deepgram)
  - Real-time vs batch transcription
  - Confidence scores and accuracy

- **Text-to-Speech:**
  - TTS engines (11Labs, PlayHT, Azure)
  - Voice cloning and customization
  - SSML (markup for controlling speech)

- **Audio Streaming:**
  - WebRTC fundamentals
  - MediaStream API
  - Audio formats and compression

- **Latency Optimization:**
  - Partial transcripts (show words as spoken)
  - Streaming responses (TTS starts before full text)
  - Buffering and pre-loading

**Why:**
- Voice is complex multi-part system
- Vapi abstracts a lot, but understanding helps debug
- Might need to optimize latency

**Resources:**
- WebRTC for the Curious (free book)
- OpenAI Whisper docs
- Build: Simple STT/TTS app without Vapi

### 9. AI Function Calling
**Topics:**
- OpenAI function calling documentation
- JSON Schema for function definitions
- When AI calls function vs responds with text
- Function result handling
- Multi-step function calls (AI calls multiple functions)
- Error handling (what if function fails?)
- System prompts for guiding function usage

**Why:**
- Critical for voice agent functionality
- Must design functions AI can understand
- Handle edge cases (user asks for invalid course)

**Resources:**
- OpenAI function calling guide
- Build: Chat bot with custom functions (weather, calculator, etc.)

### 10. React Context & Advanced Patterns
**Topics:**
- createContext and Provider
- useContext hook
- When to use Context vs props
- Performance optimization (useMemo, splitting contexts)
- Refs and imperative handles (useImperativeHandle)
- Forward refs
- Compound components pattern

**Why:**
- Our graph control uses Context
- Must understand ref sharing
- Optimize re-renders

**Resources:**
- React docs (Context section)
- Kent C. Dodds blog (React patterns)
- Build: Theme system with Context, shared component controls

## Level 4: Production & Optimization (Polish)

### 11. Performance Optimization
**Topics:**
- React profiler (find slow components)
- useMemo and useCallback (when to use)
- Code splitting and lazy loading
- Bundle size optimization
- Three.js performance (instancing, LOD)
- Force simulation optimization (limit iterations)
- Debouncing and throttling

**Why:**
- 3D graphs can be heavy
- Voice needs to be responsive
- Large bundle = slow load

**Resources:**
- Next.js docs (optimization section)
- Three.js docs (performance tips)
- Chrome DevTools profiling

### 12. Error Handling & Debugging
**Topics:**
- Try-catch blocks
- Error boundaries (React)
- Console debugging techniques
- Chrome DevTools (Network, Performance, Console)
- Logging best practices
- Error reporting (Sentry, LogRocket)

**Why:**
- Voice integration can fail silently
- Graph issues hard to debug
- Need good error messages

**Resources:**
- Chrome DevTools docs
- Practice: Debug broken apps

### 13. TypeScript Advanced
**Topics:**
- Generics (flexible, type-safe functions)
- Union and intersection types
- Type guards and narrowing
- Utility types (Partial, Pick, Omit)
- Interface vs Type
- any vs unknown (when to use each)

**Why:**
- Our code has TypeScript warnings
- Vapi SDK has types
- Better IDE autocomplete

**Resources:**
- TypeScript docs (Handbook)
- Total TypeScript (Matt Pocock's courses)

## Level 5: Deployment & DevOps (Launch)

### 14. Deployment
**Topics:**
- Vercel deployment (Next.js hosting)
- Environment variables in production
- API route security
- CORS and authentication
- Custom domains
- CI/CD basics

**Why:**
- Need to share with users
- Production has different constraints
- Helix DB might need cloud hosting

**Resources:**
- Vercel docs
- Deploy this project!

### 15. Database Integration
**Topics:**
- REST API design
- Error handling in APIs
- Data transformation layers
- Caching strategies (reduce Helix queries)
- Real-time updates (WebSockets, SSE)

**Why:**
- Helix integration needs to be robust
- Canvas data might change frequently
- Performance matters for UX

**Resources:**
- REST API design best practices
- Build: Full-stack app with database

---

# Learning Path (Suggested Order)

## Phase 1: Foundations (2-3 months)
**Goal:** Understand the basics

**Order:**
1. JavaScript fundamentals (2 weeks)
2. React basics (2 weeks)
3. CSS & Tailwind (1 week)
4. Next.js basics (1 week)
5. TypeScript basics (1 week)

**Project:** Build a simple multi-page website with Next.js

## Phase 2: 3D & Graphs (1-2 months)
**Goal:** Master the visualization

**Order:**
1. Three.js fundamentals (2 weeks)
2. Force-directed graphs (1 week)
3. react-force-graph integration (1 week)
4. Graph databases (1 week)

**Project:** Build a simpler 3D graph (social network visualization)

## Phase 3: Voice Integration (1-2 months)
**Goal:** Understand voice technology

**Order:**
1. Voice technology basics (STT/TTS) (1 week)
2. WebRTC and audio streaming (1 week)
3. OpenAI function calling (1 week)
4. Vapi or similar SDK (1 week)

**Project:** Voice-controlled todo list or music player

## Phase 4: Advanced & Polish (1-2 months)
**Goal:** Production-ready skills

**Order:**
1. React Context & advanced patterns (1 week)
2. Performance optimization (1 week)
3. Error handling & debugging (1 week)
4. Deployment (1 week)

**Project:** Rebuild N-Mapper from scratch with improvements

---

# Key Concepts Summary

## What Makes This Project Complex

**1. Multi-Domain Integration:**
- Frontend (React/Next.js)
- 3D Graphics (Three.js)
- Physics Simulation (d3-force)
- Voice AI (Vapi/OpenAI)
- Graph Database (Helix)

**Each domain has its own:**
- Concepts
- Best practices
- Debugging techniques
- Performance considerations

**2. Real-Time Interactions:**
- Graph physics runs every frame
- Voice streams continuously
- UI updates in response to both

**3. Shared State Complexity:**
- Context bridges components
- Refs allow imperative control
- Multiple state layers (local, context, server)

**4. Third-Party Dependencies:**
- Vapi (voice orchestration)
- OpenAI (AI reasoning)
- Helix (data source)
- Each can fail independently

## What Makes Voice Agents Hard

**1. Latency Chain:**
```
User speaks → Mic → Vapi → STT → OpenAI → TTS → Vapi → Speaker
Each step adds 100-500ms
Total: 2-5 seconds
```

**2. Accuracy Issues:**
- STT might mishear ("CSE 101" → "CSS 101")
- AI might misinterpret ("show me" vs "tell me about")
- Functions might fail (course not found)

**3. State Management:**
- Call state (idle, active, speaking, listening)
- Transcript state (partial, final)
- Graph state (current view, selected node)
- All must stay in sync

**4. Error Recovery:**
- User says invalid course → AI must handle gracefully
- Mic access denied → Show helpful message
- Vapi fails → Fallback to text input?

## What Makes 3D Graphs Hard

**1. Performance:**
- 238 nodes × 60 FPS = lots of calculations
- Text rendering is expensive
- Physics simulation is CPU-intensive

**2. Navigation:**
- 3D space is unintuitive for users
- Camera controls must feel natural
- Zoom must be smooth, not jarring

**3. Layout:**
- Forces must balance (not too spread, not too clustered)
- Related nodes should be near each other
- But avoid overlaps

**4. Interactivity:**
- Click detection in 3D (raycasting)
- Zoom to clicked node (calculate camera position)
- Highlighting (visual feedback)

---

# Final Thoughts

## What You Built
This is a **legitimately complex application** that combines:
- Modern frontend framework (Next.js)
- 3D graphics engine (Three.js)
- Physics simulation (d3-force)
- AI voice agent (Vapi + OpenAI)
- Graph database (Helix)

**Each component alone** is a substantial learning project.
**Together,** they form a sophisticated system.

## What You Learned
Even though it didn't fully work (Vapi issues), you learned:
- How to structure a complex Next.js app
- How 3D graphs work (forces, physics, rendering)
- How voice agents orchestrate multiple services
- How to share state between components (Context)
- How to integrate third-party APIs
- How to debug integration issues

## How to Approach This Again

**1. Start Simpler:**
- Build a 2D graph first (easier than 3D)
- Add voice control to a simple app (todo list)
- Get each part working independently

**2. Incremental Complexity:**
- Don't start with all features
- Get basic graph working
- Then add interactivity
- Then add voice
- Each step builds on previous

**3. Focus on Fundamentals:**
- Master React first (everything builds on it)
- Understand async/promises (voice is async)
- Learn Three.js basics (don't jump to complex graphs)

**4. Use Abstractions When Available:**
- react-force-graph-3d abstracts Three.js complexity
- Vapi abstracts voice pipeline
- Don't rebuild everything from scratch

## The Real Value

**You now know:**
- What's involved in a voice-controlled 3D app
- Where the complexity lies
- What skills you need
- What can go wrong

**This knowledge** is more valuable than a working app.
Next time you build something similar, you'll:
- Make better architecture decisions
- Avoid common pitfalls
- Debug faster
- Choose the right tools

---

# Resources Cheat Sheet

## Must-Read Documentation
- **React:** https://react.dev
- **Next.js:** https://nextjs.org/docs
- **Three.js:** https://threejs.org/docs
- **D3 Force:** https://d3js.org/d3-force
- **Vapi:** https://docs.vapi.ai
- **OpenAI:** https://platform.openai.com/docs
- **Tailwind:** https://tailwindcss.com/docs

## Best Courses
- **Three.js Journey** (Bruno Simon) - 3D graphics
- **Total TypeScript** (Matt Pocock) - TypeScript mastery
- **Epic React** (Kent C. Dodds) - Advanced React patterns
- **Next.js 13+ Crash Course** (Traversy Media, YouTube) - Free Next.js

## Practice Projects (Build These)
1. **Portfolio site** - Next.js + Tailwind (learn basics)
2. **Weather app** - Fetch API + state management
3. **3D rotating cube** - Three.js fundamentals
4. **Force-directed network** - D3 or react-force-graph
5. **Voice-controlled todo** - Web Speech API or Vapi
6. **Rebuild N-Mapper** - Combine everything you learned

## When You Get Stuck
1. **Read error message carefully** (often tells you exactly what's wrong)
2. **Console.log everything** (see what data looks like)
3. **Check official docs** (examples usually exist)
4. **Search GitHub issues** (someone else hit this bug)
5. **Ask specific questions** (not "it doesn't work", but "X happens when Y, expected Z")

---

**You built something ambitious. Now you know what it takes to build it right. That's the real win.** 🚀

---

# Alternative Approaches & Learnings (Advanced)

## 1. Native Web Speech API (The "Free" Route)
During development, we explored using the browser's native `window.SpeechRecognition` as an alternative to Vapi.

**Why consider this?**
- **Zero Cost:** No API keys or credit usage.
- **Zero Latency:** Transcription happens locally (or via browser's optimized cloud).
- **No Dependencies:** Built into Chrome/Safari.

**How it works:**
```javascript
const recognition = new window.SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true; // Key for "live" transcript

recognition.onresult = (event) => {
  const result = event.results[event.resultIndex];
  if (result.isFinal) {
    // Handle command
  } else {
    // Show live preview
  }
};
```

**Trade-offs:**
- **Browser Support:** Inconsistent across browsers (Firefox is lagging).
- **No "Brain":** It only gives text. You still need to parse intent (Regex or LLM).
- **Privacy:** Some browsers send audio to Google/Apple servers.

**Lesson:** For simple commands ("Show Math 18"), native speech is faster and cheaper. For complex conversations, Vapi/OpenAI is better.

## 2. Real-Time Audio Visualization (Web Audio API)
To make the UI feel "alive", we implemented a visualizer that reacts to actual audio frequencies, not just random animations.

**The Stack:**
- **AudioContext:** The main audio processing graph.
- **AnalyserNode:** Extracts frequency data (FFT) from the stream.
- **requestAnimationFrame:** Updates the UI 60 times per second.

**Implementation Logic:**
1. **Capture Stream:** `navigator.mediaDevices.getUserMedia({ audio: true })`
2. **Connect Node:** Source → Analyser
3. **Read Data:** `analyser.getByteFrequencyData(dataArray)`
4. **Visualize:** Map frequency values (0-255) to bar heights (0-100%).

**Why this matters:**
- **User Feedback:** Users instantly know if their mic is working.
- **Polish:** It turns a static interface into a dynamic, responsive experience.

## 3. Advanced Graph Layouts: The "Orb" Strategy
We moved from a messy "cloud" of nodes to a structured "Orb". This wasn't magic; it was physics.

**The Recipe:**
1.  **`d3.forceRadial`**: The secret sauce. It pulls *every* node toward a specific radius (e.g., 100 units from center).
    ```javascript
    graph.d3Force('radial', d3.forceRadial(100).strength(0.8));
    ```
2.  **`d3.forceManyBody` (Charge)**: A *weak* repulsion (-20) prevents overlap but allows density.
3.  **`d3.forceLink`**: Short links (30) keep related nodes (Course → Module) tight, forming clusters on the sphere's surface.

**Result:** A hollow sphere where clusters of related content float on the "surface", making everything visible and equidistant from the center.

## 4. Graph Cohesion: The "Root Node" Pattern
To prevent the graph from breaking into disconnected islands (which drift away), we introduced a **Root Node** ("My Universe").

**The Pattern:**
1.  Create a central node `{ id: 'root', type: 'root' }`.
2.  Connect *every* top-level entity (Courses) to this root.
3.  Hide the root (optional) or style it distinctly.

**Benefit:**
- **Physics:** The root acts as an anchor, holding the entire simulation together.
- **Navigation:** Gives users a "Home" button (Zoom to Root).
- **Structure:** Turns a "Forest" (multiple trees) into a single "Tree" (connected graph).
