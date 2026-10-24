# EKS cluster name used to configure kubectl.
output "eks_cluster_name" {
  description = "Name of the OrderFlow EKS cluster."
  value       = module.eks.cluster_name
}

# API endpoint for tools and clients connecting to the cluster.
output "eks_cluster_endpoint" {
  description = "Kubernetes API server endpoint."
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_arn" {
  description = "ARN of the EKS cluster used by the deployment workflow."
  value       = module.eks.cluster_arn
}
