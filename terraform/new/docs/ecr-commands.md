## List Repository

```bash
aws ecr describe-repositories --query "repositories[].repositoryName"
```

## Delete Worker repo

```bash
aws ecr delete-repository --repository-name orderflow/worker --force
aws ecr delete-repository --repository-name orderflow/frontend --force
aws ecr delete-repository --repository-name orderflow/api --force
```
