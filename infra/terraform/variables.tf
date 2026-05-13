variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  default     = "prod"
}

variable "db_password" {
  description = "Database password"
  sensitive   = true
}
