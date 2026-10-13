
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "eks_clustercluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.eks_clustercluster_name
}

output "eks_clusterendpoint" {
  description = "EKS API endpoint"
  value       = module.eks.eks_clusterendpoint
}

output "eks_clustercluster_security_group_id" {
  description = "EKS cluster security group ID"
  value       = module.eks.eks_clustercluster_security_group_id
}
