# Terraform State S3 Bucket

```bash
export AWS_REGION="us-east-1"
export TF_STATE_BUCKET="terraform-state-$(aws sts get-caller-identity --query Account --output text)"
```

```bash
aws s3api create-bucket \
  --bucket "$TF_STATE_BUCKET" \
  --region "$AWS_REGION"
```

```bash
aws s3api put-public-access-block \
  --bucket "$TF_STATE_BUCKET" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

```bash
aws s3api put-bucket-versioning \
  --bucket "$TF_STATE_BUCKET" \
  --versioning-configuration Status=Enabled
```

```bash
aws s3api put-bucket-encryption \
  --bucket "$TF_STATE_BUCKET" \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

```bash
aws s3api put-bucket-tagging \
  --bucket "$TF_STATE_BUCKET" \
  --tagging 'TagSet=[{Key=Name,Value=terraform-state},{Key=Project,Value=orderflow},{Key=Environment,Value=dev},{Key=ManagedBy,Value=terraform}]'
```

```bash
aws s3api head-bucket \
  --bucket "$TF_STATE_BUCKET"
```

```bash
aws s3api get-bucket-versioning \
  --bucket "$TF_STATE_BUCKET"
```

```bash
aws s3api get-bucket-encryption \
  --bucket "$TF_STATE_BUCKET"
```
