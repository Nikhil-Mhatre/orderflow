output "vpc_id" {
  value = module.vpc.vpc_id
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ecr_repository_urls" {
  value = { for name, repo in aws_ecr_repository.service : name => repo.repository_url }
}

output "database_endpoint" {
  value = aws_db_instance.postgres.address
}

output "database_name" {
  value = aws_db_instance.postgres.db_name
}

output "database_master_secret_arn" {
  value     = aws_db_instance.postgres.master_user_secret[0].secret_arn
  sensitive = true
}

output "event_bus_name" {
  value = aws_cloudwatch_event_bus.orders.name
}

output "event_bus_arn" {
  value = aws_cloudwatch_event_bus.orders.arn
}

output "processing_queue_url" {
  value = aws_sqs_queue.processing.url
}

output "processing_queue_arn" {
  value = aws_sqs_queue.processing.arn
}

output "processing_dlq_arn" {
  value = aws_sqs_queue.processing_dlq.arn
}

output "eventbridge_delivery_dlq_arn" {
  value = aws_sqs_queue.eventbridge_dlq.arn
}

output "worker_iam_role_arn" {
  value = aws_iam_role.worker.arn
}

output "github_actions_role_arn" {
  value = aws_iam_role.github_actions.arn
}

output "argocd_namespace" {
  value = helm_release.argocd.namespace
}
