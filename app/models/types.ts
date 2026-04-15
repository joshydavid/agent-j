export enum ProjectTag {
  SOFTWARE_ENGINEERING = "software-engineering",
  GOVTECH_PROJECT = "govtech-project",
  HACKATHON = "hackathon",
  PET_PROJECT = "pet-project",
  WORK_IN_PROGRESS = "work-in-progress",
  SCHOOL_PROJECT = "school-project",
}

export enum DeploymentStatus {
  DEPLOYED = "deployed",
  UNDER_REVIEW = "under-review",
}

export enum TechStack {
  TYPESCRIPT = "TypeScript",
  NEXT_JS = "Next.js",
  TAILWIND_CSS = "Tailwind CSS",
  SHADCN_UI = "shadcn/ui",
  KOA_JS = "Koa.js",
  TYPEORM = "TypeORM",
  POSTGRESQL = "PostgreSQL",
  OPENAI = "OpenAI API",
  NEST_JS = "Nest.js",
  JAVA = "Java",
  SPRING_BOOT = "Spring Boot",
  REACT = "React",
  REDIS = "Redis",
  AWS_AMPLIFY = "AWS Amplify",
  AWS_EC2 = "AWS EC2",
  AWS_RDS = "AWS RDS",
  FAST_API = "FastAPI",
  PYTHON = "Python",
  GO = "Go",
  LANG_CHAIN = "LangChain",
  LANG_GRAPH = "LangGraph",
  QDRANT = "Qdrant",
  MONGODB = "MongoDB",
  DOCKER = "Docker",
  TERRAFORM = "Terraform",
  KUBERNETES = "Kubernetes",
  KONG_GATEWAY = "Kong Gateway",
  LARGE_LANGUAGE_MODELS = "LLMs",
  AMAZON_WEB_SERVICES = "AWS",
  AWS_S3 = "AWS S3",
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  features?: string[];
  tags: (number | ProjectTag)[];
  techStack: TechStack[] | string[];
  deploymentStatus: DeploymentStatus;
  deployedLink?: string;
  gitHub?: string;
  isMobile?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
}

export interface ApiEndpoints {
  BIO_AWS: string;
  COMPANY_AWS: string;
}

export interface ExternalLinks {
  PROFILE_PICTURE: string;
  RESUME: string;
  OPEN_GRAPH: string;
  LINKEDIN: string;
  GITHUB: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  timeline: string;
  icon: string;
  isCompleted: boolean;
}
