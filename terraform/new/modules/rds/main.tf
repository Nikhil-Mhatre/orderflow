
# Allow PostgreSQL connections from the specified EKS security group.
resource "aws_security_group" "database" {
  name        = "${var.prefix}-postgres"
  description = "Allow PostgreSQL traffic from approved EKS workloads."
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from EKS"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
  }

  # Permit outbound traffic for database operations and AWS integrations.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.common_tags
}

# Create the PostgreSQL database and its supporting subnet group.
module "postgres" {
  source  = "terraform-aws-modules/rds/aws"
  version = "7.2.2"

  identifier = "${var.prefix}-postgres"

  # PostgreSQL engine configuration.
  engine         = "postgres"
  engine_version = 16
  instance_class = "db.t4g.micro"

  # Storage configuration, including automatic storage scaling.
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true

  # Database and master-user configuration.
  db_name                     = var.db_name
  username                    = var.db_username
  manage_master_user_password = true

  # Create the DB subnet group from the supplied private subnets.
  create_db_subnet_group = true
  subnet_ids             = var.private_subnet_ids

  # Keep the database private and associate its security group.
  vpc_security_group_ids = [aws_security_group.database.id]
  publicly_accessible    = false

  # Availability and recovery settings.
  multi_az                   = false
  backup_retention_period    = 1
  auto_minor_version_upgrade = true
  copy_tags_to_snapshot      = true

  # Preserve a final snapshot when the database is deleted.
  skip_final_snapshot              = false
  final_snapshot_identifier_prefix = "${var.prefix}-postgres-final"
  deletion_protection              = var.db_deletion_protection

  # Export PostgreSQL and upgrade logs to CloudWatch.
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  create_cloudwatch_log_group     = true

  # Use AWS-managed default parameter and option groups where applicable.
  create_db_parameter_group = false
  create_db_option_group    = false

  tags = var.common_tags
}
