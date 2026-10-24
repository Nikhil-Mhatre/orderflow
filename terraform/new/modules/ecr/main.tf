# Create one ECR repository for each service name provided.
module "ecr" {
  version  = "3.2.0"
  source   = "terraform-aws-modules/ecr/aws"
  for_each = toset(var.repository_names)

  # Prefix repository names with the project and environment name.
  repository_name = "${var.name}/${each.value}"

  # Control whether existing image tags can be overwritten.
  repository_image_tag_mutability = "IMMUTABLE"

  # Scan images for vulnerabilities when they are pushed.
  repository_image_scan_on_push = true

  # Encrypt repository images at rest using AES-256.
  repository_encryption_type = "AES256"

  # Apply a lifecycle policy to each repository to manage image retention.
  repository_lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep the most recent ${var.max_image_count} images",
        selection = {
          # Consider all images, regardless of tag status.
          tagStatus = "any"
          # Expire images once the configured image count is exceeded.
          countType   = "imageCountMoreThan"
          countNumber = var.max_image_count
        },
        action = {
          type = "expire"
        }
      }
    ]
  })

  # Apply common project tags and identify the service.
  tags = merge(
    var.common_tags,
    {
      Service = each.value
    }
  )
}
