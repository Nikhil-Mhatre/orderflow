variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "environment" {
  description = "Deployment environment."
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster."
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where EKS will be created."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs used by the EKS cluster and worker nodes."
  type        = list(string)

  validation {
    condition     = length(var.private_subnet_ids) >= 2
    error_message = "At least two private subnet IDs are required for EKS."
  }
}

variable "public_access_cidr" {
  description = "CIDR allowed to access the EKS Kubernetes API publicly."
  type        = string

  validation {
    condition     = can(cidrhost(var.public_access_cidr, 0))
    error_message = "public_access_cidr must be a valid CIDR block."
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
  description = "Desired number of nodes in the EKS managed node group."
  type        = number
  default     = 1
}

variable "node_min_size" {
  description = "Minimum number of nodes in the EKS managed node group."
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of nodes in the EKS managed node group."
  type        = number
  default     = 2
}

variable "load_balancer_controller_namespace" {
  description = "Kubernetes namespace where the AWS Load Balancer Controller will run."
  type        = string
  default     = "kube-system"
}

variable "load_balancer_controller_service_account" {
  description = "Kubernetes service account used by the AWS Load Balancer Controller."
  type        = string
  default     = "aws-load-balancer-controller"
}

variable "load_balancer_controller_version" {
  description = "AWS Load Balancer Controller version."
  type        = string
  default     = "v2.14.1"
}
