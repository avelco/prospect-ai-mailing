# Stage 1: Build the React app
FROM node:22.15.0-bookworm-slim AS builder
WORKDIR /app

# Install pnpm globally (this layer rarely changes)
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Optimization Start ---

# 1. Copy only package manifests first
COPY ../package.json ../pnpm-lock.yaml* ./
# *Include pnpm-lock.yaml if it exists at that location

# 2. Install dependencies (this layer is cached if manifests don't change)
#    Use --frozen-lockfile for CI/Docker consistency
RUN pnpm install --frozen-lockfile

# 3. Copy the rest of your application code
#    Ensure you have a .dockerignore file (see below)
COPY .. .

# --- Optimization End ---

# 4. Build the application (this layer is cached if source code hasn't changed since last install)
RUN pnpm run build

# Stage 2: Serve with nginx (usually fast, no changes needed here)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Assuming nginx.conf is in ../docker/nginx.conf relative to the Dockerfile context
COPY --from=builder /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 9041
CMD ["nginx", "-g", "daemon off;"]
