
# Prefix used to name the GitHub Actions IAM role and policy.
variable "prefix" {
  description = "Project, environment and module name prefix."
  type        = string
}

# Github OIDC Subject Claim prefix
variable "subject_claim_prefix" {
  description = "Github OIDC subject claim prefix"
  type        = string
}

# Branch allowed to assume the deployment role.
variable "github_deploy_branch" {
  description = "Git branch permitted to assume the GitHub Actions IAM role."
  type        = string
  default     = "main"
}

# ECR repositories that GitHub Actions may publish images to or retrieve images from.
variable "ecr_repository_arns" {
  description = "ARNs of ECR repositories accessible to GitHub Actions."
  type        = list(string)

  validation {
    condition     = length(var.ecr_repository_arns) > 0
    error_message = "Provide at least one ECR repository ARN."
  }
}


# Common tags passed from the root Terraform configuration.
variable "common_tags" {
  description = "Common tags applied to resources created by this module."
  type        = map(string)
  default     = {}
}
