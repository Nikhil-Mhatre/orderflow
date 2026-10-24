
# Configure the AWS provider for the selected deployment region.
provider "aws" {
  region = var.aws_region

  # Apply common tags automatically to supported AWS resources.
  default_tags {
    tags = local.common_tags
  }
}
