output "cluster_name" { value = module.eks.cluster_name }
output "cluster_endpoint" { value = module.eks.cluster_endpoint }
output "ecr_repository_urls" { value = { for k, v in aws_ecr_repository.service : k => v.repository_url } }
output "database_endpoint" { value = aws_db_instance.postgres.address }
output "event_bus_name" { value = aws_cloudwatch_event_bus.app.name }
output "sqs_queue_url" { value = aws_sqs_queue.events.url }
output "sqs_dlq_url" { value = aws_sqs_queue.dlq.url }
output "github_actions_role_arn" { value = aws_iam_role.github_actions.arn }
