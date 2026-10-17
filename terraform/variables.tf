variable "aws_region" {
  description = "AWS region for the environment."
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Short project identifier used in resource names."
  type        = string
  default     = "order-flow"
}

variable "environment" {
  description = "Environment name."
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "VPC IPv4 CIDR."
  type        = string
  default     = "10.40.0.0/16"
}

variable "availability_zones" {
  description = "Optional AZ list. Empty selects the first two AZs available in the region."
  type        = list(string)
  default     = []
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.40.1.0/24", "10.40.2.0/24"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.40.101.0/24", "10.40.102.0/24"]
}

variable "single_nat_gateway" {
  description = "Use one NAT gateway for dev cost savings. Use one per AZ for stronger production resilience."
  type        = bool
  default     = true
}

variable "eks_cluster_version" {
  description = "Kubernetes version supported by EKS in the selected region."
  type        = string
  default     = "1.33"
}

variable "eks_public_access_cidrs" {
  description = "CIDRs allowed to access the EKS public API endpoint. Restrict this to trusted IP ranges."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "ecr_image_tag_mutability" {
  type    = string
  default = "IMMUTABLE"
  validation {
    condition     = contains(["MUTABLE", "IMMUTABLE"], var.ecr_image_tag_mutability)
    error_message = "Use MUTABLE or IMMUTABLE."
  }
}

variable "db_name" {
  type    = string
  default = "orderflow"
}

variable "db_username" {
  type    = string
  default = "orderflow_admin"
}

variable "db_instance_class" {
  description = "Choose a supported instance class for the selected region."
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  type    = number
  default = 20
}

variable "db_max_allocated_storage" {
  type    = number
  default = 100
}

variable "db_multi_az" {
  description = "Enable Multi-AZ for higher availability; costs more."
  type        = bool
  default     = false
}

variable "db_backup_retention_days" {
  type    = number
  default = 1
}

variable "github_org" {
  description = "GitHub organization or username for the source repository."
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name containing the application and Terraform."
  type        = string
}

variable "github_deploy_branch" {
  description = "Branch allowed to assume the GitHub Actions deployment role."
  type        = string
  default     = "main"
}

variable "worker_namespace" {
  description = "Kubernetes namespace for the worker Pod Identity association."
  type        = string
  default     = "order-flow"
}

variable "worker_service_account" {
  description = "Kubernetes ServiceAccount used by the worker."
  type        = string
  default     = "order-flow-worker"
}

variable "tags" {
  description = "Additional resource tags."
  type        = map(string)
  default     = {}
}
