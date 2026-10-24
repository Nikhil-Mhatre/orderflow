
variable "aws_region" {
  description = "AWS region for infrastructure deployment."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project used in resource naming."
  type        = string
  default     = "order-flow"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "project_name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.environment))
    error_message = "environment must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "tags" {
  description = "Additional tags applied to AWS resources."
  type        = map(string)
  default     = {}
}

# ***************************************************
# ---------------------- VPC ------------------------
# ***************************************************

variable "vpc_cidr" {
  description = "CIDR block allocated to the VPC."
  type        = string
  default     = "10.40.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones for networking. Empty selects the first two available zones."
  type        = list(string)
  default     = []
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.40.101.0/24", "10.40.102.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets."
  type        = list(string)
  default     = ["10.40.1.0/24", "10.40.2.0/24"]
}

variable "enable_nat_gateway" {
  description = "Whether to provision NAT gateways for private subnet internet access."
  type        = bool
  default     = false
}

variable "single_nat_gateway" {
  description = "Use one NAT gateway instead of one per availability zone."
  type        = bool
  default     = true
}

# ***************************************************
# ---------------------- ECR ------------------------
# ***************************************************

variable "ecr_repository_names" {
  description = "Service names for which ECR repositories will be created."
  type        = list(string)
  default     = ["frontend", "api", "worker"]
}

variable "ecr_max_image_count" {
  description = "Maximum number of images retained per ECR repository."
  type        = number
  default     = 5

  validation {
    condition = (
      var.ecr_max_image_count >= 1 &&
      var.ecr_max_image_count == floor(var.ecr_max_image_count)
    )
    error_message = "ecr_max_image_count must be a positive integer."
  }
}

# ***************************************************
# ---------------------- EKS ------------------------
# ***************************************************

variable "endpoint_public_access_cidrs" {
  description = "CIDRs allowed to access the EKS public API endpoint. Restrict this to trusted IP ranges."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# ***************************************************
# ---------------------- Github OIDC ------------------------
# ***************************************************
variable "github_org" {
  description = "GitHub organization or account name."
  type        = string
}

# Repository containing the GitHub Actions workflow.
variable "github_repo" {
  description = "GitHub repository name, without the owner prefix."
  type        = string
}

# Branch allowed to assume the deployment role.
variable "github_deploy_branch" {
  description = "Git branch permitted to assume the GitHub Actions IAM role."
  type        = string
  default     = "main"
}
