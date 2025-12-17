# 基于官方 Node 轻量镜像
FROM node:20-alpine

# 工作目录
WORKDIR /app

# 仅拷贝依赖声明文件，先安装依赖（提升缓存利用率）
COPY package*.json ./

RUN npm ci || npm install

# 再拷贝其余源代码
COPY . .

# Vite 默认开发端口
EXPOSE 5173

# 默认启动命令：运行 Vite dev server，监听 0.0.0.0:5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
