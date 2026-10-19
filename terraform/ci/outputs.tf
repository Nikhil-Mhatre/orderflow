output "github_actions_role_arn" {
  description = "Set this as the GitHub Actions repository variable AWS_ROLE_ARN."
  value       = aws_iam_role.github_actions.arn
}

output "ecr_repository_urls" {
  description = "ECR repository URLs keyed by service."
  value       = { for service, repository in aws_ecr_repository.service : service => repository.repository_url }
}

output "ecr_repository_names" {
  description = "ECR repository names keyed by service."
  value       = { for service, repository in aws_ecr_repository.service : service => repository.name }
}

output "aws_region" {
  value = var.aws_region
}
