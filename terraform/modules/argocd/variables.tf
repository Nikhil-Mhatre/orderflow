variable "eks_cluster_name" {
  description = "Name of the existing EKS cluster."
  type        = string
}

variable "aws_region" {
  description = "AWS region containing the EKS cluster."
  type        = string
}

variable "argocd_chart_version" {
  description = "Version of the argo/argo-cd Helm chart."
  type        = string
}

variable "argocd_namespace" {
  description = "Namespace for Argo CD."
  type        = string
  default     = "argocd"
}

variable "gitops_repo_url" {
  description = "HTTPS URL of the GitOps repository. This module assumes it is publicly accessible."
  type        = string
}

variable "gitops_revision" {
  description = "Git branch, tag, or commit Argo CD should track."
  type        = string
  default     = "main"
}

variable "gitops_path" {
  description = "Path in the GitOps repository containing the root manifests or Kustomize entry point."
  type        = string
}

variable "root_application_name" {
  description = "Name of the root Argo CD Application."
  type        = string
  default     = "root-app"
}

variable "destination_namespace" {
  description = "Default destination namespace for synced resources."
  type        = string
  default     = "default"
}

variable "enable_prune" {
  description = "Allow automated sync to delete resources removed from Git."
  type        = bool
  default     = false
}
