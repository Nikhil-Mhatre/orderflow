
terraform {
  # Minimum Terraform CLI version required by this configuration.
  required_version = ">= 1.7.0"

  # Pin provider versions to compatible release ranges.
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.70"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.4"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 3.3"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 3.4"
    }

    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.14"
    }
  }
}
