
# Project/environment prefix used in the IAM role name.
variable "name" {
  description = "Project and environment name prefix."
  type        = string
}

# Exact OIDC subject allowed to assume the role.
# Example: repo:OWNER/REPOSITORY:ref:refs/heads/main
variable "github_oidc_subject" {
  description = "Exact GitHub OIDC subject allowed to assume the IAM role."
  type        = string
  nullable    = false

  validation {
    condition     = length(trimspace(var.github_oidc_subject)) > 0
    error_message = "github_oidc_subject must not be empty."
  }
}

# Only these ECR repositories will be accessible to the workflow.
variable "ecr_repository_arns" {
  description = "ARNs of ECR repositories used by the CI/CD workflow."
  type        = list(string)
}


# Shared tags supplied by the root module.
variable "common_tags" {
  description = "Tags applied to supported IAM resources."
  type        = map(string)
  default     = {}
}
