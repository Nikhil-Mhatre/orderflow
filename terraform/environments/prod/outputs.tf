
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
# ---------------------- RDS ------------------------
# ***************************************************
output "rds_master_secret_arn" {
  description = "ARN of the RDS-managed master credentials secret"
  value       = module.rds.db_master_user_secret_arn
  sensitive   = true
}

# ***************************************************
# ---------------------- SQS ------------------------
# ***************************************************

output "queue_url" {
  value       = module.worker_events.queue_url
  description = "URL for the worker's primary queue."
}

output "queue_arn" {
  value       = module.worker_events.queue_arn
  description = "ARN for IAM policies granting the worker access."
}

output "processing_dlq_arn" {
  value       = module.worker_events.processing_dlq_arn
  description = "ARN of the processing failure DLQ."
}

output "eventbridge_rule_arn" {
  value       = module.worker_events.eventbridge_rule_arn
  description = "ARN of the EventBridge rule."
}

output "eventbridge_delivery_dlq_arn" {
  value       = module.worker_events.eventbridge_delivery_dlq_arn
  description = "ARN of the EventBridge target delivery DLQ."
}




# ***************************************************
# ---------------------- Github ------------------------
# ***************************************************
output "github_actions_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions."
  value       = module.github_oidc.github_actions_role_arn
}

# ***************************************************
# ---------------------- Argocd ------------------------
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
