FROM node:17-alpine3.14

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY  package*.json ./

# Install packages
RUN npm ci --only=production

# Bundle app source
COPY . .

# Environment variables
ENV PORT=8000

# Export PORT
EXPOSE 8080

# Run protject
CMD ["node", "dist", "index.js"]
