#!/bin/bash

echo "Đang cập nhật hệ thống..."
sudo apt-get update -y

echo "Đang cài đặt Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

echo "Cấp quyền Docker cho user Ubuntu..."
sudo usermod -aG docker ubuntu

echo "Cài đặt hoàn tất! Vui lòng thoát (exit) và SSH lại để quyền có hiệu lực."