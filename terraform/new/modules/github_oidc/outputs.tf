
# ARN used by GitHub Actions when configuring AWS role assumption.
output "github_actions_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions."
  value       = aws_iam_role.github_actions.arn
}

# Role name for AWS IAM inspection and troubleshooting.
output "github_actions_role_name" {
  description = "Name of the GitHub Actions IAM role."
  value       = aws_iam_role.github_actions.name
}

# ARN of the GitHub OIDC provider registered in AWS IAM.
output "github_oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC identity provider."
  value       = aws_iam_openid_connect_provider.github.arn
}
