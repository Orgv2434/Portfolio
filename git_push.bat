@echo off
chcp 65001 >nul
cd /d "d:\000_收集箱\作品集\网站"

echo ===== 配置 Git 用户信息 =====
git config --global user.email "2569758095@qq.com"
git config --global user.name "Orgv2434"

echo.
echo ===== 检查 Git 状态 =====
git status

echo.
echo ===== 添加文件到暂存区 =====
git add .

echo.
echo ===== 提交更改 =====
git commit -m "网站最初框架"

echo.
echo ===== 推送到远程仓库 =====
git push -u origin main

echo.
echo ===== 完成！=====
pause
