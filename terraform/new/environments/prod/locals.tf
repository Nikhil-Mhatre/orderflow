
data "aws_availability_zones" "available" {
  state = "available"
}

locals {

  availability_zones = (
    length(var.availability_zones) > 0
    ? var.availability_zones
    : slice(
      data.aws_availability_zones.available.names,
      0,
      2
    )
  )

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
    },
    var.tags
  )
}
