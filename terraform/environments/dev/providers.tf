terraform {
  backend "s3" {
    bucket  = "terraform-state-690532463350"
    key     = "orderflow/dev/terraform.tfstate"
    region  = "us-east-1"
    profile = "default"

    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "OrderFlow"
      Environment = "prod"
      ManagedBy   = "Terraform"
    }
  }
}
