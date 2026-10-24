
# Expose the role ARN so GitHub Actions can assume this role.
output "role_arn" {
  description = "IAM role ARN for the GitHub Actions workflow."
  value       = module.github_actions_iam.arn
}

# Expose the role name for troubleshooting and auditing.
output "role_name" {
  description = "Name of the GitHub Actions IAM role."
  value       = module.github_actions_iam.name
}
