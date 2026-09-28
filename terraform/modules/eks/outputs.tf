output "cluster_name" {
  description = "Name of the EKS cluster."
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "API server endpoint of the EKS cluster."
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate authority data for the EKS cluster."
  value       = aws_eks_cluster.this.certificate_authority[0].data
}

output "cluster_arn" {
  description = "ARN of the EKS cluster."
  value       = aws_eks_cluster.this.arn
}

output "cluster_security_group_id" {
  description = "Security group ID created for the EKS control plane."
  value       = aws_eks_cluster.this.vpc_config[0].cluster_security_group_id
}

output "cluster_role_arn" {
  description = "IAM role ARN used by the EKS control plane."
  value       = aws_iam_role.cluster.arn
}

output "node_role_arn" {
  description = "IAM role ARN used by the EKS managed node group."
  value       = aws_iam_role.node.arn
}

output "node_group_name" {
  description = "Name of the EKS managed node group."
  value       = aws_eks_node_group.this.node_group_name
}

output "node_security_group_id" {
  description = "Security group ID attached to the EKS worker nodes."
  value       = aws_security_group.nodes.id
}

output "oidc_provider_arn" {
  description = "ARN of the EKS OIDC identity provider."
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_provider_url" {
  description = "URL of the EKS OIDC identity provider."
  value       = aws_iam_openid_connect_provider.eks.url
}

output "load_balancer_controller_role_arn" {
  description = "IAM role ARN used by the AWS Load Balancer Controller."
  value       = aws_iam_role.load_balancer_controller.arn
}

output "load_balancer_controller_role_name" {
  description = "IAM role name used by the AWS Load Balancer Controller."
  value       = aws_iam_role.load_balancer_controller.name
}
