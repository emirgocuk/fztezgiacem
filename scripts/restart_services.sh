#!/bin/bash
# Restart script for fztezgiacem server
# Usage: Run this on the server directly via: ssh root@45.155.19.221 'bash -s' < restart_services.sh

echo "Checking service status..."
systemctl status fztezgiacem --no-pager

echo ""
echo "Restarting fztezgiacem service..."
systemctl restart fztezgiacem

echo ""
echo "Restarting nginx..."
systemctl restart nginx

echo ""
echo "Service status:"
systemctl is-active fztezgiacem
systemctl is-active nginx

echo ""
echo "Done! Services restarted."
