FROM node:22-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app/ ./

RUN addgroup -g 1001 -S nodejs && \
    adduser -S mydocs -u 1001

RUN chown -R mydocs:nodejs /app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node app/healthcheck.js

CMD ["npm", "start"]