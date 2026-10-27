# Create S3 Bucket for Terraform Remote State

## 1. Prerequisites

- AWS CLI installed.
- AWS credentials configured with permission to create and manage S3 buckets.
- A unique S3 bucket name.

Verify your AWS configuration:

```bash
aws sts get-caller-identity
```

## 2. Set Variables

Replace the bucket name with a globally unique name.

```bash
export AWS_REGION="us-east-1"
export BUCKET_NAME="ordeflow-tfstate-475703"
```

## 3. Create the S3 Bucket

For the US East (`us-east-1`):

```bash
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$AWS_REGION"
```

Enable versioning to preserve previous versions of Terraform state files:

```bash
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled
```

Enable default server-side encryption:

```bash
aws s3api put-bucket-encryption \
  --bucket "$BUCKET_NAME" \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'
```

Block public access:

```bash
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

## 4. Verify the Bucket

List the bucket:

```bash
aws s3 ls
```

Check versioning:

```bash
aws s3api get-bucket-versioning \
  --bucket "$BUCKET_NAME"
```

## 5. Configure Terraform Backend

Add the following configuration to your Terraform root module's `backend.tf` file:

```hcl
terraform {
  backend "s3" {
    bucket       = "ordeflow-tfstate-475703"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

Replace the bucket name with the name you created.

Initialize Terraform:

```bash
terraform init
```

**Note:** The S3 backend requires the bucket to exist before initialization. `use_lockfile = true` enables native S3 state locking and requires appropriate S3 permissions. Keep the state bucket separate from the infrastructure managed by the Terraform configuration that uses it.

## 6. Delete the S3 Bucket

**Warning:** Deleting the bucket can permanently destroy Terraform state and its version history. Back up the state first and ensure no active Terraform configuration depends on it.

For a bucket without objects:

```bash
aws s3api delete-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$AWS_REGION"
```

For a bucket containing objects, delete the current objects first:

```bash
aws s3 rm "s3://$BUCKET_NAME" --recursive
```

If versioning is enabled, deleting current objects does not remove all previous versions or delete markers. To permanently empty a versioned bucket, use a script that deletes all object versions and delete markers:

```bash
while true; do
  VERSIONS=$(aws s3api list-object-versions \
    --bucket "$BUCKET_NAME" \
    --output json)

  COUNT=$(echo "$VERSIONS" | jq \
    '[(.Versions // [])[], (.DeleteMarkers // [])[]] | length')

  if [ "$COUNT" -eq 0 ]; then
    break
  fi

  echo "$VERSIONS" | jq -c \
    '{Objects: [((.Versions // []) + (.DeleteMarkers // []))[] | {Key: .Key, VersionId: .VersionId}], Quiet: true}' \
    > /tmp/s3-delete-batch.json

  aws s3api delete-objects \
    --bucket "$BUCKET_NAME" \
    --delete file:///tmp/s3-delete-batch.json
done
```

The script requires `jq` and appropriate S3 permissions. Review the target bucket and deletion list before running it.

Finally, delete the empty bucket:

```bash
aws s3api delete-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$AWS_REGION"
```

## Summary

- Create the S3 bucket before running `terraform init`.
- Enable versioning, encryption, and public access blocking.
- Use native S3 state locking with `use_lockfile = true`.
- Never delete a state bucket while it is still needed by active Terraform configurations.
