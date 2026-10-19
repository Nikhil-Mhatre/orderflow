locals {
  ecr_repository_names = {
    for service in var.service_names :
    service => "${var.project_name}/${service}"
  }
}

resource "aws_ecr_repository" "service" {
  for_each = local.ecr_repository_names

  name                 = each.value
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_lifecycle_policy" "service" {
  for_each   = aws_ecr_repository.service
  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire older tagged images while retaining recent releases"
        selection = {
          tagStatus      = "tagged"
          tagPatternList = ["*"]
          countType      = "imageCountMoreThan"
          countNumber    = var.image_retention_count
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
