import { ApiEndpoints, ExternalLinks } from "@/app/models/types";

export const APIs: ApiEndpoints = {
  BIO_AWS: "https://joshydavid.s3.us-east-1.amazonaws.com/Joshua.json",
  COMPANY_AWS: "https://joshydavid.s3.us-east-1.amazonaws.com/Companies.json",
};

export const EXTERNAL_LINKS: ExternalLinks = {
  PROFILE_PICTURE: "https://joshydavid.s3.us-east-1.amazonaws.com/Josh.png",
  RESUME: "https://joshydavid.s3.us-east-1.amazonaws.com/Joshua_Ang_Resume.pdf",
  OPEN_GRAPH:
    "https://joshydavid.s3.us-east-1.amazonaws.com/Joshy_Open_Graph.png",
  LINKEDIN: "https://linkedin.com/in/joshydavid",
  GITHUB: "https://github.com/joshydavid",
};
