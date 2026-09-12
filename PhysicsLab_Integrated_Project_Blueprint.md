<!-- markdownlint-disable-file -->
# PhysicsLab --- Integrated Learning & Engineering Blueprint

**Status:** Living project blueprint\
**Purpose:** Shared source of truth for GitHub Copilot, development
planning, and long-term learning\
**Primary stack:** Next.js + React, Java + Spring Boot, PostgreSQL\
**Learning tracks:** Senior Developer Curriculum + Computational
Physics + PhD Preparation

------------------------------------------------------------------------

## 1. Project Vision

PhysicsLab is a long-term full-stack application designed to make three
related goals reinforce one another:

1.  Become a senior-level software developer.
2.  Build practical computational-physics and numerical-programming
    skills.
3.  Gradually prepare for future graduate study in astrophysics, with
    particular interest in general relativity, geometry, and
    computational physics.

PhysicsLab should not be a collection of artificial demos. Each feature
should solve a meaningful physics/math problem while also creating an
opportunity to practice production-quality software engineering.

### Core principle

> Build real PhysicsLab functionality in a way that naturally requires
> the software-engineering concepts being studied.

The project should evolve in technical and scientific complexity over
time.

------------------------------------------------------------------------

# 2. The Three Integrated Tracks

## Track A --- Senior Developer Curriculum

Current focus:

-   Next.js rendering architecture
-   CSR
-   SSR
-   SSG
-   ISR
-   Server Components vs Client Components
-   Data fetching and caching
-   Architecture and tradeoff reasoning

Future topics can include:

-   API design
-   Spring Boot architecture
-   PostgreSQL data modeling
-   Authentication and authorization
-   Testing
-   Performance
-   Caching
-   Async processing
-   Observability
-   Security
-   Distributed systems
-   Scalability
-   System design
-   CI/CD
-   Cloud deployment

**Current study commitment:** 1 hour/week.

## Track B --- Computational Physics / PhysicsLab

PhysicsLab is the practical laboratory where mathematical and physical
ideas become software.

Potential progression:

Linear algebra → numerical linear algebra → numerical ODEs → classical
mechanics → orbital mechanics → N-body simulations → astrophysical
simulations → differential geometry → tensors → spacetime/geodesics →
general relativity

## Track C --- PhD Preparation

Long-term goal:

-   Strengthen mathematics.
-   Rebuild/extend physics knowledge where needed.
-   Develop computational-physics ability.
-   Build research-oriented projects.
-   Seek research experience before eventually applying to
    astrophysics/GR PhD programs.

**Current math commitment:** 1 hour/week of Linear Algebra.

Do not optimize for speed. Optimize for durable understanding.

------------------------------------------------------------------------

# 3. Architecture Learning Laboratory

PhysicsLab should deliberately provide real use cases for the four major
Next.js rendering strategies.

  -----------------------------------------------------------------------
  PhysicsLab feature      Primary strategy        Reason
  ----------------------- ----------------------- -----------------------
  About / project         SSG                     Rarely changes
  documentation                                   

  Physics concept pages   SSG                     Educational content
                                                  changes infrequently

  Problem library         ISR                     Content changes
                                                  occasionally and can
                                                  tolerate controlled
                                                  staleness

  Problem detail pages    ISR                     Mostly static,
                                                  SEO-friendly,
                                                  periodically updated

  Simulation              SSR                     Request-specific
  configuration/results                           information

  Interactive simulation  CSR / Client Components Highly interactive
  controls                                        browser state

  User experiments        SSR + Client Components Personalized data plus
                                                  interaction

  User dashboard          SSR + Client Components Personalized initial
                                                  data plus interactive
                                                  UI

  Authentication forms    Server + Client         Server-side auth/data
                          Components              handling plus
                                                  interactive forms
  -----------------------------------------------------------------------

The exact architecture should be reevaluated as the application evolves.

------------------------------------------------------------------------

# 4. Important Next.js Principle

Do not treat these as the same decision:

### Rendering/data-fetching strategy

-   SSG
-   ISR
-   SSR
-   CSR

### Component execution model

-   Server Component
-   Client Component

A Client Component does not automatically mean that the entire page must
use CSR.

For example:

Product/Simulation Page
│
├── Explanation
│     Server Component
│     ISR
│
├── Initial parameters
│     Server Component
│     SSR/ISR
│
├── Interactive controls
│     Client Component
│
├── Visualization
│     Client Component
│
└── Related concepts
      Server Component
      SSG/ISR

This distinction should remain a core architectural principle throughout
PhysicsLab.

------------------------------------------------------------------------

# 5. Proposed Application Structure

``` text
PhysicsLab
│
├── /
│   └── Homepage
│
├── /concepts
│   ├── /linear-algebra
│   ├── /classical-mechanics
│   ├── /special-relativity
│   ├── /general-relativity
│   └── ...
│
├── /problems
│   ├── /linear-algebra
│   ├── /mechanics
│   ├── /computational-physics
│   └── ...
│
├── /problems/[id]
│
├── /simulations
│   ├── /orbit
│   ├── /n-body
│   ├── /projectile
│   ├── /double-pendulum
│   └── ...
│
├── /simulations/[id]
│
├── /experiments
│
├── /experiments/[id]
│
├── /dashboard
│
└── /about
```

This is a conceptual structure, not a requirement to implement every
route immediately.

------------------------------------------------------------------------

# 6. Rendering Strategy Examples

## 6.1 SSG --- Physics Knowledge Base

Example routes:

``` text
/concepts/linear-algebra/vectors
/concepts/linear-algebra/matrices
/concepts/classical-mechanics/newtons-laws
/concepts/relativity/spacetime
```

Possible content:

-   Explanation
-   Equations
-   Examples
-   Diagrams
-   Related concepts
-   Links to problems
-   Links to simulations

Characteristics:

-   Mostly static
-   SEO can be valuable
-   Changes infrequently
-   Fast initial response

Practice:

-   Static generation
-   Dynamic routes
-   Metadata
-   Build-time data
-   Content organization

------------------------------------------------------------------------

## 6.2 ISR --- Physics Problem Library

Example:

/problems/orbital-mechanics/escape-velocity

Possible database model:

problems
--------
id
title
description
difficulty
topic
solution
created_at
updated_at

Problem pages can use ISR because:

-   They are largely read-heavy.
-   Content changes occasionally.
-   SEO may be useful.
-   Rebuilding the entire application for every content change is
    undesirable.
-   A controlled amount of staleness can be acceptable.

Example concept:

revalidate = 3600

The exact interval should be determined by application requirements, not
memorized as a universal value.

Practice:

-   ISR
-   Revalidation
-   Cache behavior
-   Cache invalidation
-   Dynamic routes
-   Database-backed content
-   Stale-data tradeoffs

------------------------------------------------------------------------

## 6.3 SSR --- Request-Specific Physics

Example:

/simulations/orbit?mass=...&velocity=...

A user can provide parameters such as:

-   Mass
-   Initial velocity
-   Initial position
-   Simulation duration
-   Time step
-   Gravitational parameters

The server can obtain or calculate request-specific information.

Conceptual flow:

Browser
   ↓
Next.js Server
   ↓
Spring Boot API
   ↓
Physics calculation / data retrieval
   ↓
Response
   ↓
Rendered page


Practice:

-   Server-side data fetching
-   Dynamic requests
-   Query parameters
-   Server Components
-   API integration
-   Loading/error states
-   Performance reasoning

Do not perform expensive calculations synchronously on the request path
if that would create unacceptable latency. As the project grows,
long-running simulations should move toward asynchronous job processing.

------------------------------------------------------------------------

## 6.4 CSR --- Interactive Physics

Good candidates:

-   Double pendulum
-   Orbit controls
-   Parameter sliders
-   Interactive plots
-   Animation controls
-   Data filtering
-   Real-time visualization

Conceptual flow:

User
  ↓
Client Component
  ↓
React state
  ↓
Physics calculation / worker / API
  ↓
Visualization


Practice:

-   useState / state management
-   Event handling
-   Browser APIs
-   Canvas/SVG/WebGL where appropriate
-   Animation
-   Client-side computation
-   Web Workers
-   Interactive visualization

The browser should not reload the whole page merely because a user
changes a simulation parameter.

------------------------------------------------------------------------

# 7. Combined Architecture --- The Most Important Goal

A mature PhysicsLab page should often combine multiple strategies.

Example:

/simulations/orbit
│
├── Simulation explanation
│      Server Component
│      ISR
│
├── Initial/default parameters
│      Server Component
│      SSR or ISR
│
├── Interactive controls
│      Client Component
│
├── Simulation visualization
│      Client Component
│
├── Saved results
│      Server Component
│      SSR
│
└── Related physics concepts
       Server Component
       SSG/ISR


This is preferable to artificially assigning one rendering strategy to
an entire page.

------------------------------------------------------------------------

# 8. Data Ownership and Source of Truth

PhysicsLab should distinguish between:

### Cached/display data

Examples:

-   Product-like metadata for simulations
-   Physics explanations
-   Problem descriptions
-   Previously generated results
-   Public statistics

These may be cached with SSG/ISR.

### Authoritative state

Examples:

-   User account state
-   Saved experiments
-   Current simulation job status
-   Final experiment results
-   Database records
-   Any state where correctness is critical

These should be validated against the backend/database as appropriate.

### Example

A displayed inventory-like value in another application might be stale
because it is cached.

Similarly, PhysicsLab might display a cached simulation result, but the
authoritative record should remain in the backend/database.

**Never assume cached UI data is automatically the source of truth.**

------------------------------------------------------------------------

# 9. Proposed Technical Architecture


                 Next.js Frontend
                       │
        ┌──────────────┼──────────────┐
        │              │              │
 Server Components  Client Components  Static/ISR
        │              │              │
        └──────────────┼──────────────┘
                       │
                    HTTP/API
                       │
                 Spring Boot
                       │
          ┌────────────┼────────────┐
          │            │            │
       Services    Simulation     Auth
          │         Engine
          │            │
          └────────────┼────────────┘
                       │
                   PostgreSQL


Potential future additions:


Spring Boot
    │
    ├── Redis/cache
    ├── Message queue
    ├── Background workers
    ├── Object/file storage
    └── Observability


Do not add infrastructure before the application genuinely needs it.
Introduce each technology to solve a real problem.

------------------------------------------------------------------------

# 10. Database Direction

Potential initial entities:

users
problems
concepts
simulations
simulation_runs
experiments
experiment_results


Potential relationships:


User
 ├── Experiments
 ├── Simulation Runs
 └── Saved Problems

Concept
 ├── Problems
 └── Simulations

Simulation
 └── Simulation Runs
       └── Results


The schema should evolve through real requirements rather than being
fully designed up front.

------------------------------------------------------------------------

# 11. PhysicsLab Development Philosophy

Every significant feature should ideally answer three questions:

### Software question

> What senior-level engineering concept am I practicing?

### Physics/math question

> What mathematical or physical concept am I implementing?

### Architecture question

> Why is this the correct way to load, store, calculate, and display the
> data?

Example:

### Orbit simulator

Software:

-   API design
-   React state
-   Server/Client Component boundaries
-   Numerical performance

Physics:

-   Newtonian gravity
-   ODE integration
-   Orbital mechanics

Architecture:

-   Which data is static?
-   Which data is request-specific?
-   Which calculations belong on the server?
-   Which calculations belong in the browser?
-   Should long simulations become asynchronous jobs?
-   Should results be cached?

------------------------------------------------------------------------

# 12. Senior Developer Curriculum Integration

PhysicsLab should be the practical implementation environment for the
curriculum.

Examples:

  Senior Developer topic        PhysicsLab application
  ----------------------------- ----------------------------------------------
  CSR/SSR/SSG/ISR               Rendering strategy laboratory
  Server vs Client Components   Simulation pages
  REST API design               Physics calculation API
  PostgreSQL modeling           Problems, experiments, simulations
  Transactions                  Saving experiment results
  Authentication                User experiments/dashboard
  Authorization                 Private/public experiments
  Testing                       Numerical correctness + application behavior
  Caching                       Simulation results / public content
  Async processing              Long-running simulations
  Performance                   Numerical calculations / visualization
  Security                      User data and API boundaries
  Observability                 Simulation jobs and API health
  System design                 Scaling simulation workloads
  CI/CD                         Automated PhysicsLab deployment

------------------------------------------------------------------------

# 13. PhD Preparation Integration

PhysicsLab should gradually become more scientifically sophisticated as
mathematical preparation progresses.

## Early stage

-   Linear algebra
-   Vectors
-   Matrices
-   Systems of equations
-   Basic numerical computation

## Intermediate stage

-   Numerical linear algebra
-   ODEs
-   Numerical integration
-   Error analysis
-   Classical mechanics
-   Orbital mechanics
-   N-body problems

## Advanced stage

-   PDEs
-   Numerical methods
-   Differential geometry
-   Tensor calculus
-   Special relativity
-   General relativity
-   Geodesics
-   Curvature
-   Relativistic simulations

The application should not jump ahead of the user's mathematical
understanding simply because a topic sounds interesting.

------------------------------------------------------------------------

# 14. Current Learning Commitments

Keep the workload sustainable.

### Senior Developer Curriculum

**1 hour/week**

Current status:

-   Week 1 --- CSR vs SSR: Complete
-   Week 2 --- SSG vs ISR: Current/pause point

The user has completed the Week 2 challenges through the e-commerce
rendering-strategy exercise.

Key lesson from the latest exercise:

> Rendering/data-fetching strategy and Server Component vs Client
> Component are separate architectural decisions.

Next planned Senior Developer exercise:

> A realistic Next.js architecture problem involving approximately 10
> components, requiring decisions about Server vs Client Components,
> SSG/ISR/SSR/CSR, and data sources.

Do not advance the curriculum until the user explicitly asks to
continue.

### PhD / Mathematics

**Linear Algebra: 1 hour/week**

Current focus:

-   Build durable mathematical understanding.
-   Avoid rushing through large textbooks.
-   Connect linear algebra concepts to future computational physics and
    GR.

------------------------------------------------------------------------

# 15. Definition of Done for a Learning Feature

A PhysicsLab feature is not complete merely because it works.

For meaningful learning, document:

Feature:
Why are we building it?

Physics:
What concept does it represent?

Math:
What equations/algorithms are involved?

Architecture:
Why did we choose this rendering/data strategy?

Backend:
What API/service owns the logic?

Database:
What data is persisted?

Frontend:
What is a Server Component?
What is a Client Component?

Performance:
What could become a bottleneck?

Testing:
How do we know the physics and software are correct?

Tradeoffs:
What alternatives did we reject and why?


This turns implementation into deliberate senior-level practice.

------------------------------------------------------------------------

# 16. Copilot Instructions

When helping develop PhysicsLab, GitHub Copilot should follow these
principles:

1.  Prefer simple, maintainable architecture over premature complexity.
2.  Explain significant architectural decisions when requested.
3.  Preserve clear boundaries between Next.js, Spring Boot, and
    PostgreSQL.
4.  Do not automatically make an entire page a Client Component.
5.  Prefer Server Components when browser interactivity is not required.
6.  Use Client Components only where browser-side state, events, APIs,
    or interactive visualization require them.
7.  Treat SSG, ISR, SSR, and CSR as data/rendering decisions rather than
    synonyms for Server/Client Components.
8.  Consider cache freshness and invalidation explicitly.
9.  Keep authoritative state on the backend/database where appropriate.
10. Never sacrifice numerical correctness for architectural convenience.
11. Add automated tests for important physics calculations.
12. Keep domain/physics calculations separate from presentation code.
13. Avoid premature microservices or infrastructure.
14. Prefer incremental evolution.
15. When a feature can reinforce a current Senior Developer curriculum
    lesson, implement it intentionally as a learning opportunity.
16. When a feature introduces advanced physics beyond the user's current
    mathematical preparation, flag that rather than hiding the
    complexity.
17. Favor designs that can evolve toward larger computational workloads
    without prematurely building a distributed system.

------------------------------------------------------------------------

# 17. Long-Term Vision

PhysicsLab should gradually become more than a portfolio project.

The desired trajectory is:


Full-stack learning project
        ↓
Physics/math learning laboratory
        ↓
Computational physics platform
        ↓
Research-oriented computational projects
        ↓
Potential research portfolio


At the same time:


Junior/intermediate software skills
        ↓
Senior-level architecture
        ↓
Strong full-stack engineering
        ↓
Scientific software engineering


And mathematically:


Linear Algebra
      ↓
Numerical Methods
      ↓
Computational Physics
      ↓
Astrophysics
      ↓
Differential Geometry
      ↓
General Relativity
      ↓
Computational GR


The three paths should reinforce one another.

------------------------------------------------------------------------

# 18. Blueprint Rule

When deciding what to build next, prioritize features that maximize
overlap between:

**Software engineering value + physics/math value + architectural
learning value.**

A feature that teaches all three is preferable to three disconnected
exercises.

The project should grow slowly, deliberately, and sustainably.

**PhysicsLab is the laboratory.\
The Senior Developer curriculum supplies the engineering challenges.\
The PhD preparation supplies the scientific and mathematical
direction.**
