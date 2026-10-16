resource "aws_db_subnet_group" "postgres" {
  name = "${local.name}-postgres"
  subnet_ids = module.vpc.database_subnets
}
resource "aws_security_group" "postgres" {
  name = "${local.name}-postgres"
  description = "PostgreSQL access from EKS nodes"
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = [module.eks.node_security_group_id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
resource "random_password" "database" {
  length = 32
  special = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}
resource "aws_db_instance" "postgres" {
  identifier = "${local.name}-postgres"
  engine = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class
  allocated_storage = 20
  max_allocated_storage = 100
  db_name = var.db_name
  username = var.db_username
  password = random_password.database.result
  port = 5432
  db_subnet_group_name = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.postgres.id]
  publicly_accessible = false
  storage_encrypted = true
  kms_key_id = aws_kms_key.app.arn
  backup_retention_period = var.db_backup_retention_days
  deletion_protection = false
  skip_final_snapshot = true
  auto_minor_version_upgrade = true
  apply_immediately = true
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
}
