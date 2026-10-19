# OrderFlow CI-only Terraform

This is a standalone Terraform root for the infrastructure needed to test GitHub Actions image publishing. It creates only:

- ECR repositories for `api`, `worker`, and `frontend`
- ECR lifecycle policies
- GitHub's OIDC provider
- A GitHub Actions IAM role restricted to the configured repository and branch
- An IAM policy that permits pushing images to these repositories

It does **not** create EKS, VPC, NAT Gateway, RDS, SQS, EventBridge, or Argo CD.

## Important state and OIDC notes

1. This root must use a Terraform state separate from the main `terraform/` root.
2. The OIDC provider is unique per AWS account and provider URL. If `https://token.actions.githubusercontent.com` already exists in this AWS account, do not create a duplicate. Import/manage the existing provider deliberately or adapt this configuration to reference it.
3. If your existing ECR repositories use a different name prefix, set `project_name` to match. ECR repository names are immutable identifiers for existing repositories; do not casually rename them.
4. The OIDC provider configuration intentionally omits `thumbprint_list`. AWS documents that it validates OIDC TLS certificates against its trusted root CA library when applicable, and the Terraform AWS provider marks `thumbprint_list` optional. For GitHub Actions, do not maintain a hard-coded thumbprint unless a specific AWS validation scenario requires it.
5. `terraform destroy` from this root can delete its ECR repositories and the images they contain. Use caution.

## Use

From this directory:

```bash
terraform init
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your actual GitHub owner and repo.
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Review the plan. It should not include EKS, VPC, RDS, NAT Gateway, SQS, EventBridge, or Argo CD.

## GitHub repository variables

Under GitHub repository **Settings → Secrets and variables → Actions → Variables**, set:

- `AWS_REGION`: same region as `aws_region`
- `AWS_ROLE_ARN`: output `github_actions_role_arn`
- `ECR_REPOSITORY_PREFIX`: same value as `project_name`

The image names will be `${project_name}/api`, `${project_name}/worker`, and `${project_name}/frontend`.

The workflow needs `permissions: id-token: write` and `contents: read`, and should authenticate using `aws-actions/configure-aws-credentials` with `role-to-assume: ${{ vars.AWS_ROLE_ARN }}`. Do not store long-lived AWS access keys in GitHub.

## State backend

For an initial local test, Terraform uses local state by default. For team/shared use, configure an S3 backend and locking appropriate to your environment, with a state key separate from the application stack, for example `orderflow/ci/terraform.tfstate`.
