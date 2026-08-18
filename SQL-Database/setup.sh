#!/bin/bash

# Database Setup Script - Run this once to setup production database

echo "Employee Management System - Database Setup"
echo "============================================"
echo ""

read -p "Enter MySQL host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter MySQL user (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Enter MySQL password: " DB_PASSWORD
echo ""

echo ""
echo "Creating database and tables..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD < employee_management_db.sql

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update Backend-dacn/.env with these credentials:"
    echo "   DB_HOST=$DB_HOST"
    echo "   DB_USER=$DB_USER"
    echo "   DB_PASSWORD=$DB_PASSWORD"
    echo ""
    echo "2. Test the connection:"
    echo "   mysql -h $DB_HOST -u $DB_USER -p -e 'USE employee_management_db; SHOW TABLES;'"
else
    echo "✗ Database setup failed!"
    exit 1
fi
