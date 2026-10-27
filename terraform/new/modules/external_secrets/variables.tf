
variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
}

variable "aws_region" {
  description = "AWS region containing EKS and Secrets Manager."
  type        = string
}

variable "rds_master_secret_arn" {
  description = "ARN of the RDS-managed master credentials secret."
  type        = string
}

variable "namespace" {
  description = "Kubernetes namespace for External Secrets Operator."
  type        = string
  default     = "external-secrets"
}

variable "helm_chart_version" {
  description = "Pinned version of the External Secrets Helm chart."
  type        = string
}
