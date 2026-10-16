# Terraform infrastructure

Creates VPC networking, EKS Auto Mode, KMS, three ECR repositories, private PostgreSQL RDS, Secrets Manager secrets, EventBridge, SQS + DLQ, CloudWatch logs/alarms, and GitHub OIDC role for ECR publishing.

## Use
1. Configure AWS CLI credentials.
2. Copy `terraform.tfvars.example` to `terraform.tfvars`.
3. Set `public_access_cidrs` to your current public IP `/32`.
4. Set GitHub owner and source repo.
5. Run `terraform init`, `terraform fmt -recursive`, `terraform validate`, `terraform plan`, then `terraform apply`.

## Review notes
- Validate EKS Auto Mode module arguments and Kubernetes version against current AWS/module documentation before applying.
- If the GitHub OIDC provider already exists in this AWS account, import it or modify this code to reuse it.
- Terraform state contains database and JWT secrets. Use an encrypted, versioned remote backend with state locking for team use.
- The GitHub role is restricted to pushing to the three ECR repositories. The GitOps repository write token is a GitHub secret, not an AWS credential.
- This starter does not install Argo CD or External Secrets Operator. Install those as a platform bootstrap step; the GitOps manifests expect ESO plus a least-privilege AWS role to already exist.
- This code is a starter and has not been run against your AWS account. Inspect the plan and test in a non-production account.
