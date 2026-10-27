terraform {
  backend "s3" {
    bucket       = "ordeflow-tfstate-475703"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
