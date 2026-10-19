terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.79"
    }
  }

  # Configure a separate remote backend here if desired.
  # This root must use a state separate from ../ (the application infrastructure).
}
