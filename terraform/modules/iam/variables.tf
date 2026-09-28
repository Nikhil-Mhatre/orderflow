variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "environment" {
  description = "Deployment environment."
  type        = string
}

variable "github_repository" {
  description = "GitHub repository allowed to assume the GitHub Actions IAM role. Format: owner/repository."
  type        = string
}
