# ใช้ Node.js LTS เป็น Base Image
FROM node:20-alpine

# กำหนด working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# บอก Docker ว่าพอร์ต 3000 จะถูกใช้
EXPOSE 3000

# คำสั่งรันแอป
CMD ["npm", "start"]
