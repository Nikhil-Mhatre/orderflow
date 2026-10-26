
# Region used by the AWS provider for this deployment.
output "aws_region" {
  description = "AWS region where the cluster is deployed."
  value       = var.aws_region
}


# ***************************************************
# ---------------------- VPC ------------------------
# ***************************************************

output "vpc_id" {
  description = "ID of the VPC."
  value       = module.vpc.vpc_id
}

output "nat_gateway_ids" {
  description = "IDs of NAT gateways created by the vpc module."
  value       = module.vpc.nat_gateway_ids
}

# ***************************************************
# ---------------------- ECR ------------------------
# ***************************************************

output "ecr_repository_names" {
  description = "Full ECR repository names keyed by service."
  value       = module.ecr.repository_names
}

output "ecr_repository_urls" {
  description = "ECR repository URLs keyed by service."
  value       = module.ecr.repository_urls
}

# ***************************************************
# ---------------------- EKS ------------------------
# ***************************************************

# EKS cluster name used to configure kubectl.
output "eks_cluster_name" {
  description = "Name of the OrderFlow EKS cluster."
  value       = module.eks.eks_cluster_name
}

# API endpoint for tools and clients connecting to the cluster.
output "eks_cluster_endpoint" {
  description = "Kubernetes API server endpoint."
  value       = module.eks.eks_cluster_endpoint
}

# ***************************************************
# ---------------------- Github ------------------------
# ***************************************************
output "github_actions_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions."
  value       = module.github_oidc.github_actions_role_arn
}

# ***************************************************
# ---------------------- Github ------------------------
# ***************************************************
output "argocd_namespace" {
  description = "Namespace where Argo CD is installed."
  value       = module.argocd.namespace
}

output "argocd_release_status" {
  description = "Terraform's Helm release status for Argo CD."
  value       = module.argocd.release_status
}

output "root_application_name" {
  description = "Name of the bootstrap Application."
  value       = module.argocd.root_application_name
}
