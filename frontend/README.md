# Frontend Setup

## Getting Started (Local Development)

### Prerequisites
- Node.js (latest LTS recommended)
- npm or yarn installed

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/luuducc/cryptocurrency-price-tracker.git
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory based on `.env.sample` and fill in your values:
   ```sh
   cp .env.sample .env
   ```
   Replace the placeholder with your ec2 ip:
   ```
   VITE_BASE_URL=http://public_ec2_ip/api/v1
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

The frontend should now be running at `http://localhost:5173/` (default Vite port).

---

## Deployment

### Build the Project
```sh
npm run build
```
This will create a `dist/` directory with the production-ready files.

### Deploying to EC2 with Nginx
1. Build the project:
   ```sh
   npm run build
   ```
2. Move the build files to the Nginx directory:
   ```sh
   sudo mv dist/* /var/www/html
   ```
3. Config Nginx

   Open the Nginx configuration file:
   ```sh
   sudo nano /etc/nginx/sites-available/default
   ```

   Replace the content with the following configuration:
   ```
   server {
      listen 80;
      server_name your-ec2-public-ip;

      location / {
         root /var/www/html;
         index index.html;
         try_files $uri /index.html;
      }

      location /api/ {
         proxy_pass http://localhost:3000/;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
   }
   ```
4. Restart Nginx:
   ```sh
   sudo systemctl restart nginx
   ```
5. Setup EC2 inbound rule
   Create custom TCP rule allow all IPs from port 3000

Your frontend should now be accessible at `http://your-ec2-ip/`.

---

## Environment Variables
- **VITE_BASE_URL**: The backend API base URL.
  - Example:
    ```sh
    VITE_BASE_URL=http://your-backend-server.com/api/v1
    ```

Ensure the `.env` file follows the `.env.sample` structure and contains the correct values before running the project.

