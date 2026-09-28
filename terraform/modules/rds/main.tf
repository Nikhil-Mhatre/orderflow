# -----------------------------------------------------------------------------
# RDS Security Group
# -----------------------------------------------------------------------------

resource "aws_security_group" "database" {
  name        = "${var.project_name}-${var.environment}-rds"
  description = "Security group for the OrderFlow PostgreSQL database"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL access from EKS worker nodes"
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    security_groups = [var.application_security_group_id]
  }

  egress {
    description = "Allow outbound traffic"
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-sg"
  }
}

# -----------------------------------------------------------------------------
# RDS DB Subnet Group
# -----------------------------------------------------------------------------

resource "aws_db_subnet_group" "this" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}

# -----------------------------------------------------------------------------
# PostgreSQL Database
# -----------------------------------------------------------------------------

resource "aws_db_instance" "postgres" {
  identifier = "${var.project_name}-${var.environment}-postgres"

  engine = "postgres"

  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.database_name
  username = var.database_username

  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.database.id]

  publicly_accessible = false

  multi_az = false

  backup_retention_period = 1

  deletion_protection = false
  skip_final_snapshot = true

  auto_minor_version_upgrade = true

  copy_tags_to_snapshot = true

  tags = {
    Name = "${var.project_name}-${var.environment}-postgres"
  }
}
