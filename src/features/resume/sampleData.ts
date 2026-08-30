import { ResumeData } from "./types";

export const sampleResumeData: ResumeData = {
  personalInfo: {
    firstName: "Alex",
    lastName: "Vance",
    title: "Senior Full-Stack & Cloud Infrastructure Engineer",
    email: "alex.vance@devmail.io",
    phone: "+1 (415) 890-4321",
    city: "San Francisco, CA (Open to Remote)",
    github: "github.com/alexvance-dev",
    linkedin: "linkedin.com/in/alexvance",
    website: "https://alexvance.dev",
  },
  aboutMe: {
    summary:
      "Results-driven engineer with 6+ years designing high-throughput distributed microservices, scalable cloud platforms, and modern web applications. Proven track record reducing system latencies by 40% and mentoring 10+ engineers.",
  },
  experience: [
    {
      id: "exp-1",
      role: "Staff Backend & Infrastructure Engineer",
      company: "CloudScale Systems",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description:
        "• Architected event-driven microservices platform with Go and Kafka handling 85k+ RPS at sub-15ms p99 latency\n• Automated multi-region AWS Kubernetes (EKS) infrastructure via Terraform, decreasing deployment cycle times by 65%\n• Led technical design reviews across 4 agile teams and established zero-trust observability with Prometheus and OpenTelemetry",
      technologies: ["Go", "Kafka", "Kubernetes", "AWS", "Terraform", "PostgreSQL"],
    },
    {
      id: "exp-2",
      role: "Full-Stack Engineer",
      company: "Apex Fintech",
      location: "New York, NY (Remote)",
      startDate: "2020",
      endDate: "2022",
      current: false,
      description:
        "• Engineered real-time asset trading dashboard with Next.js, React, and WebSocket streaming serving 120k daily active traders\n• Built robust transactional payment microservices with Node.js and Redis distributed locks with zero financial reconciliation errors\n• Implemented end-to-end CI/CD test automation pipelines achieving 94% test coverage",
      technologies: ["TypeScript", "React", "Next.js", "Node.js", "Redis", "Docker"],
    },
    {
      id: "exp-3",
      role: "Software Developer",
      company: "Nexus Labs",
      location: "Boston, MA",
      startDate: "2018",
      endDate: "2020",
      current: false,
      description:
        "• Developed RESTful and GraphQL APIs for client-facing SaaS analytics tools used by 45+ enterprise clients\n• Optimized PostgreSQL database queries and indexing, cutting heavy dashboard report execution time from 12s to 600ms",
      technologies: ["Python", "Django", "PostgreSQL", "React", "GraphQL"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "RaftKV — Distributed Consensus Store",
      role: "Lead Creator & Maintainer",
      website: "https://github.com/alexvance-dev/raft-kv",
      technologies: ["Rust", "Raft", "gRPC", "Tokio"],
      description:
        "High-performance Raft consensus key-value database in Rust featuring zero-copy serialization and linearizable reads (1.4k GitHub stars).",
    },
    {
      id: "proj-2",
      name: "KubePulse — Cluster Cost & Telemetry Visualizer",
      role: "Creator",
      website: "https://kubepulse.dev",
      technologies: ["Next.js", "Go", "Kubernetes API", "Tailwind CSS"],
      description:
        "Lightweight Kubernetes cost monitor that identifies unallocated memory & CPU allocations to reduce cloud expenditure.",
    },
  ],
  skills: [
    {
      id: "skill-lang",
      category: "Languages",
      skills: ["TypeScript", "JavaScript", "Go", "Python", "Rust", "SQL", "HTML5/CSS3"],
    },
    {
      id: "skill-backend",
      category: "Backend & Systems",
      skills: ["Node.js", "Express", "gRPC", "GraphQL", "PostgreSQL", "Redis", "Kafka", "Elasticsearch"],
    },
    {
      id: "skill-frontend",
      category: "Frontend",
      skills: ["React", "Next.js", "Tailwind CSS", "Redux", "Zustand", "Webpack/Vite"],
    },
    {
      id: "skill-devops",
      category: "Cloud & DevOps",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD (GitHub Actions)", "Linux", "Prometheus"],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "University of California, Berkeley",
      degree: "B.S. in Computer Science & Engineering",
      startDate: "2014",
      endDate: "2018",
      details: "Dean's Honors List • Focus: Distributed Systems & Operating Systems",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2023",
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      date: "2022",
    },
  ],
  awards: [
    {
      id: "award-1",
      name: "1st Place Winner — Global Infrastructure Hackathon",
      issuer: "Major League Hacking / CNCF",
      date: "2023",
      description: "Developed automated zero-downtime canary deployment operator for Kubernetes.",
    },
    {
      id: "award-2",
      name: "Engineering Innovation Award",
      issuer: "CloudScale Systems",
      date: "2024",
      description: "Recognized for architecting cost-saving multi-tenant caching layer.",
    },
  ],
  languages: [
    {
      id: "lang-1",
      name: "English",
      proficiency: "Native",
    },
    {
      id: "lang-2",
      name: "German",
      proficiency: "B2",
    },
  ],
  settings: {
    template: "modern",
    density: "normal",
    fontSizeMultiplier: 1.05,
    spacingMultiplier: 1.0,
    showIcons: true,
    language: "en",
  },
  lastModified: Date.now(),
};
