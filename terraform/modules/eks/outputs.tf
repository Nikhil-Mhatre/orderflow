
output "eks_clustercluster_name" {
  description = "Name of the EKS eks"
  value       = module.eks.cluster_name
}

output "eks_clusterendpoint" {
  description = "Endpoint of the EKS eks"
  value       = module.eks.cluster_endpoint
}

output "eks_clustercluster_security_group_id" {
  description = "eks security group ID"
  value       = module.eks.cluster_security_group_id
}
