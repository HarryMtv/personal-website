# syntax=docker/dockerfile:1

# ---- Base: Node 26 + pnpm via corepack ----
FROM node:26-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@0.36.0 && corepack enable
WORKDIR /app

# ---- Install dependencies (cacheable layer) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS build
# Site URL and contact transport are baked into the client bundle.
ARG VITE_SITE_URL
ARG VITE_CONTACT_ENDPOINT
ARG VITE_CONTACT_ACCESS_KEY
ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_CONTACT_ENDPOINT=${VITE_CONTACT_ENDPOINT}
ENV VITE_CONTACT_ACCESS_KEY=${VITE_CONTACT_ACCESS_KEY}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- Runtime: static files served by nginx ----
FROM nginx:1.30-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
