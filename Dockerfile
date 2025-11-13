# Stage 1: Build the TypeScript application
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of your source code
COPY . .

# Compile TypeScript to JavaScript (assuming your tsconfig outputs to /dist)
RUN yarn run build 
# NOTE: Ensure your package.json has a 'build' script, e.g., "tsc"

# ----------------------------------------------------------------------

# Stage 2: Create a smaller, production-ready image
FROM node:20-alpine AS final

WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/dist ./dist 
# This is the crucial part: you are copying the compiled code

# Define the command to run your compiled application
CMD ["node", "dist/src/index.js"] 