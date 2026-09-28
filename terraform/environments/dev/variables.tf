# -----------------------------------------------------------------------------
# General
# -----------------------------------------------------------------------------
variable "aws_region" {
  description = "AWS region where the OrderFlow development environment is deployed."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project."
  type        = string
  default     = "orderflow"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"
}

# -----------------------------------------------------------------------------
# VPC
# -----------------------------------------------------------------------------
variable "vpc_cidr" {
  description = "CIDR block for the OrderFlow VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability Zones used by the development environment."
  type        = list(string)

  default = [
    "us-east-1a",
    "us-east-1b"
  ]
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet."
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets."
  type        = list(string)

  default = [
    "10.0.2.0/24",
    "10.0.3.0/24"
  ]
}

variable "private_subnet_cidr" {
  description = "CIDR block for the private subnet."
  type        = string
  default     = "10.0.2.0/24"
}

# -----------------------------------------------------------------------------
# IAM
# -----------------------------------------------------------------------------
variable "github_repository" {
  description = "GitHub repository allowed to assume the GitHub Actions IAM role. Format: owner/repository."
  type        = string
}

# -----------------------------------------------------------------------------
# RDS
# -----------------------------------------------------------------------------
variable "database_name" {
  description = "Name of the OrderFlow PostgreSQL database."
  type        = string
}

variable "database_username" {
  description = "Master username for the OrderFlow PostgreSQL database."
  type        = string
}

# -----------------------------------------------------------------------------
# EKS
# -----------------------------------------------------------------------------
variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster."
  type        = string
}

variable "eks_public_access_cidr" {
  description = "Public IP CIDR allowed to access the EKS Kubernetes API."
  type        = string

  validation {
    condition     = can(cidrhost(var.eks_public_access_cidr, 0))
    error_message = "eks_public_access_cidr must be a valid CIDR block."
  }
}

variable "node_instance_types" {
  description = "EC2 instance types used by the EKS managed node group."
  type        = list(string)

  default = [
    "t3.small"
  ]
}

variable "node_desired_size" {
  description = "Desired number of EKS worker nodes."
  type        = number
  default     = 1
}

variable "node_min_size" {
  description = "Minimum number of EKS worker nodes."
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of EKS worker nodes."
  type        = number
  default     = 2
}
