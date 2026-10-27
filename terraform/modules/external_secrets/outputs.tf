
output "iam_role_arn" {
  description = "IAM role ARN associated with the ESO controller."
  value       = aws_iam_role.external_secrets.arn
}

output "helm_release_status" {
  description = "Status of the ESO Helm release."
  value       = helm_release.external_secrets.status
}

output "namespace" {
  description = "Namespace where ESO is installed."
  value       = var.namespace
}
