
variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where EKS will run"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for EKS and its worker nodes"
  type        = list(string)
}

variable "tags" {
  description = "Tags applied to EKS resources"
  type        = map(string)
  default     = {}
}
