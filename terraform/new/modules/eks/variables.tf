variable "name" {
  description = "EKS Cluster Name"
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version supported by EKS in the selected region."
  type        = string
  default     = "1.33"
}

variable "endpoint_public_access_cidrs" {
  description = "CIDRs allowed to access the EKS public API endpoint. Restrict this to trusted IP ranges."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "vpc_id" {
  description = "ID of the VPC where the cluster security group will be provisioned"
  type        = string
}
variable "private_subnets" {
  description = "A list of subnet IDs where the nodes/node groups will be provisioned."
  type        = list(string)
}

variable "common_tags" {
  description = "Additional tags applied to ECR repositories."
  type        = map(string)
  default     = {}
}
