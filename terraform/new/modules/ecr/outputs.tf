# ECR repository names, keyed by service (frontend, api, worker).
output "repository_names" {
  description = "Full ECR repository names keyed by service."
  value = {
    for service, repo in module.ecr :
    service => repo.repository_name
  }
}

# Repository URLs used by CI pipelines to push container images.
output "repository_urls" {
  description = "ECR repository URLs keyed by service."
  value = {
    for service, repo in module.ecr :
    service => repo.repository_url
  }
}

# Repository ARNs for IAM policies and access control.
output "repository_arns" {
  description = "ECR repository ARNs keyed by service."
  value = {
    for service, repo in module.ecr :
    service => repo.repository_arn
  }
}

# AWS account registry IDs, if needed by automation.
output "registry_ids" {
  description = "ECR registry IDs keyed by service."
  value = {
    for service, repo in module.ecr :
    service => repo.repository_registry_id
  }
}
