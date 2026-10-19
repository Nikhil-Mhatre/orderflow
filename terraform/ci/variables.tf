variable "aws_region" {
  description = "AWS region in which the ECR repositories will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short project/resource prefix. Keep this consistent with your existing ECR naming if needed."
  type        = string
  default     = "orderflow"
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9_-]*$", var.project_name))
    error_message = "project_name must contain lowercase letters, digits, underscores, or hyphens."
  }
}

variable "github_org" {
  description = "GitHub organization or username that owns the source repository."
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name, without owner."
  type        = string
}

variable "github_deploy_branch" {
  description = "Branch allowed to assume the GitHub Actions role."
  type        = string
  default     = "main"
}


variable "service_names" {
  description = "Microservice ECR repository suffixes."
  type        = set(string)
  default     = ["api", "worker", "frontend"]
}

variable "image_retention_count" {
  description = "Number of most recently pushed tagged images to retain per repository."
  type        = number
  default     = 20
}
